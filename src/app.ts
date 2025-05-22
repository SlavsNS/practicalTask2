import 'reflect-metadata';
import express, { Application } from 'express';
import { container } from 'tsyringe';
import { SurveyController } from './controllers/SurveyController';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
const swaggerPath = path.join(process.cwd(), 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
import { json } from 'body-parser';
import morgan from 'morgan';

const app: Application = express();

app.use(json());
app.use(morgan('dev'));

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ініціалізація контролерів та маршрутів
const surveyController = container.resolve(SurveyController);
app.use('/surveys', surveyController.router);

// Глобальний обробник помилок
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

export default app;
