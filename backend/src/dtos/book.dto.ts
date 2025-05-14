import { IsNotEmpty, IsNumberString, IsString, Max } from "class-validator";

export class CreateBookDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  publisher: string;

  @IsNumberString()
  @IsNotEmpty()
  publicationYear: string;

  @IsString()
  @IsNotEmpty()
  subject: string;
}
