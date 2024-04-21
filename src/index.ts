import expres, { Request, Response } from 'express';
import 'express-async-errors'
import bodyParser from 'body-parser';
import cors from 'cors';
import { SaveEventRouter } from './routes/events/SaveEventRouter';
import { DatabaseConnectionError, NotFoundError, errorHandler } from '@vamsi-ticketing/common';
import mongoose from 'mongoose';
import { FetchEventsRouter } from './routes/events/FetchEventsRouter';
import natsWrapper from './events/NATSWrapper';

import { randomBytes } from 'crypto';
import { FetchTheatersRouter } from './routes/theaters/FetchTheatersRouter';
import { SaveTheaterRouter } from './routes/theaters/SaveTheaterRouter';
import { SaveEventReleases } from './routes/event-releases/SaveEventReleases';
import { FetchEventReleasesRouter } from './routes/event-releases/FetchEventReleases';
import { ScheduledEventsRouter } from './routes/scheduled-events/ScheduledEventsRouter';
import { PreBookingRouter } from './routes/pre-booking/PreBookingRouter';
import { SeatInfoRouter } from './routes/pre-booking/SeatInfoRouter';
import { LanguageFetchRouter } from './routes/languages/LanguageFetchRouter';
import { LanguagesSaveUpdateRouter } from './routes/languages/LanguagesSaveUpdateRouter';
import { GenresSaveUpdateRouter } from './routes/genres/GenresSaveUpdateRouter';
import { GenresFetchRouter } from './routes/genres/GenresFetchRouter';
import { PaymentConfirmationRouter } from './routes/payment-confirmation/PaymentConfirmationRouter';
import { BookingHistoryRouter } from './routes/booking-history/BookingHistoryRouter';
import './config/config';
const PORT = 3002;
const VERSION = "1.0.0";
const BASE_URL = "/ticketing"

const app = expres();
app.use(cors());
app.use(bodyParser.json());

const saveEvent = new SaveEventRouter();
app.use(BASE_URL+"/events",saveEvent.router);

const fetchEvents = new FetchEventsRouter();
app.use(BASE_URL+"/events",fetchEvents.router);

const fetchTheaters = new FetchTheatersRouter();
app.use(BASE_URL+"/theaters",fetchTheaters.router);

const saveTheaters = new SaveTheaterRouter();
app.use(BASE_URL+"/theaters",saveTheaters.router);


const fetchEventReleases = new FetchEventReleasesRouter();
app.use(BASE_URL+"/event-releases",fetchEventReleases.router);

const saveEventReleases = new SaveEventReleases();
app.use(BASE_URL+"/event-releases",saveEventReleases.router);

const scheduledEvents = new ScheduledEventsRouter();
app.use(BASE_URL+"/open-tills",scheduledEvents.router);

const preBookingRouter = new PreBookingRouter();
app.use(BASE_URL+"/pre-booking",preBookingRouter.router);

const seatInfoRouter = new SeatInfoRouter();
app.use(BASE_URL+"/seat-status",seatInfoRouter.router);

const languageFetchRouter = new LanguageFetchRouter();
app.use(BASE_URL+"/languages",languageFetchRouter.router);

const languageSaveUpdateRouter = new LanguagesSaveUpdateRouter();
app.use(BASE_URL+"/languages",languageSaveUpdateRouter.router);

const genresFetchRouter = new GenresFetchRouter();
app.use(BASE_URL+"/genres",genresFetchRouter.router);

const genresSaveUpdateRouter = new GenresSaveUpdateRouter();
app.use(BASE_URL+"/genres",genresSaveUpdateRouter.router);

const paymentConfirmationRouter = new PaymentConfirmationRouter();
app.use(BASE_URL+"/payment-confirmation",paymentConfirmationRouter.router);

const bookingHistoryRouter = new BookingHistoryRouter();
app.use(BASE_URL+"/booking-history",bookingHistoryRouter.router);

app.all("*",async (req:Request,res:Response)=>{
    throw new NotFoundError();
});

app.use(errorHandler);


app.listen(PORT,()=>{
    connectToNATSServer();
    connectToMongo();
    console.log(`Ticketing APIs(${VERSION}) is accessible on ${PORT} `);
});


const connectToMongo = async () =>{
    try{
        
        mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}${process.env.MONGODB_DATABASE}`,{
            authSource: process.env.MONGODB_AUTH_SOURCE,
            user: process.env.MONGODB_USER,
            pass: process.env.MONGODB_PASSWORD
        }).then(()=>{
            console.log("Connected to mongo")
        })
    }
    catch(error){
        throw new DatabaseConnectionError() 
    }
    
}


const connectToNATSServer = ()=>{
    natsWrapper.connect(`${process.env.NAT_STREAMING_CLUSTER_NAME}`,randomBytes(4).toString('hex'),`${process.env.NAT_STREAMING_SERVER}`);
}