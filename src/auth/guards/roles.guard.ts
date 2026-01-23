import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/auth/decorators/roles.decorator';
import { AuthenticatedAccount } from 'src/auth/interfaces/authenticated-account.interface';
import { matchRoles } from 'src/auth/utils/role.util';
import Role from 'src/common/role.enum';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: Role[] = this.reflector.get(ROLES_KEY, context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedAccount = request.user;
    return matchRoles(roles, user.role);
  }
}
