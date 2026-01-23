import Role from 'src/common/role.enum';

function matchRoles(
  requiredRoles: Role | Role[],
  userRoles: Role | Role[],
): boolean {
  if (!requiredRoles || !userRoles) {
    return false;
  }

  const requiredRolesArray = Array.isArray(requiredRoles)
    ? requiredRoles
    : [requiredRoles];
  const userRolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];

  return userRolesArray.some((userRole) =>
    requiredRolesArray.includes(userRole),
  );
}

export { matchRoles };
