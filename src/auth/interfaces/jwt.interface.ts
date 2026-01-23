import { TokenType } from 'src/auth/enum/tokenType.enum';
import Role from 'src/common/role.enum';

export interface JwtPayload {
  sub: number;
  phone: string;
  role: Role;
  username: string;
  tokenType: TokenType;
  iat?: number;
  exp?: number;
}
  