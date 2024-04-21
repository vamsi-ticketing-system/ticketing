"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreBooking = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const preBookingModelSchema = new mongoose_1.default.Schema({
    event_release_id: { type: mongoose_1.default.SchemaTypes.ObjectId },
    seats: [{
            "type": mongoose_1.default.SchemaTypes.String,
        }],
    status: mongoose_1.default.SchemaTypes.String
});
preBookingModelSchema.statics.build = (params) => {
    return new PreBooking(params);
};
const PreBooking = mongoose_1.default.model("PreBookingModel", preBookingModelSchema, "PreBookings");
exports.PreBooking = PreBooking;
