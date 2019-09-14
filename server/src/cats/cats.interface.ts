import { IsString, IsNotEmpty, IsNumber, IsNumberString } from 'class-validator'

export class createCatDto {

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  age: string | number
}

export interface Cat {
  name: string
  age: number
}
