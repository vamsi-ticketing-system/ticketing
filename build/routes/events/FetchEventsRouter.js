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
exports.FetchEventsRouter = void 0;
const express_1 = require("express");
const EventModel_1 = require("../../models/EventModel");
const express_validator_1 = require("express-validator");
const common_1 = require("@vamsi-ticketing/common");
const mongoose_1 = __importDefault(require("mongoose"));
const SharedService_1 = __importDefault(require("../../services/SharedService"));
class FetchEventsRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    fetchTickets(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let { pageNumber, pageSize, languages, genres } = request.query;
            pageNumber = parseInt(pageNumber) - 1 || 0;
            const offset = pageNumber * pageSize;
            const limit = parseInt(pageSize) || 25;
            let languageList = languages && languages != null && languages != undefined ? languages.split("|") : [];
            let genreList = genres && genres != null && genres != undefined && genres != 'undefined' ? genres.split("|") : [];
            console.log(languageList);
            console.log(yield SharedService_1.default.stringsToObjectIDs(languageList));
            let tickets = [];
            if (SharedService_1.default.isNumber(offset) && SharedService_1.default.isNumber(limit)) {
                tickets = yield EventModel_1.Event.aggregate([
                    {
                        $match: languageList.length > 0 ? {
                            language_ids: {
                                $in: SharedService_1.default.stringsToObjectIDs(languageList)
                            }
                        } : {}
                    },
                    {
                        $match: genreList.length > 0 ? {
                            genre_ids: {
                                $in: SharedService_1.default.stringsToObjectIDs(genreList)
                            }
                        } : {}
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
                tickets = yield EventModel_1.Event.aggregate([
                    {
                        $match: languageList.length > 0 ? {
                            language_ids: {
                                $in: SharedService_1.default.stringsToObjectIDs(languageList)
                            }
                        } : {}
                    },
                    {
                        $match: genreList.length > 0 ? {
                            genre_ids: {
                                $in: SharedService_1.default.stringsToObjectIDs(genreList)
                            }
                        } : {}
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
            response.status(200).send({ "data": tickets[0] });
        });
    }
    fetchEvent(request, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            let eventInfo = yield EventModel_1.Event.findOne({ '_id': new mongoose_1.default.Types.ObjectId(id) });
            res.status(200).send({ "data": eventInfo });
        });
    }
    routes() {
        this.router.get('/:id', [
            (0, express_validator_1.param)('id').notEmpty().withMessage("ID is mandatory")
        ], common_1.isValidRequest, this.fetchEvent);
        this.router.get('/', [
            (0, express_validator_1.oneOf)([
                [
                    (0, express_validator_1.query)('pageNumber').optional().notEmpty().withMessage("pageNumber parameter is required"),
                    (0, express_validator_1.query)('pageSize').optional().notEmpty().withMessage("pageSize parameter is required"),
                ],
            ])
        ], this.fetchTickets);
    }
}
exports.FetchEventsRouter = FetchEventsRouter;
