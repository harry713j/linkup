export type Username = string;
export type Email = string;

export interface AuthRegister {
  username: Username;
  email: Email;
  password: string;
}

export interface AuthLogin {
  identifier: Username | Email;
  password: string;
}
