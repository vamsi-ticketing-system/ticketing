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
exports.SaveTheaterRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const common_1 = require("@vamsi-ticketing/common");
const TheaterModel_1 = require("../../models/TheaterModel");
const mongoose_1 = __importDefault(require("mongoose"));
class SaveTheaterRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    saveTheater(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { theater_id, name, sound_system, address, latitude, longitude, no_of_rows, seats_per_row } = req.body;
            if (mongoose_1.default.isValidObjectId(theater_id)) {
                let savedTicket = yield TheaterModel_1.Theater.updateOne({ _id: theater_id }, { name, sound_system, address, latitude, longitude, no_of_rows, seats_per_row });
                res.status(200).send(savedTicket);
            }
            else {
                let theaterExists = yield TheaterModel_1.Theater.find({ name: { $regex: new RegExp(name, "i") } });
                if (theaterExists.length > 0) {
                    throw new common_1.BadRequest("Theater already exists!!");
                }
                let theaterModel = TheaterModel_1.Theater.build({ name, sound_system, address, latitude, longitude, no_of_rows, seats_per_row });
                let savedTheater = yield theaterModel.save();
                res.status(201).send(savedTheater);
            }
        });
    }
    routes() {
        this.router.post('/', [
            (0, express_validator_1.body)('name').notEmpty().withMessage('Title is mandatory'),
            (0, express_validator_1.body)('sound_system').notEmpty().withMessage('Poster Link is mandatory'),
            (0, express_validator_1.body)('address').notEmpty().withMessage("Address is mandatory"),
            (0, express_validator_1.body)('latitude').notEmpty().withMessage("Latitude is mandatory"),
            (0, express_validator_1.body)('longitude').notEmpty().withMessage("Longitude is mandatory"),
            (0, express_validator_1.body)('no_of_rows').notEmpty().withMessage("No. of rows is mandatory"),
            (0, express_validator_1.body)('seats_per_row').notEmpty().withMessage("seats per row is mandatory"),
        ], common_1.isValidRequest, this.saveTheater);
    }
}
exports.SaveTheaterRouter = SaveTheaterRouter;
