import { CreateUserActivityDto } from '@/dtos/user-activity.dto';
import { UserActivity } from '@/interfaces/users-activity.interface';
import UserActivityModel from '@/models/user-activity.model';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';

class UserActivityService {
  public activity = UserActivityModel;

  public async logActivity(activityData: CreateUserActivityDto): Promise<UserActivity> {
    if (isEmpty(activityData)) throw new HttpException(400, "activity data is empty");

    const createUserActivity: UserActivity = await this.activity.create({ ...activityData, createdAt : new Date()});

    return createUserActivity;
  }


}

export default UserActivityService;
