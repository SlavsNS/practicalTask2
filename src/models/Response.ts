import { Schema, model, Document, Types } from 'mongoose';

export interface IAnswer {
    questionId: Types.ObjectId;
    answer: string | string[];
}

export interface IResponse extends Document {
    surveyId: Types.ObjectId;
    answers: IAnswer[];
    submittedAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
    questionId: { type: Schema.Types.ObjectId, required: true },
    answer: { type: Schema.Types.Mixed, required: true },
});

const ResponseSchema = new Schema<IResponse>({
    surveyId: { type: Schema.Types.ObjectId, ref: 'Survey', required: true },
    answers: { type: [AnswerSchema], required: true },
    submittedAt: { type: Date, default: Date.now }
});

export const ResponseModel = model<IResponse>('Response', ResponseSchema);
