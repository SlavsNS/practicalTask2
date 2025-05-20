import { Schema, model, Document } from 'mongoose';

export interface IQuestion {
    questionText: string;
    type: 'text' | 'single-choice' | 'multiple-choice';
    options?: string[];
}

export interface ISurvey extends Document {
    title: string;
    description?: string;
    questions: IQuestion[];
    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
    questionText: { type: String, required: true },
    type: { type: String, enum: ['text', 'single-choice', 'multiple-choice'], required: true },
    options: [{ type: String }],
});

const SurveySchema = new Schema<ISurvey>({
    title: { type: String, required: true },
    description: { type: String },
    questions: { type: [QuestionSchema], required: true },
}, { timestamps: true });

export const SurveyModel = model<ISurvey>('Survey', SurveySchema);
