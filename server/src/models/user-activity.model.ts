import { model, Schema, Document } from 'mongoose';
import { UserActivity } from '@/interfaces/users-activity.interface';

const userActivitySchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required:true,
    default: Date.now()
  }
});

const UserActivityModel = model<UserActivity & Document>('user_activity', userActivitySchema);

export default UserActivityModel;
