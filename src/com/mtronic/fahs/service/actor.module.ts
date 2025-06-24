import { Module } from "@nestjs/common";
import { ActorService } from "./actor.service";
import { CodaModule } from "../../../../coda/coda.module";
import { CodaService } from "../../../../coda/coda.service";
import {AirbnbCalendarMapper} from "../mapper/airbnb-calendar.mapper";
import {AirbnbStaySearchMapper} from "../mapper/airbnb-stay-search.mapper";
import {AvailablePlaceService} from "../../../../database/stay-search-places/available-place.service";
import {AvailablePlaceModule} from "src/database/stay-search-places/available-place.module";
@Module({
    imports: [CodaModule, AvailablePlaceModule],
    providers: [ActorService, CodaService, AvailablePlaceService, AirbnbCalendarMapper, AirbnbStaySearchMapper],
    exports: [AirbnbCalendarMapper, AirbnbStaySearchMapper, AvailablePlaceService, CodaService]
})
export class ActorModule {}
