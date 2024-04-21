import { Request, Response, Router } from "express";
import { Language } from "../../models/LanguageModel";


export class LanguageFetchRouter{
    public router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    async fetch(request:Request,response:Response){
        let languages = await Language.find({});

        response.send({"message":"Success",data: { data: languages}});
    }

    routes(){
        this.router.get("/",this.fetch)
    }
}