import { Request, Response, Router } from "express";
import { Event } from "../../models/EventModel";
import { oneOf, param, query } from "express-validator";
import { isValidRequest } from "@vamsi-ticketing/common";
import mongoose from "mongoose";
import sharedService from "../../services/SharedService";

export class FetchEventsRouter {
    public router;
    constructor(){
        this.router = Router()
        this.routes();
    }

    async fetchTickets(request: Request,response: Response){

        let { pageNumber, pageSize,languages,genres }: any = request.query;
        pageNumber = parseInt(pageNumber)-1 || 0; 
        const offset:number = pageNumber * pageSize ;
        const limit = parseInt(pageSize) || 25;
        let languageList = languages && languages != null && languages!= undefined  ? languages.split("|") : [];
        let genreList = genres && genres != null && genres != undefined && genres != 'undefined' ? genres.split("|") : [];
        
      
        console.log(languageList);
        console.log(await sharedService.stringsToObjectIDs(languageList))

        let tickets = [];
        
        if(sharedService.isNumber(offset) && sharedService.isNumber(limit)){
            tickets = await Event.aggregate(
                [
                    {
                        $match: languageList.length > 0 ? { 
                            language_ids: {
                                $in : sharedService.stringsToObjectIDs(languageList)
                            }
                         } : {

                        }
                    },
                    {
                        $match: genreList.length > 0 ? {
                            genre_ids: {
                                $in: sharedService.stringsToObjectIDs(genreList)
                            }
                         } : {
                            
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
            tickets = await Event.aggregate(
                [
                    {
                        $match: languageList.length > 0 ? { 
                            language_ids: {
                                $in: sharedService.stringsToObjectIDs(languageList)
                            }
                         } : {

                        }
                    },
                    {
                        $match: genreList.length > 0 ? {
                            genre_ids: {
                                $in: sharedService.stringsToObjectIDs(genreList)
                            }
                         } : {
                            
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

        

        response.status(200).send({"data":tickets[0]});
    }

    async fetchEvent(request:Request,res:Response){
        const { id } = request.params;

        let eventInfo = await Event.findOne({'_id': new mongoose.Types.ObjectId(id)});

        res.status(200).send({"data":eventInfo});
    }

    routes(){
        this.router.get('/:id',[
            param('id').notEmpty().withMessage("ID is mandatory")
        ],isValidRequest,this.fetchEvent);

        this.router.get('/',[
            oneOf([
                [
                    query('pageNumber').optional().notEmpty().withMessage("pageNumber parameter is required"),
                    query('pageSize').optional().notEmpty().withMessage("pageSize parameter is required"),
                ],
                
            ])
            
        ],this.fetchTickets);

        
    }
}