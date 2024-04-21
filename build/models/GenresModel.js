"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Genres = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const GenresSchema = new mongoose_1.default.Schema({
    genre: { type: mongoose_1.default.SchemaTypes.String },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.genre_id = ret._id;
            //delete ret._id;
            delete ret.__v;
        }
    }
});
GenresSchema.statics.build = (attrs) => {
    return new Genres(attrs);
};
const Genres = mongoose_1.default.model('GenresModel', GenresSchema, 'Genres');
exports.Genres = Genres;
