import { Module } from "@nestjs/common";
import { JobService } from "./jobs.service";
import { PlaceOfInterestAvailabilityModelModule } from "src/database/availabilityOfPlaces/PlaceOfInterestAvailabilityModel.module";
import { CodaViewUpdateDateModule } from "src/database/availabilityOfPlaces/codaViewUpdateDate/CodaViewUpdateDate.module";
import { CodaService } from "src/coda/coda.service";
import { ActorService } from "src/com/mtronic/fahs/service/actor.service";
import { AirbnbCalendarMapper } from "src/com/mtronic/fahs/mapper/airbnb-calendar.mapper";
@Module({
    imports: [PlaceOfInterestAvailabilityModelModule, CodaViewUpdateDateModule],
    providers: [
        JobService,
        CodaService,
        ActorService,
        AirbnbCalendarMapper
    ],
    exports: [JobService]
})
export class JobsModule {}