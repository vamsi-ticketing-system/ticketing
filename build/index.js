"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const SaveEventRouter_1 = require("./routes/events/SaveEventRouter");
const common_1 = require("@vamsi-ticketing/common");
const mongoose_1 = __importDefault(require("mongoose"));
const FetchEventsRouter_1 = require("./routes/events/FetchEventsRouter");
const NATSWrapper_1 = __importDefault(require("./events/NATSWrapper"));
const crypto_1 = require("crypto");
const FetchTheatersRouter_1 = require("./routes/theaters/FetchTheatersRouter");
const SaveTheaterRouter_1 = require("./routes/theaters/SaveTheaterRouter");
const SaveEventReleases_1 = require("./routes/event-releases/SaveEventReleases");
const FetchEventReleases_1 = require("./routes/event-releases/FetchEventReleases");
const ScheduledEventsRouter_1 = require("./routes/scheduled-events/ScheduledEventsRouter");
const PreBookingRouter_1 = require("./routes/pre-booking/PreBookingRouter");
const SeatInfoRouter_1 = require("./routes/pre-booking/SeatInfoRouter");
const LanguageFetchRouter_1 = require("./routes/languages/LanguageFetchRouter");
const LanguagesSaveUpdateRouter_1 = require("./routes/languages/LanguagesSaveUpdateRouter");
const GenresSaveUpdateRouter_1 = require("./routes/genres/GenresSaveUpdateRouter");
const GenresFetchRouter_1 = require("./routes/genres/GenresFetchRouter");
const PaymentConfirmationRouter_1 = require("./routes/payment-confirmation/PaymentConfirmationRouter");
const BookingHistoryRouter_1 = require("./routes/booking-history/BookingHistoryRouter");
require("./config/config");
const PORT = process.env.PORT || 9002;
const VERSION = "/v1";
const BASE_URL = "/api" + VERSION + "/ticketing";
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const saveEvent = new SaveEventRouter_1.SaveEventRouter();
app.use(BASE_URL + "/events", saveEvent.router);
const fetchEvents = new FetchEventsRouter_1.FetchEventsRouter();
app.use(BASE_URL + "/events", fetchEvents.router);
const fetchTheaters = new FetchTheatersRouter_1.FetchTheatersRouter();
app.use(BASE_URL + "/theaters", fetchTheaters.router);
const saveTheaters = new SaveTheaterRouter_1.SaveTheaterRouter();
app.use(BASE_URL + "/theaters", saveTheaters.router);
const fetchEventReleases = new FetchEventReleases_1.FetchEventReleasesRouter();
app.use(BASE_URL + "/event-releases", fetchEventReleases.router);
const saveEventReleases = new SaveEventReleases_1.SaveEventReleases();
app.use(BASE_URL + "/event-releases", saveEventReleases.router);
const scheduledEvents = new ScheduledEventsRouter_1.ScheduledEventsRouter();
app.use(BASE_URL + "/open-tills", scheduledEvents.router);
const preBookingRouter = new PreBookingRouter_1.PreBookingRouter();
app.use(BASE_URL + "/pre-booking", preBookingRouter.router);
const seatInfoRouter = new SeatInfoRouter_1.SeatInfoRouter();
app.use(BASE_URL + "/seat-status", seatInfoRouter.router);
const languageFetchRouter = new LanguageFetchRouter_1.LanguageFetchRouter();
app.use(BASE_URL + "/languages", languageFetchRouter.router);
const languageSaveUpdateRouter = new LanguagesSaveUpdateRouter_1.LanguagesSaveUpdateRouter();
app.use(BASE_URL + "/languages", languageSaveUpdateRouter.router);
const genresFetchRouter = new GenresFetchRouter_1.GenresFetchRouter();
app.use(BASE_URL + "/genres", genresFetchRouter.router);
const genresSaveUpdateRouter = new GenresSaveUpdateRouter_1.GenresSaveUpdateRouter();
app.use(BASE_URL + "/genres", genresSaveUpdateRouter.router);
const paymentConfirmationRouter = new PaymentConfirmationRouter_1.PaymentConfirmationRouter();
app.use(BASE_URL + "/payment-confirmation", paymentConfirmationRouter.router);
const bookingHistoryRouter = new BookingHistoryRouter_1.BookingHistoryRouter();
app.use(BASE_URL + "/booking-history", bookingHistoryRouter.router);
app.all("*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    throw new common_1.NotFoundError();
}));
app.use(common_1.errorHandler);
app.listen(PORT, () => {
    connectToNATSServer();
    connectToMongo();
    console.log(`Ticketing APIs(${VERSION}) is accessible on ${PORT} `);
});
const connectToMongo = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mongoose_1.default.connect(`${process.env.MONGODB_CONNECTION_URL}${process.env.MONGODB_DATABASE}`, {
            authSource: process.env.MONGODB_AUTH_SOURCE,
            user: process.env.MONGODB_USER,
            pass: process.env.MONGODB_PASSWORD
        }).then(() => {
            console.log("Connected to mongo");
        });
    }
    catch (error) {
        throw new common_1.DatabaseConnectionError();
    }
});
const connectToNATSServer = () => {
    NATSWrapper_1.default.connect(`${process.env.NAT_STREAMING_CLUSTER_NAME}`, (0, crypto_1.randomBytes)(4).toString('hex'), `${process.env.NAT_STREAMING_SERVER}`);
};
