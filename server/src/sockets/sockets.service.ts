import { Injectable } from '@nestjs/common'
import { createMessageDto, Message } from './sockets.interface'

@Injectable()
export class MessageService {
  private readonly messages: Message[] = []

  create(messageDto: createMessageDto) {
    this.messages.push({
      id: this.messages.length + 1,
      name: messageDto.name,
      content: messageDto.content,
      date: messageDto.date,
    })
  }

  getAll(): Message[] {
    return this.messages
  }

  getLatestOne(): Message {
    return this.messages.slice(-1)[0]
  }
}
