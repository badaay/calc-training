import { hash } from 'bcrypt';
import { CreateHistoriesDto } from '@/dtos/histories.dto';
import { HttpException } from '@exceptions/HttpException';
import { History } from '@/interfaces/histories.interface';
import HistoryModel from '@/models/histories.model';
import { isEmpty } from '@utils/util';

class HistoryService {
  public histories = HistoryModel;

  public async findAll(): Promise<History[]> {
    const histories: History[] = await this.histories.find();
    return histories;
  }

  public async findById(historyId: string): Promise<History> {
    if (isEmpty(historyId)) throw new HttpException(400, "historyId is empty");

    const findHistory: History = await this.histories.findOne({ _id: historyId });
    if (!findHistory) throw new HttpException(409, "History doesn't exist");

    return findHistory;
  }

  public async createHistory(historyData: CreateHistoriesDto): Promise<History> {
    if (isEmpty(historyData)) throw new HttpException(400, "historyData is empty");

    const createHistoryData: History = await this.histories.create({ ...historyData });

    return createHistoryData;
  }
}

export default HistoryService;
