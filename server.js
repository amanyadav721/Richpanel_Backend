import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

app.use("/auth",authRoutes);

const PORT = 3001
const URI = "mongodb+srv://ad721603:k7qaw96EfgXYD1u8@cluster0.hvxyhy1.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port : ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));

