import mongoose from "mongoose";
import { Event } from "./EventModel";
import { Theater } from "./TheaterModel";
import { Language } from "./LanguageModel";


interface EventReleasesAttributes{
    event_id: string,
    theater_id: string,
    language_id: string,
    event_date: string,
    event_time: string,
    event_date_time: Date;
    price: number
}


interface EventReleasesModel extends mongoose.Model<any>{
    build(attr: EventReleasesAttributes): any
}


const EventReleasesSchema = new mongoose.Schema({
    event_id: { type: mongoose.SchemaTypes.ObjectId , ref: Event},
    theater_id: { type:  mongoose.SchemaTypes.ObjectId, ref: Theater},
    language_id: { type:  mongoose.SchemaTypes.ObjectId, ref: Language},
    price: mongoose.SchemaTypes.Number,
    event_date: mongoose.SchemaTypes.String,
    event_time: mongoose.SchemaTypes.String,
    event_date_time: mongoose.SchemaTypes.Date
},{
    toJSON:{
        transform(doc,ret){
            ret.event_release_id = ret._id;
            ret.event = ret.event_id;
            delete ret._id;
            delete ret.__v;
        },
        virtuals: true
    }
});

EventReleasesSchema.virtual('theater_info', {   
    ref: 'Theaters', // the collection/model name
    localField: 'theater_id',
    foreignField: '_id',
    justOne: true, // default is false
});

EventReleasesSchema.statics.build = (attr:EventReleasesAttributes)=>{
    return new EventReleases(attr);
}

EventReleasesSchema.pre('save',function(next){
    //this.date_time = ;
    next();
})

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

const EventReleases = mongoose.model<any,EventReleasesModel>('EventReleases',EventReleasesSchema,'EventReleases');

export { EventReleases };