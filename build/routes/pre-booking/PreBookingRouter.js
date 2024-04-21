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
exports.PreBookingRouter = void 0;
const common_1 = require("@vamsi-ticketing/common");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const PreBookingModel_1 = require("../../models/PreBookingModel");
const BookingModel_1 = require("../../models/BookingModel");
const SharedService_1 = __importDefault(require("../../services/SharedService"));
class PreBookingRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    booking(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { event_release_id, seats } = request.body;
            let pendingBookings = yield PreBookingModel_1.PreBooking.find({ "event_release_id": SharedService_1.default.stringToObjectId(event_release_id), seats: { $in: seats } });
            let confirmedBooking = yield BookingModel_1.Booking.find({ "event_release_id": SharedService_1.default.stringToObjectId(event_release_id), seats: { $in: seats } });
            // console.log(alreadyBookings);
            if (pendingBookings.length > 0 || confirmedBooking.length > 0) {
                throw new common_1.BadRequest("Choosen seats by you has been occupied by someone, please choose other seats");
            }
            let bookingModel = new PreBookingModel_1.PreBooking({ event_release_id, seats, status: "Pending" });
            let savedTicket = yield bookingModel.save();
            response.status(201).send(savedTicket);
        });
    }
    routes() {
        this.router.post("/", [
            (0, express_validator_1.body)('event_release_id').notEmpty().isMongoId().withMessage("event_release_id must be an valid mongo ID"),
            (0, express_validator_1.body)('seats').isArray().withMessage("seats must be an array")
        ], common_1.isValidRequest, this.booking);
    }
}
exports.PreBookingRouter = PreBookingRouter;
