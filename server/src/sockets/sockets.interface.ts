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

  @IsNotEmpty()
  @IsString()
  roomUuid: string
}

export interface Message {
  id: number
  name: string
  content: string
  date: string
}

export interface Room {
  uuid: string
  name: string
  messages: Message[]
  users: {
    [K in string]: {
      nickName: string,
      ready: boolean,
      put: boolean,
    }
  }
  cond: 'before' | 'playing' | 'end'
  numbers: number[]
}

export interface User {
  cliendId: string
  nickName: string
}

export interface Odai {
  content: string,
}
