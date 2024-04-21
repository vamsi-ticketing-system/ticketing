import { Request, Response, Router } from "express";

import { oneOf, param, query } from "express-validator";
import { isValidRequest } from "@vamsi-ticketing/common";
import mongoose from "mongoose";
import sharedService from "../../services/SharedService";
import { EventReleases } from "../../models/EventReleasesModel";

export class FetchEventReleasesRouter {
    public router;
    constructor(){
        this.router = Router()
        this.routes();
    }
    async fetchEventReleases(request: Request,response: Response){

        const { pageNumber, pageSize }: any = request.query;
        const offset:number = ( pageNumber > 0 ? pageNumber-1 : 1 ) * pageSize ;
        const limit = parseInt(pageSize);
        
        let tickets = [];
        
        if(sharedService.isNumber(offset) && sharedService.isNumber(limit)){
            tickets = await EventReleases.aggregate(
                [
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
                        $facet:{
                            metadata: [{ $count: 'total' }],
                            data: [ { $skip: offset }, { $limit: limit } ]
                        }
                    },
                    {
                        $unwind:{
                            path: "$metadata",
                            preserveNullAndEmptyArrays: true
                        }
                    }
                ]);
        }
        else{
            tickets = await EventReleases.aggregate(
                [
                    {
                        $match:{
    
                        }
                    },
                    {
                        $group: {
                            _id: 'null',
                            total: { "$sum": 1 },
                            data: { $push: '$$ROOT'}
                        }
                    }
                ]);
        }

        

        response.send({"data":tickets[0]});
    }

    async fetchEventRelease(request:Request,res:Response){
        const { id } = request.params;

        let eventInfo = await EventReleases.findOne({'_id': new mongoose.Types.ObjectId(id)});

        res.status(200).send({"data":eventInfo});
    }

    routes(){
        this.router.get('/:id',[
            param('id').notEmpty().withMessage("ID is mandatory")
        ],isValidRequest,this.fetchEventRelease);

        this.router.get('/',[
            oneOf([
                [
                    query('pageNumber').optional().notEmpty().withMessage("pageNumber parameter is required"),
                    query('pageSize').optional().notEmpty().withMessage("pageSize parameter is required"),
                ],
                
            ])
            
        ],isValidRequest,this.fetchEventReleases);  
    }
}