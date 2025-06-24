import {AirbnbStaySearchDto, SearchResult} from "../dto/actor/airbnb-stay-search.dto";
import { HttpException, Injectable } from "@nestjs/common";
import { LocationsByRegion, LocationDetailsDtos } from "@mtronic-llc/fahs-common-test";
import { AvailablePlaceService } from "src/database/stay-search-places/available-place.service";
import { AirbnbCalendarMapper } from "./airbnb-calendar.mapper";
@Injectable()
export class AirbnbStaySearchMapper {
    constructor (
        private readonly availablePlaceService: AvailablePlaceService,
        private readonly airbnbCalendarMapper: AirbnbCalendarMapper
    ) {}

    public mapAirbnbStaySearchDtoToPlaceOfInterestAvailabilityDto(
        airbnbStaySearchDtos: SearchResult[], checkin: string, checkout: string): LocationsByRegion {
        let staysSearchAvailibilityByCityDtos: LocationsByRegion = {
            places: []
        };
        for (const airbnbStaySearchDto of airbnbStaySearchDtos) {
            if (!airbnbStaySearchDto.listing || !airbnbStaySearchDto.listing.id || !airbnbStaySearchDto.listing.city || !airbnbStaySearchDto.listing.name) {
                throw new HttpException('Error al mapear los resultados de la busqueda', 500);
            }
            let totalPrice = airbnbStaySearchDto.pricingQuote?.structuredStayDisplayPrice?.secondaryLine?.price;
            let pricePerNight = airbnbStaySearchDto.pricingQuote?.structuredStayDisplayPrice?.primaryLine?.price ||
                airbnbStaySearchDto.pricingQuote?.structuredStayDisplayPrice?.primaryLine?.discountedPrice;
            if (totalPrice === undefined) {
                totalPrice = airbnbStaySearchDto.pricingQuote?.structuredStayDisplayPrice?.primaryLine?.price ||
                    airbnbStaySearchDto.pricingQuote?.structuredStayDisplayPrice?.primaryLine?.discountedPrice;
                pricePerNight = undefined;
            }
            const picturesUrl = [];
            airbnbStaySearchDto.listing.contextualPictures.forEach(pictureData => {
                if (pictureData.picture) {
                    picturesUrl.push(pictureData.picture);
                }
            }
            );

            const parsedPlaceOfInterestAvailabilityDtos = new LocationDetailsDtos(
                airbnbStaySearchDto.listing.id,
                pricePerNight,
                totalPrice,
                airbnbStaySearchDto.listing.localizedCityName,
                airbnbStaySearchDto.listing.city,
                airbnbStaySearchDto.listing.name,
                airbnbStaySearchDto.listing.roomTypeCategory,
                {latitude: airbnbStaySearchDto.listing.coordinate.latitude, longitude: airbnbStaySearchDto.listing.coordinate.longitude},
                airbnbStaySearchDto.listing.avgRatingLocalized,
                picturesUrl,
                {
                    checkin,
                    checkout, 
                    availabilityPercent: 0
                },
                [],
                {
                    name: airbnbStaySearchDto.listing.queryCity.name,
                    id: airbnbStaySearchDto.listing.queryCity.id
                }
            );
    
            staysSearchAvailibilityByCityDtos.places.push(parsedPlaceOfInterestAvailabilityDtos);
        }
        /*try {
        //localizedCityName
            airbnbStaySearchDtos.map(airbnbStaySearchDto => {
                const city = airbnbStaySearchDto.city;
                const placesDataParsed = [];
                airbnbStaySearchDto.data.map(place => {
                    console.log(place);
                    console.log(`Processing search result for listing ID: ${place.listing.id}`);
                        
                    if (!place.listing || !place.listing.id || !place.listing.city || !place.listing.name) {
                        throw new HttpException('Error al mapear los resultados de la busqueda', 500);
                    }
                    //console.log(`Processing place: ${place.data.presentation.staysSearch.results.searchResults.length} search results found for city: ${city}`);
                    
                    let totalPrice = place.pricingQuote?.structuredStayDisplayPrice?.secondaryLine?.price;
                    let pricePerNight = place.pricingQuote?.structuredStayDisplayPrice?.primaryLine?.price || place.pricingQuote?.structuredStayDisplayPrice?.primaryLine?.discountedPrice;
                    
                    if (totalPrice === undefined) {
                        totalPrice = place.pricingQuote?.structuredStayDisplayPrice?.primaryLine?.price || place.pricingQuote?.structuredStayDisplayPrice?.primaryLine?.discountedPrice;
                        pricePerNight = undefined;
                    }

                    const picturesUrl = [];

                    place.listing.contextualPictures.map(pictureData => {
                        if (pictureData.picture) {
                            picturesUrl.push(pictureData.picture);
                        }
                    });

                    const parsedPlaceOfInterestAvailabilityDtos = new LocationDetailsDtos(
                        place.listing.id,
                        pricePerNight,
                        totalPrice,
                        city,
                        place.listing.city,
                        place.listing.name,
                        place.listing.roomTypeCategory,
                        {latitude: place.listing.coordinate.latitude, longitude: place.listing.coordinate.longitude},
                        place.listing.avgRatingLocalized,
                        picturesUrl,
                        {checkin, checkout}
                    );
                    //this.availablePlaceService.createPlace(parsedPlaceOfInterestAvailabilityDtos);
                    placesDataParsed.push(parsedPlaceOfInterestAvailabilityDtos);

                    return placesDataParsed;
                });

                console.log('Count of places obtained: ' + placesDataParsed.length);
                const staySearchAvailibilityByCityDtos: LocationsByRegion = {
                    city, 
                    places: placesDataParsed
                }
                staysSearchAvailibilityByCityDtos.push(staySearchAvailibilityByCityDtos);
            });
        } catch (error) {
            console.error(error);
            throw new HttpException('Error al mapear los resultados de la busqueda', 500);
        }*/

        return staysSearchAvailibilityByCityDtos;
    }
}
