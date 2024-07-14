import axios from "axios";
import Bottleneck from "bottleneck";
import { BackendActorAvailabilityQuery, BackendActorPlacesQuery } from "@mtronic-llc/fahs-common";
import { HttpException, Injectable } from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ApifyClient} from "apify-client";
import {LocationsByRegion} from "@mtronic-llc/fahs-common-test";
import {LocationAvailabilityDtosResponse} from "@mtronic-llc/fahs-common-test";
import {AirbnbLocationCalendarErrorDto} from "../dto/actor/airbnb-location-calendar.dto-ERROR";
import {AirbnbLocationCalendarDto} from "../dto/actor/airbnb-location-calendar.dto";
import {AirbnbStaySearchDto} from "../dto/actor/airbnb-stay-search.dto";
import {getActorServerUrl} from "../../../../utils/utils";
import {AirbnbCalendarMapper} from "../mapper/airbnb-calendar.mapper";
import {AirbnbStaySearchMapper} from "../mapper/airbnb-stay-search.mapper";
import { AvailablePlaceService } from "src/database/stay-search-places/available-place.service";
import { AvailablePlace } from "src/database/stay-search-places/available-place-interface";

@Injectable()
export class ActorService {
    constructor (
        private configService: ConfigService, 
        private airbnbCalendarMapper: AirbnbCalendarMapper, 
        private airbnbStaySearchMapper: AirbnbStaySearchMapper, 
        private availablePlaceService: AvailablePlaceService
    ) {}

    public processAndSavePlaces = async (mappedArrayOfPlaces: LocationsByRegion[]) => {
        
    };

    public async getAvailablePlacesFromRegions (input: BackendActorPlacesQuery): Promise<LocationsByRegion[]> {
        let airbnbStaySearchDto: AirbnbStaySearchDto[];
        const mappedArrayOfPlaces: LocationsByRegion[] = [];
        const ENDPOINT = '/getAvailablePlacesFromRegions';
        const ENV =  process.env.NODE_ENV;

        try {
            console.log('this is the ' + ENV + ' environment');
            const intervalDays = 30;
            const monthsToObtain = 1;
            console.log(`The queries are made by obtaining the data of available places in intervals of ${intervalDays} days`);
            if (ENV === 'test') {
                const airbnbStaySearchAxiosResponse = await axios.get<AirbnbStaySearchDto[]>(getActorServerUrl() + ENDPOINT);
                if (airbnbStaySearchAxiosResponse.status === 200)
                    airbnbStaySearchDto = airbnbStaySearchAxiosResponse.data as AirbnbStaySearchDto[];
            } else {

                let checkinDate = new Date(input.checkin);
                let checkoutDate = new Date(checkinDate.getTime() + (intervalDays * 24 * 60 * 60 * 1000));
                let checkinDateString = checkinDate.toISOString().split('T')[0];
                let checkoutDateString = checkoutDate.toISOString().split('T')[0];

                for (let i = 0; i < Math.round((monthsToObtain * 30) / intervalDays) ; i++) {
                    const apifyApiKey = this.configService.get<string>('APIFY_API_KEY');
                    const apifyClient = new ApifyClient({token: apifyApiKey});
                    const runActor = await apifyClient.actor('ccJyNmz7QdWIahg10').call({
                        ids: ['00000'],
                        bplaces: true,
                        regions: input.regions,
                        checkin: checkinDateString,
                        checkout: checkoutDateString,
                        nroPagesToObtain: 1
                    });

                    const { items: apifyClientAirbnbStaySearchResponseArry } = await apifyClient.dataset(runActor.defaultDatasetId).listItems();
                    const mappedResponse = this.airbnbStaySearchMapper.mapAirbnbStaySearchDtoToPlaceOfInterestAvailabilityDto(apifyClientAirbnbStaySearchResponseArry as unknown as AirbnbStaySearchDto[], checkinDateString, checkoutDateString)
                    mappedArrayOfPlaces.push(mappedResponse[0]);
                    checkinDate = checkoutDate;
                    checkoutDate = new Date(checkinDate.getTime() + (intervalDays * 24 * 60 * 60 * 1000));
                    checkinDateString = checkinDate.toISOString().split('T')[0];
                    checkoutDateString = checkoutDate.toISOString().split('T')[0];
                }
            }
            await this.processAndSavePlaces(mappedArrayOfPlaces);
            return mappedArrayOfPlaces;
        } catch (error) {
            console.error(error);
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException('Error al ejecutar el actor', 500);
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
                    bplaces: false
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
