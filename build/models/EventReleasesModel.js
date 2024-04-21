"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventReleases = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const EventModel_1 = require("./EventModel");
const TheaterModel_1 = require("./TheaterModel");
const LanguageModel_1 = require("./LanguageModel");
const EventReleasesSchema = new mongoose_1.default.Schema({
    event_id: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: EventModel_1.Event },
    theater_id: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: TheaterModel_1.Theater },
    language_id: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: LanguageModel_1.Language },
    price: mongoose_1.default.SchemaTypes.Number,
    event_date: mongoose_1.default.SchemaTypes.String,
    event_time: mongoose_1.default.SchemaTypes.String,
    event_date_time: mongoose_1.default.SchemaTypes.Date
}, {
    toJSON: {
        transform(doc, ret) {
            ret.event_release_id = ret._id;
            ret.event = ret.event_id;
            delete ret._id;
            delete ret.__v;
        },
        virtuals: true
    }
});
EventReleasesSchema.virtual('theater_info', {
    ref: 'Theaters',
    localField: 'theater_id',
    foreignField: '_id',
    justOne: true, // default is false
});
EventReleasesSchema.statics.build = (attr) => {
    return new EventReleases(attr);
};
EventReleasesSchema.pre('save', function (next) {
    //this.date_time = ;
    next();
});
// EventReleasesSchema.pre("aggregate",function(next){
//     let pre_pipeline = 
//     [
//         {
//             $lookup: {
//                 from: 'Events',
//                 localField:"event_id",
//                 foreignField:"_id",
//                 as:"event_info"
//             }
//         },
//         {
//             $unwind:{
//                 path:"$event_info",
//                 preserveNullAndEmptyArrays: true
//             }
//         },
//         {
//             $lookup: {
//                 from: 'Theaters',
//                 localField:"theater_id",
//                 foreignField:"_id",
//                 as:"theater_info"
//             }
//         },
//         {
//             $unwind:{
//                 path:"$theater_info",
//                 preserveNullAndEmptyArrays: true
//             }
//         }
//     ]
//     this.pipeline()
//             .unshift(...pre_pipeline);
//     console.log(this.pipeline())
//     next();
// });
const EventReleases = mongoose_1.default.model('EventReleases', EventReleasesSchema, 'EventReleases');
exports.EventReleases = EventReleases;
