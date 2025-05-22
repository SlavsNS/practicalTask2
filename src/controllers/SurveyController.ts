import { Router, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { SurveyService } from '../services/SurveyService';

@autoInjectable()
export class SurveyController {
    public router: Router;
    private surveyService: SurveyService;

    constructor(surveyService?: SurveyService) {
        this.surveyService = surveyService!;
        this.router = Router();

        this.router.post('/', this.createSurvey.bind(this));
        this.router.get('/', this.getAllSurveys.bind(this));
        this.router.get('/:id', this.getSurveyById.bind(this));
        this.router.post('/:id/answers', this.submitResponse.bind(this));
        this.router.get('/:id/results', this.getResponses.bind(this));
    }

    async createSurvey(req: Request, res: Response) {
        try {
            const survey = await this.surveyService.createSurvey(req.body);
            res.status(201).json(survey);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllSurveys(req: Request, res: Response) {
        const surveys = await this.surveyService.getAllSurveys();
        res.json(surveys);
    }

    async getSurveyById(req: Request, res: Response): Promise<void> {
        try {
            const survey = await this.surveyService.getSurveyById(req.params.id);
            if (!survey) {
                res.status(404).json({ message: `Survey with id ${req.params.id} not found` });
                return;
            }
            res.json(survey);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }


    async submitResponse(req: Request, res: Response) {
        try {
            const response = await this.surveyService.submitResponse(req.params.id, req.body.answers);
            res.status(201).json(response);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getResponses(req: Request, res: Response) {
        try {
            const responses = await this.surveyService.getResponsesBySurveyId(req.params.id);
            res.json(responses);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
