import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index'; // або '../app', залежно від експорту

describe('Survey API', () => {
    let createdSurveyId: string;
    let createdQuestionId: string;

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new survey', async () => {
        const res = await request(app)
            .post('/surveys')
            .send({
                title: 'Опитування для тестування',
                questions: [
                    {
                        questionText: 'Яка мова програмування найкраща?',
                        type: 'single-choice',
                        options: ['JavaScript', 'Python', 'C++'],
                    },
                ],
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        createdSurveyId = res.body._id;
        createdQuestionId = res.body.questions[0]._id;
    });

    it('should get all surveys', async () => {
        const res = await request(app).get('/surveys');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get a survey by ID', async () => {
        const res = await request(app).get(`/surveys/${createdSurveyId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id', createdSurveyId);
    });

    it('should submit an answer', async () => {
        const res = await request(app)
            .post(`/surveys/${createdSurveyId}/answers`)
            .send({
                answers: [
                    {
                        questionId: createdQuestionId,
                        answer: 'JavaScript',
                    },
                ],
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
    });

    it('should get survey results', async () => {
        const res = await request(app).get(`/surveys/${createdSurveyId}/results`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('answers');
        expect(Array.isArray(res.body.answers)).toBe(true);
    });
});
