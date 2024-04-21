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
exports.LanguageFetchRouter = void 0;
const express_1 = require("express");
const LanguageModel_1 = require("../../models/LanguageModel");
class LanguageFetchRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    fetch(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let languages = yield LanguageModel_1.Language.find({});
            response.send({ "message": "Success", data: { data: languages } });
        });
    }
    routes() {
        this.router.get("/", this.fetch);
    }
}
exports.LanguageFetchRouter = LanguageFetchRouter;
