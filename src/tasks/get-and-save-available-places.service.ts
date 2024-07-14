import Bottleneck from "bottleneck";
import { LocationsByRegion } from "@mtronic-llc/fahs-common-test";
import { AvailablePlace } from "src/database/stay-search-places/available-place-interface";
import { Injectable } from "@nestjs/common";
import { AvailablePlaceService } from "src/database/stay-search-places/available-place.service";
import { ActorService } from "src/com/mtronic/fahs/service/actor.service";

@Injectable()
export class GetAndSaveAvailablePlacesService {
    constructor(
        private availablePlaceService: AvailablePlaceService,
        private actorService: ActorService
    ) {}

    async getAndSaveAvailablePlaces(mappedArrayOfPlaces: LocationsByRegion[]): Promise<void> {
        const limiter = new Bottleneck({
            maxConcurrent: 6
        });
    
        const tasks = mappedArrayOfPlaces.flatMap(mappedPlace =>
            mappedPlace.places.map(place => async () => {
                const availability = await this.actorService.getAvailabilityOfPlacesOfInterest({
                    ids: [place.airbnb_id]
                });
                const placeToSave: AvailablePlace = {
                    ...place,
                    availability: {
                        nextSixMonths: 0,
                        months: [{month: 0, year: 0, availabilityPercentage: 0}]
                    }
                };
                if (availability.length > 0 && availability[0].response.kind === 'LocationAvailabilityDtos') {
                    placeToSave.availability = {
                        nextSixMonths: availability[0].response.proxSeisMeses,
                        months: availability[0].response.meses.map(month => ({
                            month: month.mes,
                            year: month.año,
                            availabilityPercentage: month.porcentajeDisponibilidad
                        }))
                    };
                }
                await this.availablePlaceService.createPlace(placeToSave);
            })
        );
        await Promise.all(tasks.map(task => limiter.schedule(task)));
    }
}