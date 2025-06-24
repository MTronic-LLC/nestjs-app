import { Schema } from "mongoose";

export const AvailablePlaceSchema = new Schema({
    airbnb_id: {type: String, required: true, unique: true},
    pricePerNight: String,
    totalPrice: String,
    city: String,
    localizedCity: String,
    name: String,
    accommodationType: String,
    inCoda: {type: Boolean, default: false},
    queryCity: {
        type: {
            name: String, 
            id: String
        }
    },
    coordinates: {
        type: {
            latitude: Number,
            longitude: Number
        }
    },
    averageRating: String,
    rejected: {type: Boolean, default: false},
    picturesUrl: [String],
    availabilityDates: {
        type: {
            checkin: String,
            checkout: String
        }
    },
    monthAvailability: [{
        year: Number,
        month: Number,
        availabilityPercentage: Number,
        dates: [{
            day: String,
            date: String,
            availableForCheckin: Boolean,
            available: Boolean
        }]
    }]
}, {timestamps: true});