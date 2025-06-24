import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodaModule } from './coda/coda.module';
import { TrackingModule } from './primera-prueba/tracking.module';
import { ActorModule } from './com/mtronic/fahs/service/actor.module';
import { FahsModule } from './com/mtronic/fahs/controller/fahs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { GetAndSaveAvailablePlacesModule } from './tasks/get-and-save-available-places.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URI),
        ScheduleModule.forRoot(),
        CodaModule,
        TrackingModule,
        FahsModule,
        ActorModule,
        GetAndSaveAvailablePlacesModule
        /*PlaceModule*/
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
