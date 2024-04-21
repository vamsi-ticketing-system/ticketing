import { Request, Response, Router } from "express";
import { Language } from "../../models/LanguageModel";
import { body } from "express-validator";
import { isValidRequest } from "@vamsi-ticketing/common";


export class LanguagesSaveUpdateRouter{
    public router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    async saveUpdate(request:Request,response:Response){
        let {language, other_name} = request.body;

        let languageModel = new Language({language: language, other_name: other_name});
        let savedLanguage = await languageModel.save();

        response.send({"message":"Success",data: savedLanguage});
    }

    routes(){
        this.router.post("/",
        [
            body('language').trim().notEmpty().withMessage("Language is required")
        ],isValidRequest,
        this.saveUpdate)
    }
}