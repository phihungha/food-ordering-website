import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { EmployeeRole } from './roles.enum';

function checkUserHasRole(role: EmployeeRole, employee: any): boolean {
  if (role === 'manageOrders') {
    return employee.manageOrders ? true : false;
  }
  if (role === 'manageInventory') {
    return employee.manageInventory ? true : false;
  }
  if (role === 'manageCustomers') {
    return employee.manageCustomers ? true : false;
  }
  return false;
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = await this.authService.verifySession(req.cookies.session);

    if (user === null) {
      return false;
    }
    req.user = user;

    const requiredRoles = this.reflector.get<EmployeeRole[]>(
      'roles',
      context.getHandler(),
    );

    // Check is customer
    if (!requiredRoles || requiredRoles.length === 0) {
      return user.customer !== null;
    }

    // Check employee role
    return (
      user.employee !== null &&
      requiredRoles.every((i) => checkUserHasRole(i, user.employee))
    );
  }
}
