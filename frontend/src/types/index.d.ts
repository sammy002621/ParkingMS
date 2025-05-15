import { PaymentMethod, PaymentStatus } from "@/enums";

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

export interface TimestampAudit {
  createdAt: Date;
  updatedAt: Date;
}

export interface ISession extends TimestampAudit {
  id?: string;
  entryTime: Date;
  exitTime?: Date ;
  paymentStatus: PaymentStatus;
  plateNumber: string;
  isExited: boolean;
  slotId: string;
  userId: string;
  slot: ISlot;
  payment?: IPayment;
}

export interface ICreateSession {
  plateNumber:string;
  slotId:string
}
export interface ISlot extends TimestampAudit {
  id: string;
  number: string;
  isOccupied: boolean;
}

export interface IPayment extends TimestampAudit {
  id: string;
  amount: number;
  method: PaymentMethod;
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
