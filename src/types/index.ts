export interface ILogin {
  user: string;
  password: string;
}

export interface IRegister extends ILogin {
  name: string;
}

export interface IProfile {
  user: string;
}
