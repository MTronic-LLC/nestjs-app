import { Module } from "@nestjs/common";
import { JobService } from "./jobs.service";
import { PlaceOfInterestAvailabilityModelModule } from "src/database/availabilityOfPlaces/PlaceOfInterestAvailabilityModel.module";
import { CodaViewUpdateDateModule } from "src/database/availabilityOfPlaces/codaViewUpdateDate/CodaViewUpdateDate.module";
import { CodaService } from "src/coda/coda.service";
import { ActorService } from "src/com/mtronic/fahs/service/actor.service";
import { AirbnbCalendarMapper } from "src/com/mtronic/fahs/mapper/airbnb-calendar.mapper";
import { AirbnbStaySearchMapper } from "src/com/mtronic/fahs/mapper/airbnb-stay-search.mapper";
import { AvailablePlaceService } from "src/database/stay-search-places/available-place.service";
import { AvailablePlaceModule } from "src/database/stay-search-places/available-place.module";
@Module({
    imports: [PlaceOfInterestAvailabilityModelModule, CodaViewUpdateDateModule, AvailablePlaceModule],
    providers: [
        JobService,
        CodaService,
        ActorService,
        AirbnbCalendarMapper,
        AirbnbStaySearchMapper
    ],
    exports: [JobService]
})
export class JobsModule {}