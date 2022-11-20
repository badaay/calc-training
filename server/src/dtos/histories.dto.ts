import { IsEmail, IsString, IsDate} from 'class-validator';

export class CreateHistoriesDto {
  @IsEmail()
  public email: string;

  @IsString()
  public activity: String;
}
