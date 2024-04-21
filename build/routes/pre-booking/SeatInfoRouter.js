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
exports.SeatInfoRouter = void 0;
const express_1 = require("express");
const PreBookingModel_1 = require("../../models/PreBookingModel");
const SharedService_1 = __importDefault(require("../../services/SharedService"));
class SeatInfoRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    seatStatusInfo(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { event_release_id } = request.params;
            let bookedInfo = yield PreBookingModel_1.PreBooking.aggregate([
                {
                    $unionWith: {
                        coll: "Bookings",
                        pipeline: [
                            {
                                $match: {
                                    event_release_id: SharedService_1.default.stringToObjectId(event_release_id)
                                }
                            }
                        ]
                    }
                },
                {
                    $match: { event_release_id: SharedService_1.default.stringToObjectId(event_release_id) }
                },
                {
                    $unwind: {
                        path: "$seats",
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]);
            console.log(bookedInfo);
            let obj = {};
            for (let book of bookedInfo) {
                console.log(book);
                obj[book['seats']] = book['status'];
            }
            console.log(obj);
            response.status(200).send({ "message": "Data has fetched", data: obj });
        });
    }
    routes() {
        this.router.get("/:event_release_id", this.seatStatusInfo);
    }
}
exports.SeatInfoRouter = SeatInfoRouter;
