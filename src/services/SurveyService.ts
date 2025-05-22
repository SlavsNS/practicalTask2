import { injectable } from 'tsyringe';
import { SurveyModel, ISurvey } from '../models/Survey';
import { ResponseModel, IResponse } from '../models/Response';
import { Types } from 'mongoose';

@injectable()
export class SurveyService {
    async createSurvey(data: Partial<ISurvey>): Promise<ISurvey> {
        const survey = new SurveyModel(data);
        return survey.save();
    }

    async getSurveyById(id: string): Promise<ISurvey | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return SurveyModel.findById(id).exec();
    }

    async getAllSurveys(): Promise<ISurvey[]> {
        return SurveyModel.find().exec();
    }

    async submitResponse(surveyId: string, answers: { questionId: string; answer: string | string[] }[]): Promise<IResponse> {
        if (!Types.ObjectId.isValid(surveyId)) throw new Error('Invalid survey ID');

        // Перевіряємо, чи існує опитування
        const surveyExists = await SurveyModel.exists({ _id: surveyId });
        if (!surveyExists) {
            throw new Error(`Survey with id ${surveyId} not found`);
        }

        const response = new ResponseModel({
            surveyId,
            answers,
            submittedAt: new Date(),
        });
        return response.save();
    }

    async getResponsesBySurveyId(surveyId: string): Promise<IResponse[]> {
        if (!Types.ObjectId.isValid(surveyId)) throw new Error('Invalid survey ID');
        return ResponseModel.find({ surveyId }).lean();
    }
}
