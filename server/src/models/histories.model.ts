import { model, Schema, Document } from 'mongoose';
import { History } from '@/interfaces/histories.interface';
import { Timestamp } from 'mongodb';

const historySchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    required:true,
    default: Date.now
  }
});

const HistoryModel = model<History & Document>('History', historySchema);

export default HistoryModel;
