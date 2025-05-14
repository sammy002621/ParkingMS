export interface TimestampAudit {
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IUser extends TimestampAudit {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
}

export interface IBook extends TimestampAudit {
  id?: number;
  name: string;
  author: string;
  publisher: string;
  publicationYear: string;
  subject: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IMeta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number;
  next: number;
}

export type RegisterInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
