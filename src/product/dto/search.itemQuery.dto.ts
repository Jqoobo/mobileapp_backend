import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ItemQuery {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(75)
  item: string;
}
