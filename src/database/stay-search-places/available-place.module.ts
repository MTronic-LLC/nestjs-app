import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AvailablePlaceSchema } from "./available-place.schema";
import { AvailablePlaceController } from "./available-place.controller";
import { AvailablePlaceService } from "./available-place.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Place', schema: AvailablePlaceSchema }])],
    providers: [AvailablePlaceService],
    controllers: [AvailablePlaceController],
    exports: [AvailablePlaceService]
})
export class AvailablePlaceModule {}