import { Request, Response, Router } from "express";
import { Theater } from "../../models/TheaterModel";
import { oneOf, query } from "express-validator";
import { isValidRequest } from "@vamsi-ticketing/common";
import mongoose from "mongoose";
import sharedService from "../../services/SharedService";

export class FetchTheatersRouter {
    public router;
    constructor(){
        this.router = Router()
        this.routes();
    }

    async fetchTickets(request: Request,response: Response){

        const { pageNumber, pageSize }: any = request.query;
        const offset:number = ( pageNumber > 0 ? pageNumber-1 : 1 ) * pageSize ;
        const limit = parseInt(pageSize);
        
        let tickets = [];
        console.log(offset,limit);
        console.log(sharedService.isNumber(offset) , sharedService.isNumber(limit))
        
        if(sharedService.isNumber(offset) && sharedService.isNumber(limit)){
            tickets = await Theater.aggregate(
                [
                    {
                        $match:{
    
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
            tickets = await Theater.aggregate(
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

    async featchTheater(request:Request,response:Response){
        const { id } = request.params;

        let theaterInfo = await Theater.findOne({'_id': new mongoose.Types.ObjectId(id)});

        response.status(200).send({"data":theaterInfo});
    }

    routes(){
        this.router.get("/:id",this.featchTheater)
        this.router.get('/',[
            query('pageNumber').optional().notEmpty().withMessage("pageNumber parameter is required"),
            query('pageSize').optional().notEmpty().withMessage("pageSize parameter is required"),
        ],isValidRequest,this.fetchTickets)
    }
}