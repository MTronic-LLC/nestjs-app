import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AvailablePlace } from './available-place-interface';

@Injectable()
export class AvailablePlaceService {
    constructor(@InjectModel('Place') private availablePlaceModel: Model<AvailablePlace>) {}
    
    async createPlace(place: AvailablePlace): Promise<AvailablePlace> {
        try {
            const createdPlace = new this.availablePlaceModel(place);
            const savedPlace = await createdPlace.save();
            return savedPlace;
        } catch (error) {
            if (error.name === 'MongoServerError' && (error.code === 11000 || error.code === 11001)) {
                throw new Error(`A place with the same airbnb_id already exists: ${error.keyValue.airbnb_id}`);
            } else {
                throw error;
            }
        }
    }

    async getAllPlaces(): Promise<AvailablePlace[]> {
        return await this.availablePlaceModel.find().exec();
    }

    async dropAllPlaces(): Promise<void> {
        await this.availablePlaceModel.deleteMany({});
    }
}