"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Language = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const LanguageSchema = new mongoose_1.default.Schema({
    language: { type: mongoose_1.default.SchemaTypes.String },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.language_id = ret._id;
            //delete ret._id;
            delete ret.__v;
        }
    }
});
LanguageSchema.statics.build = (attrs) => {
    return new Language(attrs);
};
const Language = mongoose_1.default.model('LanguageModel', LanguageSchema, 'Languages');
exports.Language = Language;
