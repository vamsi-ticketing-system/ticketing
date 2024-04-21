import { Request, Response, Router } from "express";
import { body } from "express-validator";

import { BadRequest, RequestValidationError, isValidRequest } from "@vamsi-ticketing/common";
import { Event } from "../../models/EventModel";
import natsWrapper from "../../events/NATSWrapper";
import mongoose from "mongoose";

export class SaveEventRouter{
    public router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    async saveTicket(req:Request,res:Response){
        let { event_id, title, description,genre_ids ,language_ids, poster_link,cover_link, trailer_link, duration, release_date, certificate } = req.body;

        

        console.log(event_id);

        if(mongoose.isValidObjectId(event_id)){

            
            let savedTicket = await Event.updateOne({_id:event_id},{title,description,genre_ids,language_ids,poster_link,cover_link,trailer_link,duration,release_date,certificate});
            res.status(200).send(savedTicket);
        }
        else{
            let ticketExists = await Event.find({title: { $regex : new RegExp(title, "i") }})

            if(ticketExists.length > 0){
                throw new BadRequest("Event already exists!!");
            }
            let eventModel = Event.build({_id:event_id, title,description,language_ids,genre_ids,poster_link,cover_link,trailer_link,duration,release_date,certificate});
            let savedTicket = await eventModel.save();

            res.status(201).send(savedTicket);
        }
    }

    routes(){
        this.router.post('/',[
            body('title').notEmpty().withMessage('Title is mandatory'),
            body('poster_link').notEmpty().withMessage('Poster Link is mandatory'),
            body('certificate').notEmpty().withMessage("Certificate is required"),
        ],isValidRequest,this.saveTicket);
    }
}