import mongoose from "mongoose";


interface LanguageAttributes {
    language: string,
    other_name: string,
}

interface LanguageModel extends mongoose.Model<any> {
    build(attrs:LanguageAttributes) : any
}

const LanguageSchema = new mongoose.Schema({
    language: { type: mongoose.SchemaTypes.String },
},{
    toJSON:{
        transform(doc,ret:any){
            ret.language_id = ret._id;

            //delete ret._id;
            delete ret.__v;
        }
    }
});

LanguageSchema.statics.build = (attrs:LanguageAttributes) => {
    return new Language(attrs);
}

const Language = mongoose.model<any,LanguageModel>('LanguageModel',LanguageSchema,'Languages');

export { Language }

