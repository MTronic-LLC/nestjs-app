import { Controller, Delete, Get } from "@nestjs/common";
import { AvailablePlaceService } from "./available-place.service";
import { LocationDetailsDtos } from "@mtronic-llc/fahs-common-test";
import { AvailablePlace } from "./available-place-interface";

@Controller("db/stay-search-places")
export class AvailablePlaceController {
    constructor (private readonly availablePlaceService: AvailablePlaceService) {}
    /*@Get('test')
    async createTestPlace(): Promise<LocationDetailsDtos> {
        return this.availablePlaceService.createPlace();
    }*/

    @Get('places')
    async getAllPlaces(): Promise<AvailablePlace[]> {
        return this.availablePlaceService.getAllPlaces();
    }

    @Delete('places')
    async dropAllPlaces(): Promise<void> {
        await this.availablePlaceService.dropAllPlaces();
    }
}