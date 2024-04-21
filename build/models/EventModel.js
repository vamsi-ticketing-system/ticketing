"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const EventSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.SchemaTypes.ObjectId },
    title: { type: mongoose_1.default.SchemaTypes.String },
    genre_ids: [
        { type: mongoose_1.default.SchemaTypes.ObjectId }
    ],
    language_ids: [
        { type: mongoose_1.default.SchemaTypes.ObjectId }
    ],
    description: { type: mongoose_1.default.SchemaTypes.String },
    cover_link: { type: mongoose_1.default.SchemaTypes.String },
    poster_link: { type: mongoose_1.default.SchemaTypes.String },
    trailer_link: { type: mongoose_1.default.SchemaTypes.String },
    duration: { type: mongoose_1.default.SchemaTypes.String },
    release_date: { type: mongoose_1.default.SchemaTypes.Date },
    certificate: { type: mongoose_1.default.SchemaTypes.String }
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.event_id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});
EventSchema.statics.build = (attrs) => {
    return new Event(attrs);
};
const Event = mongoose_1.default.model('EventModel', EventSchema, 'Events');
exports.Event = Event;
