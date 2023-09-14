export interface DataStoredInToken {
  userId: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
  authType?: string;
}

export interface RegistrationData {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}
