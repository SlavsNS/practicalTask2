import 'reflect-metadata';
import express, { Application } from 'express';
import { container } from 'tsyringe';
import { SurveyController } from './controllers/SurveyController';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
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
