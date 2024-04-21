import { Request, Response, Router } from "express";
import { body } from "express-validator";

import { BadRequest, isValidRequest } from "@vamsi-ticketing/common";
import { Theater } from "../../models/TheaterModel";
import mongoose from "mongoose";


export class SaveTheaterRouter{
    public router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    async saveTheater(req:Request,res:Response){
        let { theater_id,name, sound_system, address, latitude , longitude, no_of_rows, seats_per_row } = req.body;

        
        if(mongoose.isValidObjectId(theater_id)){
            let savedTicket = await Theater.updateOne({_id:theater_id},{name,sound_system,address,latitude,longitude,no_of_rows,seats_per_row});
            res.status(200).send(savedTicket);
        }
        else{   
            let theaterExists = await Theater.find({name: { $regex : new RegExp(name, "i") }})

            if(theaterExists.length > 0){
                throw new BadRequest("Theater already exists!!");
            }

            let theaterModel = Theater.build({name,sound_system,address,latitude,longitude,no_of_rows,seats_per_row});
            let savedTheater = await theaterModel.save();
            
            res.status(201).send(savedTheater);
        }

        
    }

    routes(){
        this.router.post('/',[
            body('name').notEmpty().withMessage('Title is mandatory'),
            body('sound_system').notEmpty().withMessage('Poster Link is mandatory'),
            body('address').notEmpty().withMessage("Address is mandatory"),
            body('latitude').notEmpty().withMessage("Latitude is mandatory"),
            body('longitude').notEmpty().withMessage("Longitude is mandatory"),
            body('no_of_rows').notEmpty().withMessage("No. of rows is mandatory"),
            body('seats_per_row').notEmpty().withMessage("seats per row is mandatory"),
        ],isValidRequest,this.saveTheater);
    }
}