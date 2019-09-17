import { IsString, IsNotEmpty } from 'class-validator'

export class createMessageDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  content: string

  @IsNotEmpty()
  @IsString()
  date: string
}

export interface Message {
  id: number
  name: string
  content: string
  date: string
}
