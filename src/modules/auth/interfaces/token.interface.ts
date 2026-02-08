export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IPayload {
  sub: string;
  iat: number;
  exp: number;
}
