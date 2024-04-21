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
exports.SaveEventRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const common_1 = require("@vamsi-ticketing/common");
const EventModel_1 = require("../../models/EventModel");
const mongoose_1 = __importDefault(require("mongoose"));
class SaveEventRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    saveTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { event_id, title, description, genre_ids, language_ids, poster_link, cover_link, trailer_link, duration, release_date, certificate } = req.body;
            console.log(event_id);
            if (mongoose_1.default.isValidObjectId(event_id)) {
                let savedTicket = yield EventModel_1.Event.updateOne({ _id: event_id }, { title, description, genre_ids, language_ids, poster_link, cover_link, trailer_link, duration, release_date, certificate });
                res.status(200).send(savedTicket);
            }
            else {
                let ticketExists = yield EventModel_1.Event.find({ title: { $regex: new RegExp(title, "i") } });
                if (ticketExists.length > 0) {
                    throw new common_1.BadRequest("Event already exists!!");
                }
                let eventModel = EventModel_1.Event.build({ _id: event_id, title, description, language_ids, genre_ids, poster_link, cover_link, trailer_link, duration, release_date, certificate });
                let savedTicket = yield eventModel.save();
                res.status(201).send(savedTicket);
            }
        });
    }
    routes() {
        this.router.post('/', [
            (0, express_validator_1.body)('title').notEmpty().withMessage('Title is mandatory'),
            (0, express_validator_1.body)('poster_link').notEmpty().withMessage('Poster Link is mandatory'),
            (0, express_validator_1.body)('certificate').notEmpty().withMessage("Certificate is required"),
        ], common_1.isValidRequest, this.saveTicket);
    }
}
exports.SaveEventRouter = SaveEventRouter;
