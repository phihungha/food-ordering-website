import { IsNotEmpty } from 'class-validator';

export class LoginPayload {
  @IsNotEmpty()
  idToken: string;
}
