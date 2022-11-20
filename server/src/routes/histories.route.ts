import { Router } from 'express';
import HistoriesController from '@/controllers/histories.controller';
import { CreateHistoriesDto } from '@/dtos/histories.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class HistoriesRoute implements Routes {
  public path = '/history';
  public router = Router();
  public historyController = new HistoriesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.historyController.getHistories);
    this.router.get(`${this.path}/:id`, this.historyController.getHistoryById);
    this.router.post(`${this.path}`, validationMiddleware(CreateHistoriesDto, 'body'), this.historyController.createHistory);
  }
}

export default HistoriesRoute;
