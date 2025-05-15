import { IsNotEmpty, IsNumberString, IsString, Max } from "class-validator";

export class CreteParkingSlotDTO {
  @IsString()
  @IsNotEmpty()
  number: string;
}
