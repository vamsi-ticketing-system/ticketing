"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
    "event_release_id": { type: mongoose_1.default.SchemaTypes.ObjectId, ref: "EventReleases" },
    "seats": [{
            "type": mongoose_1.default.SchemaTypes.String
        }],
    "status": { "type": mongoose_1.default.SchemaTypes.String, enum: ["Pending", "Confirmed", "Cancelled"] }
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.booking_id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
        virtuals: true
    }
});
// bookingSchema.pre("aggregate",function(next){
//     let pre_pipeline = 
//     [
//         {
//             $lookup: {
//                 from: 'EventReleases',
//                 localField:"event_release_id",
//                 foreignField:"_id",
//                 as:"event_release_info"
//             }
//         },
//         {
//             $unwind:{
//                 path:"$event_release_info",
//                 preserveNullAndEmptyArrays: true
//             }
//         },
//         {
//             $lookup: {
//                 from: 'Theaters',
//                 localField:"event_release_info.theater_id",
//                 foreignField:"_id",
//                 as:"event_release_info.theater_info"
//             }
//         },
//         {
//             $unwind:{
//                 path:"$event_release_info.theater_info",
//                 preserveNullAndEmptyArrays: true
//             }
//         }
//     ]
//     this.pipeline()
//         .unshift(...pre_pipeline);
// });
bookingSchema.virtual('event_release_info', {
    ref: 'EventReleases',
    localField: 'event_release_id',
    foreignField: '_id',
    justOne: true, // default is false
});
bookingSchema.statics.build = (attrs) => {
    return new Booking(attrs);
};
const Booking = mongoose_1.default.model("Booking", bookingSchema, "Bookings");
exports.Booking = Booking;
