import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaceOfInterestAvailabilityModelService } from './PlaceOfInterestAvailabilityModel.service';
import { AvailabilityOfPlaceOfInterestSchema } from './PlaceOfInterestAvailability.schema';
import { CodaViewUpdateDate } from './codaViewUpdateDate/CodaViewUpdateDate.schema';
import { CodaService } from 'src/coda/coda.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'PlaceOfInterestAvailability', schema: AvailabilityOfPlaceOfInterestSchema },
            { name: 'CodaViewUpdateDate', schema: CodaViewUpdateDate }
        ])
    ],
    providers: [PlaceOfInterestAvailabilityModelService, CodaService],
    exports: [PlaceOfInterestAvailabilityModelService],
})
export class PlaceOfInterestAvailabilityModelModule {}