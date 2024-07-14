import { Schema } from "mongoose";

export const AvailablePlaceSchema = new Schema({
    airbnb_id: {type: String, required: true, unique: true},
    pricePerNight: String,
    totalPrice: String,
    city: String,
    localizedCity: String,
    name: String,
    accommodationType: String,
    coordinates: {
        type: {
            latitude: Number,
            longitude: Number
        }
    },
    averageRating: String,
    picturesUrl: [String],
    availabilityDates: {
        type: {
            checkin: String,
            checkout: String
        }
    },
    availability: {
        nextSixMonths: Number,
        months: [{
            year: Number,
            month: Number,
            availabilityPercentage: Number
        }]
    }
}, {timestamps: true});