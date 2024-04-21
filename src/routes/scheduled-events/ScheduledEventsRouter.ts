import { isValidRequest } from "@vamsi-ticketing/common";
import { Request, Response, Router } from "express";
import { body, param } from "express-validator";
import { EventReleases } from "../../models/EventReleasesModel";
import mongoose from "mongoose";
import sharedService from "../../services/SharedService";



export class ScheduledEventsRouter{
    public router;
    constructor(){
        this.router = Router();
        this.routes()
    }

    private async eventReleases(req:Request,res:Response){
        
        const { id,event_date,language_id } = req.body;

        console.log(id,event_date);

        let queryResult = await EventReleases.aggregate(
            [
                {
                    $match:{
                        event_id: sharedService.stringToObjectId(id),
                        event_date: event_date,
                        language_id: sharedService.stringToObjectId(language_id)
                    }
                },
                {
                    $lookup: {
                        from: 'Events',
                        localField:"event_id",
                        foreignField:"_id",
                        as:"event_info"
                    }
                },
                {
                    $unwind:{
                        path:"$event_info",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'Theaters',
                        localField:"theater_id",
                        foreignField:"_id",
                        as:"theater_info"
                    }
                },
                {
                    $unwind:{
                        path:"$theater_info",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group:{
                        _id: "$theater_id",
                        schedules: {
                            $push: "$$ROOT"
                        }
                   }
                },
                {
                    $lookup:{
                        from: "Theaters",
                        localField: "_id",
                        foreignField: "_id",
                        as: "theater_info"
                    }
                },
                {
                    $unwind: {
                        path: "$theater_info",
                        preserveNullAndEmptyArrays: true
                    }
                },
                // {
                //     $lookup: {
                //         from: "EventReleases",
                //         localField: "schedules",
                //         foreignField: "_id",
                //         as: "event_release_info"
                //     }
                // }
            ]);

        res.send({"data": queryResult});
    }

    private async eventReleaseDates(req: Request,response:Response){
        try{
            const { id } = req.params;

            let releasedDates = await EventReleases.aggregate([
                {
                    $match: {
                        event_id: sharedService.stringToObjectId(id)
                    }
                },
                {
                    $group: {
                        _id: "$event_date",
                        event_date: {
                            $min:"$event_date"
                        }
                    }
                },
            ]);

            response.status(200).send({"message":"Success", data: releasedDates})
        }
        catch(error){

        }
    }

    private async eventReleaseLanguages(req: Request,response:Response){
        try{
            const { id } = req.params;

            let releasedDates = await EventReleases.aggregate([
                {
                    $match: {
                        event_id: sharedService.stringToObjectId(id)
                    }
                },
                {
                    $group: {
                        _id: "$language_id",
                        language_id: {
                            $min:"$language_id"
                        }
                    }
                },
                {
                    $lookup:{
                        from:"Languages",
                        "localField":"language_id",
                        "foreignField":"_id",
                        "as":"language_info"
                    }
                },
                {
                    $unwind:{
                        path:"$language_info",
                        preserveNullAndEmptyArrays: false
                    }
                }
            ]);

            response.status(200).send({"message":"Success", data: releasedDates})
        }
        catch(error){

        }
    }

    public routes(){
        this.router.post('/'
                        ,[
                            body('id').notEmpty().isMongoId().withMessage("Param id must be an mongo ID")
                        ]
                        ,isValidRequest
                        ,this.eventReleases);

        this.router.get('/dates/:id'
                        ,[
                            param('id').notEmpty().isMongoId().withMessage("Param id must be an mongo ID")
                        ]
                        ,isValidRequest
                        ,this.eventReleaseDates);
        
        this.router.get('/languages/:id'
                        ,[
                            param('id').notEmpty().isMongoId().withMessage("Param id must be an mongo ID")
                        ]
                        ,isValidRequest
                        ,this.eventReleaseLanguages)
    }
}