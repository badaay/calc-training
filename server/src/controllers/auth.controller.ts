import { CreateUserActivityDto } from './../dtos/user-activity.dto';
import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';

import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';

import AuthService from '@services/auth.service';
import UserActivityService from '@/services/user-activity.service';

class AuthController {
  public authService = new AuthService();
  public userActivityService = new UserActivityService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { tokenData, findUser } = await this.authService.login(userData);

      const activityData: CreateUserActivityDto = {
        email:userData.email,
        type:"login"
      }
      await this.userActivityService.logActivity(activityData)
      // res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({success: true, data: tokenData , message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authService.logout(userData);

      const activityData: CreateUserActivityDto = {
        email:userData.email,
        type:"logout"
      }
      await this.userActivityService.logActivity(activityData)

      // res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({success: true, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
