import { IsEmail, IsString} from 'class-validator';

export class CreateUserActivityDto {
  @IsEmail()
  public email: string;

  @IsString()
  public type: String;
}
