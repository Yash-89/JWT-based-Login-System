import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/users', userRoutes);

try {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server is listening on ${PORT}`);
    });
} catch (error) {
    console.error(error);
}