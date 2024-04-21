import { Request, Response, Router } from "express";
import { PreBooking } from "../../models/PreBookingModel";
import mongoose from "mongoose";
import sharedService from "../../services/SharedService";


export class SeatInfoRouter{
    public router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    async seatStatusInfo(request:Request, response: Response){
        const { event_release_id } = request.params;

        let bookedInfo = await PreBooking.aggregate(
            [
                {
                    $unionWith:{
                        coll: "Bookings",
                        pipeline: [
                            {
                                $match:{
                                    event_release_id: sharedService.stringToObjectId(event_release_id)
                                }
                            }
                        ]
                    }
                },
                {
                    $match:{event_release_id: sharedService.stringToObjectId(event_release_id)}
                },
                {
                    $unwind:{
                        path: "$seats",
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]);

        console.log(bookedInfo);
        let obj:any = {}
        for(let book of bookedInfo){
            console.log(book);
            obj[book['seats']] = book['status'];
        }


        console.log(obj);

        response.status(200).send({"message":"Data has fetched", data : obj})
    }

    routes(){
        this.router.get("/:event_release_id",this.seatStatusInfo)
    }
}