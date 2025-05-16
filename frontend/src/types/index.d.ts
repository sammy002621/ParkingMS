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
  exitTime?: Date;
  paymentStatus: PaymentStatus;
  plateNumber: string;
  isExited: boolean;
  slotId: string;
  userId: string;
  slot: ISlot;
  payment?: IPayment;
}

export interface ICreateSession {
  plateNumber: string;
  slotId: string;
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

export type PaymentFee = {
  session: string;
  entryTime: string;
  parkingSlot: string;
  user: string;
  vehicle_plate_number: string;
  parking_hours: number;
  fee: number;
};
export type PaymentFeePayload = {
  sessionId: string;
  plateNumber: string;
  amount: number;
  method: PaymentMethod;
};

export interface PaymentFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PaymentFee;
  onProceed: (data: PaymentFeePayload) => void;
}

interface SessionData {
  id: string;
  plateNumber: string;
  entryTime: string;
  exitTime?: string | null;
  paymentStatus: "PAID" | "UNPAID";
  isExited: boolean;
}

interface SessionDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  data: SessionData | null;
  onProceed: (sessionId: string) => void;
}
