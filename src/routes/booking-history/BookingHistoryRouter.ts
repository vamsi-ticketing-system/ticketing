import { Request, Response, Router } from "express";
import { Booking } from "../../models/BookingModel";



export class BookingHistoryRouter{
    public router;

    constructor(){
        this.router = Router();
        this.routes();
    }

    private async bookingHistory(request: Request, response: Response){
        let history = await Booking.find({}).populate(
            {
                path:"event_release_info",
                strictPopulate: false,
                populate:
                [
                    { 
                        path:"theater_id", 
                        model:"TheaterModel" 
                    },
                    { 
                        path:"event_id", 
                        model:"EventModel" 
                    }
                ]
                
                
                
            })
        console.log(history);
        response.send({"message":"Fetch successfully", data: history});
    }

    private routes(){
        this.router.get("/",this.bookingHistory)
    }
}