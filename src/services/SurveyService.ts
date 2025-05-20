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

    async submitResponse(surveyId: string, answers: any[]): Promise<IResponse> {
        if (!Types.ObjectId.isValid(surveyId)) throw new Error('Invalid survey ID');
        const response = new ResponseModel({
            surveyId,
            answers,
            submittedAt: new Date(),
        });
        return response.save();
    }

    async getResponsesBySurveyId(surveyId: string) {
        const responses = await ResponseModel.find({surveyId}).lean();
        return {answers: responses};
    }
}
