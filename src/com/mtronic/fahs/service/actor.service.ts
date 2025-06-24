import axios from "axios";
import { BackendActorAvailabilityQuery } from "@mtronic-llc/fahs-common";
import { BackendActorPlacesQuery, DateData, LocationDetailsDtos, MonthData } from "@mtronic-llc/fahs-common-test";
import { HttpException, Injectable } from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ApifyClient} from "apify-client";
import {LocationsByRegion} from "@mtronic-llc/fahs-common-test";
import {LocationAvailabilityDtosResponse} from "@mtronic-llc/fahs-common-test";
import {AirbnbLocationCalendarErrorDto} from "../dto/actor/airbnb-location-calendar.dto-ERROR";
import {AirbnbLocationCalendarDto} from "../dto/actor/airbnb-location-calendar.dto";
import {AirbnbStaySearchDto, SearchResult} from "../dto/actor/airbnb-stay-search.dto";
import {getActorServerUrl} from "../../../../utils/utils";
import {AirbnbCalendarMapper} from "../mapper/airbnb-calendar.mapper";
import {AirbnbStaySearchMapper} from "../mapper/airbnb-stay-search.mapper";
import { AvailablePlaceService } from "src/database/stay-search-places/available-place.service";
import { CodaService } from "src/coda/coda.service";

@Injectable()
export class ActorService {
    constructor (
        private configService: ConfigService, 
        private airbnbCalendarMapper: AirbnbCalendarMapper, 
        private airbnbStaySearchMapper: AirbnbStaySearchMapper, 
        private availablePlaceService: AvailablePlaceService,
        private codaService: CodaService
    ) {}

    public processAndSavePlaces = async (mappedArrayOfPlaces: LocationsByRegion[]) => {
        
    };

    public parseLocalDate(dateString: string): Date {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    }
    public async getIdsOfUbications (ubications: string[]) {
        try {
            const apifyClient = new ApifyClient({
                token: this.configService.get<string>('APIFY_API_KEY')
            });
            const runActor = await apifyClient.actor('ccJyNmz7QdWIahg10').call({
                ids: ['00000'],
                query: "ubication",
                ubication: ubications
            });
            const { items } = await apifyClient.dataset(runActor.defaultDatasetId).listItems();
            return items;
        } catch (error) {
            console.error('Error al obtener el ID de la ubicación:', error);
            throw new HttpException('Error al obtener el ID de la ubicación', 500);
        }
    }

