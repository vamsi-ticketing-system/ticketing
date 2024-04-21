import mongoose from "mongoose";


interface GenresAttributes {
    genre: string,
}

interface  GenresModel extends mongoose.Model<any> {
    build(attrs:GenresAttributes) : any
}

const GenresSchema = new mongoose.Schema({
    genre: { type: mongoose.SchemaTypes.String },
},{
    toJSON:{
        transform(doc,ret:any){
            ret.genre_id = ret._id;

            //delete ret._id;
            delete ret.__v;
        }
    }
});

GenresSchema.statics.build = (attrs: GenresAttributes) => {
    return new  Genres(attrs);
}

const  Genres = mongoose.model<any, GenresModel>('GenresModel', GenresSchema,'Genres');

export {  Genres }

