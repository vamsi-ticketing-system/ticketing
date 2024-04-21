import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { isValidRequest } from "@vamsi-ticketing/common";
import { Genres } from "../../models/GenresModel";


export class GenresSaveUpdateRouter{
    public router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    async saveUpdate(request:Request,response:Response){
        let {genres} = request.body;

        let genresModel = new Genres({genre: genres });
        let savedGenres = await genresModel.save();

        response.send({"message":"Success",data: savedGenres});
    }

    routes(){
        this.router.post("/",
        [
            body('genres').trim().notEmpty().withMessage("genres is required")
        ],isValidRequest,
        this.saveUpdate)
    }
}