import express from 'express';
import { mailSender } from '../controllers/mail.controller';

const mailRouter = express.Router();

mailRouter.post('/mail-sender', mailSender);


export default mailRouter;