import { isValidRequest } from "@vamsi-ticketing/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { PreBooking } from "../../models/PreBookingModel";
import { Booking } from "../../models/BookingModel";
import mongoose from "mongoose";



export class PaymentConfirmationRouter{
    public router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    private async paymentConfirmation(request: Request, response: Response){
        const session = await mongoose.startSession();
        session.startTransaction();
        try{
            const { id } = request.body;

            
            let documentFromPreBooking:any  = await PreBooking.findById(id); 

            console.log(documentFromPreBooking)
            let bookingModel = await Booking.findOneAndUpdate({_id: documentFromPreBooking['_id']}, {$set: documentFromPreBooking},{new: true,upsert: true});
            // let bookingConfirmation = bookingModel.save();

            await PreBooking.deleteOne({_id: documentFromPreBooking['_id']});
            session.commitTransaction();
            response.send({"message": "Booking has confirmed", data:bookingModel })

        }
        catch(error){
            session.abortTransaction();
        }
    }

    private routes(){
        this.router.post("/",[body('id').notEmpty().withMessage("ID is required")],isValidRequest,this.paymentConfirmation);
    }
}