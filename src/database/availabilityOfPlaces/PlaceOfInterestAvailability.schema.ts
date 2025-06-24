import { Schema } from "mongoose";

export const AvailabilityOfPlaceOfInterestSchema = new Schema({
    id: { type: String, unique: true },
    active: { type: Boolean, require: true },
    host: String,
    coda_view_id: String,
    rowID: Number, 
    nextSixMonths: Number,
    monthAvailability: [{
        year: Number,
        month: Number,
        availabilityPercentage: Number,
        dates: [{
            day: String,
            date: String,
            available: Boolean,
            availableForCheckin: Boolean,
        }]
    }]
}, { timestamps: true });