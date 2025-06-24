import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { AvailablePlace } from './available-place-interface';
import { DateData, LocationDetailsDtos, MonthData } from 'node_modules/@mtronic-llc/fahs-common-test/dist';

@Injectable()
export class AvailablePlaceService {
    constructor(
        @InjectModel('Place') private availablePlaceModel: Model<AvailablePlace>
    ) {}
    
    async createPlace(place: AvailablePlace): Promise<{ place: AvailablePlace; placeExists: boolean }> {
        const existing = await this.availablePlaceModel.findOne({ airbnb_id: place.airbnb_id });
        const updatedPlace = await this.availablePlaceModel.findOneAndUpdate(
            { airbnb_id: place.airbnb_id },
            { $set: place },
            { new: true, upsert: true }
        ).exec();

        return {
            place: updatedPlace,
            placeExists: !!existing
        };
    }

    async getAllPlaces(): Promise<AvailablePlace[]> {
        return await this.availablePlaceModel.find().exec();
    }

    async dropAllPlaces(): Promise<void> {
        await this.availablePlaceModel.deleteMany({});
    }

    async getPlacesUpdatedToday(): Promise<AvailablePlace[]> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        return await this.availablePlaceModel.find({
            updatedAt: { $gte: startOfDay, $lte: endOfDay }
        }).exec();
    }

    public calculateAvailabilityPercentForStays(
        places: (LocationDetailsDtos | (AvailablePlace & Document))[],
        checkin: string,
        checkout: string
    ): LocationDetailsDtos[] {
        const result: LocationDetailsDtos[] = [];
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);

        function isMongooseDoc(place: LocationDetailsDtos | (AvailablePlace & Document)): place is AvailablePlace & Document {
            return typeof (place as Document).toObject === 'function';
        }

        for (let place of places) {
            if (isMongooseDoc(place)) {
                place = place.toObject() as LocationDetailsDtos;
            }

            let availableDaysCount = 0;
            let currentDate = new Date(checkinDate);
            const lastDate = new Date(checkoutDate);
            lastDate.setDate(lastDate.getDate() - 1);

            while (currentDate <= lastDate) {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                const day = currentDate.getDate();

                const monthData = place.monthAvailability?.find(
                    (m: MonthData) => m.year === year && m.month === month
                );

                if (monthData) {
                    const dateData = monthData.dates.find((d: DateData) => {
                        const dDate = new Date(d.date);
                        return (
                            dDate.getFullYear() === year &&
                            dDate.getMonth() + 1 === month &&
                            dDate.getDate() === day &&
                            d.available
                        );
                    });

                    if (dateData) {
                        availableDaysCount++;
                    }
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }

            const totalRequestedDays = Math.round((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));
            const availabilityPercent = totalRequestedDays > 0
                ? Math.round((availableDaysCount / totalRequestedDays) * 100)
                : 0;

            result.push({
                ...place,
                availabilityDates: {
                    availabilityPercent,
                    checkin,
                    checkout,
                },
            });
        }

        return result;
    }

   async getPlacesAvailabilityBetweenDates(checkin: string, checkout: string, regions: string[]) {
        const places = await this.availablePlaceModel.find({
            'queryCity.id': { $in: regions },
            rejected: false
        }).exec();
        const placesDocs = places.map(doc => doc.toObject());

        return this.calculateAvailabilityPercentForStays(placesDocs, checkin, checkout)
    }
    async rejectPlacesWithIds(ids: string[]): Promise<void> {
        if (!ids || ids.length === 0) {
            throw new Error('No IDs provided for rejection');
        }

        try {
            await this.availablePlaceModel.updateMany(
                { airbnb_id: { $in: ids } },
                { $set: { rejected: true } }
            );
            console.log(`Places with IDs ${ids.join(', ')} have been marked as rejected.`);
        } catch (error) {
            console.error('Error rejecting places:', error);
            throw error;
        }
    }

    async filterIdsByRejected(ids: string[], refresh: boolean): Promise<string[]> {
        if (!ids || ids.length === 0) {
            return [];
        }

        const places = await this.availablePlaceModel.find({
            airbnb_id: { $in: ids }
        }).exec();

        if (refresh) {
            const existingIds = new Set(places.map(place => place.airbnb_id));
            return ids.filter(id => !existingIds.has(id));
        } else {
            return places
                .filter(place => place.rejected === false && place.inCoda === false)
                .map(place => place.airbnb_id);
        }
    }
}