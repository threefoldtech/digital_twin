import express, {Application} from "express"
import http from "http"
import bodyParser from "body-parser";
import cors, {CorsOptions} from "cors"
import session from "express-session";
import {startSocketIo} from "./service/socketService"
import routes from "./routes";

const corsOptions: CorsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

const app: Application = express();
const httpServer: http.Server = http.createServer(app)


startSocketIo(httpServer)
app.use(cors(corsOptions))

app.enable('trust proxy');
app.use(session({
    secret: 'secretpassphrase',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        path: "/api",
        secure: true,
        httpOnly: true
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/', routes)

httpServer.listen(3000, "localhost", () => {
    console.log("go to http://localhost:3000");
});
