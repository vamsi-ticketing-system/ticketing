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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingHistoryRouter = void 0;
const express_1 = require("express");
const BookingModel_1 = require("../../models/BookingModel");
class BookingHistoryRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    bookingHistory(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let history = yield BookingModel_1.Booking.find({}).populate({
                path: "event_release_info",
                strictPopulate: false,
                populate: [
                    {
                        path: "theater_id",
                        model: "TheaterModel"
                    },
                    {
                        path: "event_id",
                        model: "EventModel"
                    }
                ]
            });
            console.log(history);
            response.send({ "message": "Fetch successfully", data: history });
        });
    }
    routes() {
        this.router.get("/", this.bookingHistory);
    }
}
exports.BookingHistoryRouter = BookingHistoryRouter;
