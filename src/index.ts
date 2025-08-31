import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotevn from 'dotenv';
import mailRouter from './routes/mail.route';
import axios from "axios";
import cron from 'node-cron';


dotevn.config();
const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

app.use(express.json({
    limit: '50mb'
}));

app.use(cors({
    origin: (origin, callback) => {
        if(!origin || allowedOrigins.includes(origin)){
            callback(null,true);
        } else {
            callback(new Error('Not allowed by cors'))
        }
    },
    credentials: true,
}));

app.use("/api/v1", mailRouter);

//Health check 
app.get("/health", (req, res) => {
  res.status(200).json({
    status: 'ok',
    timeStamp:new Date().toDateString()
  })
})

// ⏰ Schedule: runs every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  try {
    await axios.get(`${String(process.env.BACKEND_URL)}/health`);
  } catch (err) {
    console.log(err)
  }
});

app.use(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});