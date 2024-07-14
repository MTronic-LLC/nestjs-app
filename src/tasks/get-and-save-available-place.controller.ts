import { Controller } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { GetAndSaveAvailablePlacesService } from "./get-and-save-available-places.service";
import { ActorService } from "src/com/mtronic/fahs/service/actor.service";

@Controller()
export class GetAndSaveAvailablePlaceController {
    constructor(
        private readonly getAndSAveAvailablePlaceService: GetAndSaveAvailablePlacesService,
        private readonly actorService: ActorService
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async getAndSaveAvailablePlaces(): Promise<void> {
        const today = new Date();
        const checkin = today.toISOString().split('T')[0];
        const checkout = new Date(today.setDate(today.getDate() + 2)).toISOString().split('T')[0];
        const mappedArrayOfPlaces = await this.actorService.getAvailablePlacesFromRegions({
            regions: ['Miami'],
            checkin,
            checkout
        })
        this.getAndSAveAvailablePlaceService.getAndSaveAvailablePlaces(mappedArrayOfPlaces);
    }
}