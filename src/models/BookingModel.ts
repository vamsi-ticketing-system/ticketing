import mongoose from "mongoose";

interface BookingAttributes{
    event_release_id: mongoose.ObjectId,
    seats: [string],
    status: string
}

interface BookingModel extends mongoose.Model<any> {
    build(attrs:BookingAttributes) : any
}

const bookingSchema = new mongoose.Schema({
    "event_release_id": { type: mongoose.SchemaTypes.ObjectId , ref: "EventReleases" },
    "seats": [{
        "type": mongoose.SchemaTypes.String
    }],
    "status": {"type": mongoose.SchemaTypes.String, enum: ["Pending","Confirmed","Cancelled"]  }
},{
    toJSON: {
        transform : (doc,ret:any)=>{
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
    ref: 'EventReleases', // the collection/model name
    localField: 'event_release_id',
    foreignField: '_id',
    justOne: true, // default is false
});

bookingSchema.statics.build = (attrs:BookingAttributes) =>{
    return new Booking(attrs);
}

const Booking = mongoose.model<any,BookingModel>("Booking",bookingSchema,"Bookings");

export { Booking };