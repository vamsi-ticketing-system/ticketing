import mongoose from "mongoose";


interface EventAttributes{
    _id: String,
    title: String,
    description: String,
    cover_link: String,
    poster_link: String,
    language_ids:[String]
    genre_ids: [String],
    certificate:String,
    trailer_link: String,
    duration: String,
    release_date: Date
}

interface EventDoc extends mongoose.Document{
    title: String,
    poster_link: String,
    description: String,
    cover_link: String,
    language_ids:[String]
    genre_ids: [String],
    trailer_link: String,
    duration: String,
    release_date: Date,
    certificate: String
}

interface EventModel extends mongoose.Model<EventDoc> {
    build(attrs:EventAttributes) : EventDoc
}

const EventSchema = new mongoose.Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId },
    title: { type: mongoose.SchemaTypes.String },
    genre_ids: [
        { type: mongoose.SchemaTypes.ObjectId }
    ],
    language_ids: [
        { type: mongoose.SchemaTypes.ObjectId }
    ],
    description:  { type: mongoose.SchemaTypes.String },
    cover_link:  { type: mongoose.SchemaTypes.String },
    poster_link: { type: mongoose.SchemaTypes.String },
    trailer_link: { type: mongoose.SchemaTypes.String },
    duration: { type: mongoose.SchemaTypes.String },
    release_date: { type: mongoose.SchemaTypes.Date },
    certificate : { type: mongoose.SchemaTypes.String }
},{
    toJSON: {
        transform : (doc,ret)=>{
            ret.event_id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
})

EventSchema.statics.build = (attrs:EventAttributes) => {
    return new Event(attrs);
}


const Event = mongoose.model<EventDoc,EventModel>('EventModel',EventSchema,'Events');

export { Event };

