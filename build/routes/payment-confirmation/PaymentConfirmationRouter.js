"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentConfirmationRouter = void 0;
const common_1 = require("@vamsi-ticketing/common");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const PreBookingModel_1 = require("../../models/PreBookingModel");
const BookingModel_1 = require("../../models/BookingModel");
const mongoose_1 = __importDefault(require("mongoose"));
class PaymentConfirmationRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    paymentConfirmation(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const { id } = request.body;
                let documentFromPreBooking = yield PreBookingModel_1.PreBooking.findById(id);
                console.log(documentFromPreBooking);
                let bookingModel = yield BookingModel_1.Booking.findOneAndUpdate({ _id: documentFromPreBooking['_id'] }, { $set: documentFromPreBooking }, { new: true, upsert: true });
                // let bookingConfirmation = bookingModel.save();
                yield PreBookingModel_1.PreBooking.deleteOne({ _id: documentFromPreBooking['_id'] });
                session.commitTransaction();
                response.send({ "message": "Booking has confirmed", data: bookingModel });
            }
            catch (error) {
                session.abortTransaction();
            }
        });
    }
    routes() {
        this.router.post("/", [(0, express_validator_1.body)('id').notEmpty().withMessage("ID is required")], common_1.isValidRequest, this.paymentConfirmation);
    }
}
exports.PaymentConfirmationRouter = PaymentConfirmationRouter;
