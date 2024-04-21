import { Request, Response, Router } from "express";
import { Genres } from "../../models/GenresModel";



export class GenresFetchRouter{
    public router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    async fetch(request:Request,response:Response){
        let genres = await Genres.find({});

        response.send({"message":"Success",data: {data: genres}});
    }

    routes(){
        this.router.get("/",this.fetch)
    }
}