    public async getAvailablePlacesFromRegions (input: BackendActorPlacesQuery): Promise<LocationsByRegion> {
        let airbnbStaySearchDto: AirbnbStaySearchDto[];
        const mappedArrayOfPlaces: LocationsByRegion[] = [];
        const ENDPOINT = '/getAvailablePlacesFromRegions';
        const ENV =  process.env.NODE_ENV;

        try {
            console.log('this is the ' + ENV + ' environment');

            if (ENV === 'test') {
                const airbnbStaySearchAxiosResponse = await axios.get<AirbnbStaySearchDto[]>(getActorServerUrl() + ENDPOINT);
                if (airbnbStaySearchAxiosResponse.status === 200)
                    airbnbStaySearchDto = airbnbStaySearchAxiosResponse.data as AirbnbStaySearchDto[];
            } else {
                const checkinDate = new Date(input.checkin);
                const checkoutData = new Date(input.checkout);
                const apifyClient = new ApifyClient({
                    token: this.configService.get<string>('APIFY_API_KEY')
                });
                const runActor = await apifyClient.actor('ccJyNmz7QdWIahg10').call({
                    ids: ['00000'],
                    query: "places",
                    regions: input.regions,
                    checkin: checkinDate.toISOString().split('T')[0],
                    checkout: checkoutData.toISOString().split('T')[0],
                    nroPagesToObtain: input.pagesToFetch,
                    interval: input.interval || 1
                });
                const { items: apifyClientAirbnbStaySearchResponseArry } = await apifyClient.dataset(runActor.defaultDatasetId).listItems();
                const mappedResponse = this.airbnbStaySearchMapper
                    .mapAirbnbStaySearchDtoToPlaceOfInterestAvailabilityDto(apifyClientAirbnbStaySearchResponseArry as unknown as SearchResult[], input.checkin, input.checkout);
                mappedArrayOfPlaces.push(mappedResponse[0]);
                return mappedResponse;
            }
        } catch (error) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException('Error al ejecutar el actor', 500);
            }
        }
    }
    public async queryAvailablePlaces(input: BackendActorPlacesQuery) {
        try {
            const places = await this.getAvailablePlacesFromRegions(input);
            console.log('Available places count:', places.places.length);
            const filteredPlaces = await this.codaService.filterExistingPlacesSavedInCoda([places]);
            console.log('Filtered places count:', filteredPlaces[0].places.length);
            console.log("refreshed:", input.refresh);
            const ids = await this.availablePlaceService.getEligiblePlaceIds(
                filteredPlaces[0].places.map(place => place.airbnb_id),
                input.refresh
            );
            if (ids.length === 0) {
                console.log('No hay lugares disponibles para procesar');
                return [];
            }
            const availability = await this.getAvailabilityOfPlacesOfInterest({ ids });

            const finalPlaces: LocationDetailsDtos[] = [];
            for (const place of filteredPlaces[0].places) {
                const placeAvailability = availability.find(calendar => calendar.response.id === place.airbnb_id);
                if (placeAvailability && placeAvailability.response.kind === 'LocationAvailabilityDtos') {
                    place.monthAvailability = placeAvailability.response.monthAvailability;
                    finalPlaces.push(place);
                }
            }

            const saveResults = await Promise.all(
                finalPlaces.map(async finalPlace => {
                    const { place, placeExists } = await this.availablePlaceService.createPlace(finalPlace);
                    if (placeExists || place.rejected) {
                        return null;
                    } else {
                        return finalPlace;
                    }
                })
            );

            const filteredFinalPlaces = saveResults.filter(place => place !== null);

            console.log('Final places count:', filteredFinalPlaces.length);

            return filteredFinalPlaces.slice(0, 100);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException('Error al obtener los datos del actor', 500);
            }
        }
    }
   //TODO: Derek - cambiar el retorno de este metodo de any a objecto de JSON que viene de Airbnb
    public async getAvailabilityOfPlacesOfInterest (input: BackendActorAvailabilityQuery): Promise<LocationAvailabilityDtosResponse[]> {
        const ENDPOINT = '/getAvailabilityOfPlacesOfInterest';
        const ENV =  process.env.NODE_ENV;
        let airbnbLocationCalendarDtos: AirbnbLocationCalendarDto[];

        try {
            if (ENV === 'test') {
                console.log('this is the ' + process.env.NODE_ENV + ' environment');
                const airbnbCalendarAxiosResponse = await axios.get<AirbnbLocationCalendarDto[] | AirbnbLocationCalendarErrorDto[]>(getActorServerUrl() + ENDPOINT);
                if(airbnbCalendarAxiosResponse.status === 200)
                    airbnbLocationCalendarDtos = airbnbCalendarAxiosResponse.data as AirbnbLocationCalendarDto[];
            } else {
                console.log('this is the ' + process.env.NODE_ENV + ' environment');
                const apifyApiKey = this.configService.get<string>('APIFY_API_KEY');

                const apifyClient = new ApifyClient({
                    token: apifyApiKey
                });
                const runActor = await apifyClient.actor('ccJyNmz7QdWIahg10').call({
                    ids: input.ids,
                    query: "availability"
                });
                const {items: apifyClientAirbnbCalendarResponseArry} = await apifyClient.dataset(runActor.defaultDatasetId).listItems();
                airbnbLocationCalendarDtos = apifyClientAirbnbCalendarResponseArry as unknown as AirbnbLocationCalendarDto[];
            }
            //const calendarMonths = airbnbLocationCalendarDtos[0].data.data.merlin.pdpAvailabilityCalendar.calendarMonths;

            return this.airbnbCalendarMapper
                .mapAirbnbLocationCalendarDtoToLocationAvailabilityDto(airbnbLocationCalendarDtos);
        } catch (error) {
            console.error(error);
            throw new HttpException('Error al ejecutar el actor', 500);
        }
    }
}
