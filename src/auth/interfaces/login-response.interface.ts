export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    phone: string;
    type?: string;
    profileImage?: any;
  };
}
