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
exports.GenresSaveUpdateRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const common_1 = require("@vamsi-ticketing/common");
const GenresModel_1 = require("../../models/GenresModel");
class GenresSaveUpdateRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    saveUpdate(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let { genres } = request.body;
            let genresModel = new GenresModel_1.Genres({ genre: genres });
            let savedGenres = yield genresModel.save();
            response.send({ "message": "Success", data: savedGenres });
        });
    }
    routes() {
        this.router.post("/", [
            (0, express_validator_1.body)('genres').trim().notEmpty().withMessage("genres is required")
        ], common_1.isValidRequest, this.saveUpdate);
    }
}
exports.GenresSaveUpdateRouter = GenresSaveUpdateRouter;
