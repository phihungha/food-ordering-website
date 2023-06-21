import { UserWithRoleSpecificInfo } from 'src/users/users.service';

declare global {
  namespace Express {
    interface Request {
      user?: UserWithRoleSpecificInfo;
      firebaseUid?: string;
    }
  }
}
