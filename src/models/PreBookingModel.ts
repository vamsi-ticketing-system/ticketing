import mongoose from "mongoose";

interface PreBookingAttributes{
    event_release_id: string,
    seats: [string],
    status: string
}

interface PreBookingModel extends mongoose.Model<any> {
    build(attrs:PreBookingAttributes) : any
}

const preBookingModelSchema = new mongoose.Schema({
    event_release_id: { type: mongoose.SchemaTypes.ObjectId },
    seats: [{
        "type": mongoose.SchemaTypes.String,
    }],
    status: mongoose.SchemaTypes.String
});

preBookingModelSchema.statics.build = (params: PreBookingAttributes) => {
    return new PreBooking(params);
}


const PreBooking = mongoose.model<any,PreBookingModel>("PreBookingModel",preBookingModelSchema,"PreBookings");

export { PreBooking };