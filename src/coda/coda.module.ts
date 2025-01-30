import { Module } from '@nestjs/common';
import { CodaService } from './coda.service';
import { codaController } from './coda.controller';
import { JobsModule } from 'src/jobs/jobs.module';
import { PlaceOfInterestAvailabilityModelModule } from 'src/database/availabilityOfPlaces/PlaceOfInterestAvailabilityModel.module';

@Module({
    imports: [JobsModule],
    providers: [CodaService],
    controllers: [codaController],
})
export class CodaModule {}
