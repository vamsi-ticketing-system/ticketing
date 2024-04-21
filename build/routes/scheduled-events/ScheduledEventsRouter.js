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
exports.ScheduledEventsRouter = void 0;
const common_1 = require("@vamsi-ticketing/common");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const EventReleasesModel_1 = require("../../models/EventReleasesModel");
const SharedService_1 = __importDefault(require("../../services/SharedService"));
class ScheduledEventsRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    eventReleases(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, event_date, language_id } = req.body;
            console.log(id, event_date);
            let queryResult = yield EventReleasesModel_1.EventReleases.aggregate([
                {
                    $match: {
                        event_id: SharedService_1.default.stringToObjectId(id),
                        event_date: event_date,
                        language_id: SharedService_1.default.stringToObjectId(language_id)
                    }
                },
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
                    $group: {
                        _id: "$theater_id",
                        schedules: {
                            $push: "$$ROOT"
                        }
                    }
                },
                {
                    $lookup: {
                        from: "Theaters",
                        localField: "_id",
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
                // {
                //     $lookup: {
                //         from: "EventReleases",
                //         localField: "schedules",
                //         foreignField: "_id",
                //         as: "event_release_info"
                //     }
                // }
            ]);
            res.send({ "data": queryResult });
        });
    }
    eventReleaseDates(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                let releasedDates = yield EventReleasesModel_1.EventReleases.aggregate([
                    {
                        $match: {
                            event_id: SharedService_1.default.stringToObjectId(id)
                        }
                    },
                    {
                        $group: {
                            _id: "$event_date",
                            event_date: {
                                $min: "$event_date"
                            }
                        }
                    },
                ]);
                response.status(200).send({ "message": "Success", data: releasedDates });
            }
            catch (error) {
            }
        });
    }
    eventReleaseLanguages(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                let releasedDates = yield EventReleasesModel_1.EventReleases.aggregate([
                    {
                        $match: {
                            event_id: SharedService_1.default.stringToObjectId(id)
                        }
                    },
                    {
                        $group: {
                            _id: "$language_id",
                            language_id: {
                                $min: "$language_id"
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "Languages",
                            "localField": "language_id",
                            "foreignField": "_id",
                            "as": "language_info"
                        }
                    },
                    {
                        $unwind: {
                            path: "$language_info",
                            preserveNullAndEmptyArrays: false
                        }
                    }
                ]);
                response.status(200).send({ "message": "Success", data: releasedDates });
            }
            catch (error) {
            }
        });
    }
    routes() {
        this.router.post('/', [
            (0, express_validator_1.body)('id').notEmpty().isMongoId().withMessage("Param id must be an mongo ID")
        ], common_1.isValidRequest, this.eventReleases);
        this.router.get('/dates/:id', [
            (0, express_validator_1.param)('id').notEmpty().isMongoId().withMessage("Param id must be an mongo ID")
        ], common_1.isValidRequest, this.eventReleaseDates);
        this.router.get('/languages/:id', [
            (0, express_validator_1.param)('id').notEmpty().isMongoId().withMessage("Param id must be an mongo ID")
        ], common_1.isValidRequest, this.eventReleaseLanguages);
    }
}
exports.ScheduledEventsRouter = ScheduledEventsRouter;
