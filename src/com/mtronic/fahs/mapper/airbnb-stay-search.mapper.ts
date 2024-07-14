import {AirbnbStaySearchDto} from "../dto/actor/airbnb-stay-search.dto";
import { HttpException, Injectable } from "@nestjs/common";
import { LocationsByRegion, LocationDetailsDtos } from "@mtronic-llc/fahs-common-test";
import { AvailablePlaceService } from "src/database/stay-search-places/available-place.service";
@Injectable()
export class AirbnbStaySearchMapper {
    constructor (private readonly availablePlaceService: AvailablePlaceService) {}

    public mapAirbnbStaySearchDtoToPlaceOfInterestAvailabilityDto(
        airbnbStaySearchDtos: AirbnbStaySearchDto[], checkin: string, checkout: string): LocationsByRegion[] {
        let staysSearchAvailibilityByCityDtos: LocationsByRegion[] = [];
        try {
            airbnbStaySearchDtos.map(airbnbStaySearchDto => {
                const city = airbnbStaySearchDto.city;
                const placesDataParsed = [];

                airbnbStaySearchDto.data.map(place => {
                    place.data.presentation.staysSearch.results.searchResults.map(
                        searchResult => {
                            if (!searchResult.listing || !searchResult.listing.id || !searchResult.listing.city || !searchResult.listing.name) {
                                throw new HttpException('Error al mapear los resultados de la busqueda', 500);
                            }
                            let totalPrice = searchResult.pricingQuote?.structuredStayDisplayPrice?.secondaryLine?.price;
                            let pricePerNight = searchResult.pricingQuote?.structuredStayDisplayPrice?.primaryLine?.price || searchResult.pricingQuote?.structuredStayDisplayPrice?.primaryLine?.discountedPrice;
                            
                            if (totalPrice === undefined) {
                                totalPrice = searchResult.pricingQuote?.structuredStayDisplayPrice?.primaryLine?.price || searchResult.pricingQuote?.structuredStayDisplayPrice?.primaryLine?.discountedPrice;
                                pricePerNight = undefined;
                            }

                            const picturesUrl = [];

                            searchResult.listing.contextualPictures.map(pictureData => {
                                if (pictureData.picture) {
                                    picturesUrl.push(pictureData.picture);
                                }
                            });

                            const parsedPlaceOfInterestAvailabilityDtos = new LocationDetailsDtos(
                                searchResult.listing.id,
                                pricePerNight,
                                totalPrice,
                                city,
                                searchResult.listing.city,
                                searchResult.listing.name,
                                searchResult.listing.roomTypeCategory,
                                {latitude: searchResult.listing.coordinate.latitude, longitude: searchResult.listing.coordinate.longitude},
                                searchResult.listing.avgRatingLocalized,
                                picturesUrl,
                                {checkin, checkout}
                            );
                            //this.availablePlaceService.createPlace(parsedPlaceOfInterestAvailabilityDtos);
                            placesDataParsed.push(parsedPlaceOfInterestAvailabilityDtos);
                            //return parsedPlaceOfInterestAvailabilityDtos
                        });
                        return placesDataParsed;
                    }
                )
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
        }

        return staysSearchAvailibilityByCityDtos;
    }
}