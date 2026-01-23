import { TokenType } from '../enum/tokenType.enum';

export interface ResetTokenPayload {
  phone: string;
  tokenType: TokenType.PASSWORD_RESET;
  iat?: number;
  exp?: number;
}
