import mongoose from "mongoose";


interface TheaterAttributes {
    name: string,
    sound_system: string,
    address: string,
    latitude : string,
    longitude : string,
    no_of_rows: number,
    seats_per_row: number
}

interface TheaterModel extends mongoose.Model<any> {
    build(attrs:TheaterAttributes) : any
}

const TheaterSchema = new mongoose.Schema({
    name: { type: mongoose.SchemaTypes.String },
    sound_system: { type: mongoose.SchemaTypes.String },
    address: { type: mongoose.SchemaTypes.String },
    latitude : { type: mongoose.SchemaTypes.String },
    longitude : { type: mongoose.SchemaTypes.String },
    no_of_rows: { type: mongoose.SchemaTypes.Number },
    seats_per_row: { type: mongoose.SchemaTypes.Number },
    capacity: { type: mongoose.SchemaTypes.Number },
},{
    toJSON:{
        transform(doc,ret){
            ret.theater_id = ret._id;

           // delete ret._id;
            delete ret.__v;
        }
    }
});

TheaterSchema.statics.build = (attrs:TheaterAttributes) => {
    return new Theater(attrs);
}

const Theater = mongoose.model<any,TheaterModel>('TheaterModel',TheaterSchema,'Theaters');

export { Theater }

