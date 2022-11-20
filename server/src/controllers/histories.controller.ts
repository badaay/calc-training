import { NextFunction, Request, Response } from 'express';
import { CreateHistoriesDto } from '@/dtos/histories.dto';
import { History } from '@/interfaces/histories.interface';
import historyService from '@/services/histories.service';

class HistoriesController {
  public historyService = new historyService();

  public getHistories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllData: History[] = await this.historyService.findAll();

      res.status(200).json({ data: findAllData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getHistoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const historyId: string = req.params.id;
      const findOneHistoryData: History = await this.historyService.findById(historyId);

      res.status(200).json({ data: findOneHistoryData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: CreateHistoriesDto = req.body;
      const createHistoryData: History = await this.historyService.createHistory(data);

      res.status(201).json({ data: createHistoryData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}

export default HistoriesController;
