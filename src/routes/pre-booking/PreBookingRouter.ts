import { BadRequest, isValidRequest } from "@vamsi-ticketing/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { PreBooking } from "../../models/PreBookingModel";
import { Booking } from "../../models/BookingModel";
import sharedService from "../../services/SharedService";


export class PreBookingRouter{
    public router;
    constructor(){  
        this.router = Router();
        this.routes();
    }

    private async booking(request:Request,response:Response){
        
        const { event_release_id,seats } = request.body;

        let pendingBookings = await PreBooking.find({"event_release_id": sharedService.stringToObjectId(event_release_id), seats : { $in : seats}});
        let confirmedBooking = await Booking.find({"event_release_id": sharedService.stringToObjectId(event_release_id), seats : { $in : seats}});

        // console.log(alreadyBookings);

        if(pendingBookings.length > 0 || confirmedBooking.length > 0) {
            throw new BadRequest("Choosen seats by you has been occupied by someone, please choose other seats");
        }

        let bookingModel = new PreBooking({event_release_id,seats,status:"Pending"});
        let savedTicket = await bookingModel.save();
        
        response.status(201).send(savedTicket);
    }

    

    private routes(){
        this.router.post("/",[
            body('event_release_id').notEmpty().isMongoId().withMessage("event_release_id must be an valid mongo ID"),
            body('seats').isArray().withMessage("seats must be an array")
        ],isValidRequest,this.booking);
    }
}