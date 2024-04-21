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
exports.SaveEventReleases = void 0;
const common_1 = require("@vamsi-ticketing/common");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const EventReleasesModel_1 = require("../../models/EventReleasesModel");
const moment_1 = __importDefault(require("moment"));
class SaveEventReleases {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    saveEventRelease(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let { theater_id, language_id, event_id, event_date, event_time, price } = request.body;
            let event_date_string = (0, moment_1.default)(new Date(event_date)).format('YYYY-MM-DD');
            let event_date_time = new Date((0, moment_1.default)(`${event_date_string} ${event_time}`).format());
            let eventReleaseModel = EventReleasesModel_1.EventReleases.build({ theater_id, language_id, event_id, event_date: event_date_string, event_time, event_date_time, price });
            let savedEventRelease = yield eventReleaseModel.save();
            response.status(201).send({ message: "Data has saved successfully", data: savedEventRelease });
        });
    }
    routes() {
        this.router.post('/', [
            (0, express_validator_1.body)('event_id').notEmpty().withMessage("event_id is mandatory"),
            (0, express_validator_1.body)('theater_id').notEmpty().withMessage("theater_id is mandatory"),
            (0, express_validator_1.body)('event_date').notEmpty().withMessage("event_date is mandatory"),
            (0, express_validator_1.body)('event_time').notEmpty().withMessage("event_time is mandatory"),
            (0, express_validator_1.body)('price').notEmpty().withMessage("Price is mandatory"),
        ], common_1.isValidRequest, this.saveEventRelease);
    }
}
exports.SaveEventReleases = SaveEventReleases;
