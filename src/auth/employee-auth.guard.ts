import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EmployeeRole } from './employee-role.enum';
import { Request } from 'express';
import { UserWithRoleSpecificInfo } from 'src/users/users.service';
import { UserType } from '@prisma/client';

function checkUserHasRole(
  role: EmployeeRole,
  user: UserWithRoleSpecificInfo,
): boolean {
  const employee = user?.employee;
  if (role === 'manageOrders') {
    return employee?.manageOrders ? true : false;
  }
  if (role === 'manageInventory') {
    return employee?.manageInventory ? true : false;
  }
  if (role === 'manageCustomers') {
    return employee?.manageCustomers ? true : false;
  }
  return false;
}

@Injectable()
export class EmployeeAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const user = req.user;

    if (!user) {
      return false;
    }

    const requiredRoles = this.reflector.get<EmployeeRole[]>(
      'roles',
      context.getHandler(),
    );

    // Check is employee
    if (!requiredRoles || requiredRoles.length === 0) {
      return user.type === UserType.Employee;
    }

    // Check employee role
    return (
      user.employee !== null &&
      requiredRoles.every((i) => checkUserHasRole(i, user))
    );
  }
}
