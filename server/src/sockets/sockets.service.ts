import { Injectable } from '@nestjs/common'
import { createMessageDto, Message, Room } from './sockets.interface'

@Injectable()
export class MessageService {
  private readonly messages: Message[] = []
  private readonly rooms: Room[] = []

  create(messageDto: createMessageDto) {
    this.messages.push({
      id: this.messages.length + 1,
      name: messageDto.name,
      content: messageDto.content,
      date: messageDto.date,
    })
  }

  createMessage(messageDto: createMessageDto) {
    const roomIndex = this.rooms.findIndex(room => room.uuid === messageDto.roomUuid)
    if (roomIndex === -1) {
      return false
    }
    this.rooms[roomIndex].messages.push({
      id: this.rooms[roomIndex].messages.length + 1,
      name: messageDto.name,
      content: messageDto.content,
      date: messageDto.date,
    })
  }

  createRoom(name: string) {
    const uuid = this.generateUuid()
    this.rooms.push({
      name,
      uuid,
      messages: [],
    })
  }

  isExistRoom(uuid: string): boolean {
    const isFound = this.rooms.findIndex(room => room.uuid === uuid)

    if (isFound === -1) {
      return false
    }

    return true
  }

  getAll(): Message[] {
    return this.messages
  }

  getAllMessages(roomUuid: string): Message[] {
    const room = this.rooms.find(item => item.uuid === roomUuid)
    if (!room) {
      return []
    }

    return room.messages
  }

  getLatestOne(): Message {
    return this.messages.slice(-1)[0]
  }

  getLatestMessage(roomUuid: string): Message | {} {
    const room = this.rooms.find(item => item.uuid === roomUuid)
    if (!room) {
      return {}
    }

    return room.messages.slice(-1)[0]
  }

  getAllRooms(): Room[] {
    return this.rooms
  }

  getLatestRoom(): Room {
    return this.rooms.slice(-1)[0]
  }

  private generateUuid() {
    // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
    // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    const chars = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('')
    for (let i = 0, len = chars.length; i < len; i++) {
      switch (chars[i]) {
        case 'x':
          chars[i] = Math.floor(Math.random() * 16).toString(16)
          break
        case 'y':
          chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16)
          break
      }
    }
    return chars.join('')
  }
}
