import Role from 'src/common/role.enum';

export interface AuthenticatedAccount {
  id: number;
  phone: string;
  role: Role;
}
