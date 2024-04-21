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
exports.FetchTheatersRouter = void 0;
const express_1 = require("express");
const TheaterModel_1 = require("../../models/TheaterModel");
const express_validator_1 = require("express-validator");
const common_1 = require("@vamsi-ticketing/common");
const mongoose_1 = __importDefault(require("mongoose"));
const SharedService_1 = __importDefault(require("../../services/SharedService"));
class FetchTheatersRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    fetchTickets(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize } = request.query;
            const offset = (pageNumber > 0 ? pageNumber - 1 : 1) * pageSize;
            const limit = parseInt(pageSize);
            let tickets = [];
            console.log(offset, limit);
            console.log(SharedService_1.default.isNumber(offset), SharedService_1.default.isNumber(limit));
            if (SharedService_1.default.isNumber(offset) && SharedService_1.default.isNumber(limit)) {
                tickets = yield TheaterModel_1.Theater.aggregate([
                    {
                        $match: {}
                    },
                    {
                        $facet: {
                            metadata: [{ $count: 'total' }],
                            data: [{ $skip: offset }, { $limit: limit }]
                        }
                    },
                    {
                        $unwind: {
                            path: "$metadata",
                            preserveNullAndEmptyArrays: true
                        }
                    }
                ]);
            }
            else {
                tickets = yield TheaterModel_1.Theater.aggregate([
                    {
                        $match: {}
                    },
                    {
                        $group: {
                            _id: 'null',
                            total: { "$sum": 1 },
                            data: { $push: '$$ROOT' }
                        }
                    }
                ]);
            }
            response.send({ "data": tickets[0] });
        });
    }
    featchTheater(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            let theaterInfo = yield TheaterModel_1.Theater.findOne({ '_id': new mongoose_1.default.Types.ObjectId(id) });
            response.status(200).send({ "data": theaterInfo });
        });
    }
    routes() {
        this.router.get("/:id", this.featchTheater);
        this.router.get('/', [
            (0, express_validator_1.query)('pageNumber').optional().notEmpty().withMessage("pageNumber parameter is required"),
            (0, express_validator_1.query)('pageSize').optional().notEmpty().withMessage("pageSize parameter is required"),
        ], common_1.isValidRequest, this.fetchTickets);
    }
}
exports.FetchTheatersRouter = FetchTheatersRouter;
