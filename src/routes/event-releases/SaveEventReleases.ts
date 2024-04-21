import { isValidRequest } from "@vamsi-ticketing/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { EventReleases } from "../../models/EventReleasesModel";
import moment from "moment";


export class SaveEventReleases{
    public router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    async saveEventRelease(request:Request,response: Response){
        let { theater_id,language_id, event_id, event_date, event_time,price } = request.body; 

        let event_date_string = moment(new Date(event_date)).format('YYYY-MM-DD')
        let event_date_time = new Date(moment(`${event_date_string} ${event_time}`).format());


        let eventReleaseModel = EventReleases.build({theater_id,language_id,event_id, event_date:event_date_string,event_time,event_date_time,price});

        let savedEventRelease = await eventReleaseModel.save();

        response.status(201).send({message:"Data has saved successfully",data: savedEventRelease})
    }

    routes(){
        this.router.post('/',[
            body('event_id').notEmpty().withMessage("event_id is mandatory"),
            body('theater_id').notEmpty().withMessage("theater_id is mandatory"),
            body('event_date').notEmpty().withMessage("event_date is mandatory"),
            body('event_time').notEmpty().withMessage("event_time is mandatory"),
            body('price').notEmpty().withMessage("Price is mandatory"),
        ],isValidRequest,this.saveEventRelease)
    }
}