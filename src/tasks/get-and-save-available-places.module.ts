import { Module } from "@nestjs/common";
import { ActorModule } from "src/com/mtronic/fahs/service/actor.module";
import { ActorService } from "src/com/mtronic/fahs/service/actor.service";
import { AvailablePlaceModule } from "src/database/stay-search-places/available-place.module";
import { AvailablePlaceService } from "src/database/stay-search-places/available-place.service";
import { GetAndSaveAvailablePlacesService } from "./get-and-save-available-places.service";
import { GetAndSaveAvailablePlaceController } from "./get-and-save-available-place.controller";

@Module({
    imports: [ActorModule, AvailablePlaceModule],
    controllers: [GetAndSaveAvailablePlaceController],
    providers: [ActorService, AvailablePlaceService, GetAndSaveAvailablePlacesService]
})
export class GetAndSaveAvailablePlacesModule {}