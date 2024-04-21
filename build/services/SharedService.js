"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class SharedService {
    constructor() {
    }
    isNumber(val) {
        return typeof val == 'number' && !isNaN(val) ? true : false;
    }
    stringToObjectId(id) {
        return new mongoose_1.default.Types.ObjectId(id);
    }
    stringsToObjectIDs(ids) {
        let idList = [...new Set(ids)];
        return idList.map((id) => new mongoose_1.default.Types.ObjectId(id));
    }
}
const sharedService = new SharedService;
exports.default = sharedService;
