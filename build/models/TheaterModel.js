"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theater = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TheaterSchema = new mongoose_1.default.Schema({
    name: { type: mongoose_1.default.SchemaTypes.String },
    sound_system: { type: mongoose_1.default.SchemaTypes.String },
    address: { type: mongoose_1.default.SchemaTypes.String },
    latitude: { type: mongoose_1.default.SchemaTypes.String },
    longitude: { type: mongoose_1.default.SchemaTypes.String },
    no_of_rows: { type: mongoose_1.default.SchemaTypes.Number },
    seats_per_row: { type: mongoose_1.default.SchemaTypes.Number },
    capacity: { type: mongoose_1.default.SchemaTypes.Number },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.theater_id = ret._id;
            // delete ret._id;
            delete ret.__v;
        }
    }
});
TheaterSchema.statics.build = (attrs) => {
    return new Theater(attrs);
};
const Theater = mongoose_1.default.model('TheaterModel', TheaterSchema, 'Theaters');
exports.Theater = Theater;
