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
exports.FetchEventReleasesRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const common_1 = require("@vamsi-ticketing/common");
const mongoose_1 = __importDefault(require("mongoose"));
const SharedService_1 = __importDefault(require("../../services/SharedService"));
const EventReleasesModel_1 = require("../../models/EventReleasesModel");
class FetchEventReleasesRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    fetchEventReleases(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize } = request.query;
            const offset = (pageNumber > 0 ? pageNumber - 1 : 1) * pageSize;
            const limit = parseInt(pageSize);
            let tickets = [];
            if (SharedService_1.default.isNumber(offset) && SharedService_1.default.isNumber(limit)) {
                tickets = yield EventReleasesModel_1.EventReleases.aggregate([
                    {
                        $lookup: {
                            from: 'Events',
                            localField: "event_id",
                            foreignField: "_id",
                            as: "event_info"
                        }
                    },
                    {
                        $unwind: {
                            path: "$event_info",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: 'Theaters',
                            localField: "theater_id",
                            foreignField: "_id",
                            as: "theater_info"
                        }
                    },
                    {
                        $unwind: {
                            path: "$theater_info",
                            preserveNullAndEmptyArrays: true
                        }
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
                tickets = yield EventReleasesModel_1.EventReleases.aggregate([
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
    fetchEventRelease(request, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            let eventInfo = yield EventReleasesModel_1.EventReleases.findOne({ '_id': new mongoose_1.default.Types.ObjectId(id) });
            res.status(200).send({ "data": eventInfo });
        });
    }
    routes() {
        this.router.get('/:id', [
            (0, express_validator_1.param)('id').notEmpty().withMessage("ID is mandatory")
        ], common_1.isValidRequest, this.fetchEventRelease);
        this.router.get('/', [
            (0, express_validator_1.oneOf)([
                [
                    (0, express_validator_1.query)('pageNumber').optional().notEmpty().withMessage("pageNumber parameter is required"),
                    (0, express_validator_1.query)('pageSize').optional().notEmpty().withMessage("pageSize parameter is required"),
                ],
            ])
        ], common_1.isValidRequest, this.fetchEventReleases);
    }
}
exports.FetchEventReleasesRouter = FetchEventReleasesRouter;
