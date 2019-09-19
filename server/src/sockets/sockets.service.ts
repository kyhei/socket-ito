import { Injectable } from '@nestjs/common'
import { createMessageDto, Message, Room, User } from './sockets.interface'
import { odai } from './sockets.odai'

@Injectable()
export class MessageService {
  private readonly messages: Message[] = []
  private readonly rooms: Room[] = []
  private readonly odai = odai

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
      name: this.getUserNickName(messageDto.roomUuid, messageDto.name),
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
      users: {},
      cond: 'before',
      numbers: [],
    })
  }

  joinRoom(uuid: string, user: User) {
    const room = this.rooms.find(item => item.uuid === uuid)
    if (!room) {
      return
    }

    room.users[user.cliendId] = {
      nickName: user.nickName,
      ready: false,
      put: false,
    }
  }

  leftRoom(uuid: string, cliendId: string): string {
    const roomIndex = this.rooms.findIndex(item => item.uuid === uuid)
    if (roomIndex === -1) {
      return
    }

    const nickName = this.rooms[roomIndex].users[cliendId].nickName

    delete this.rooms[roomIndex].users[cliendId]

    return nickName
  }

  disconnectUser(cliendId: string) {
    const roomIndex = this.rooms.findIndex(item => {
      return item.users[cliendId] !== undefined
    })

    if (roomIndex === -1) {
      return
    }

    delete this.rooms[roomIndex].users[cliendId]
  }

  isExistRoom(uuid: string): boolean {
    const isFound = this.rooms.findIndex(room => room.uuid === uuid)

    if (isFound === -1) {
      return false
    }

    return true
  }

  isAllUsersAreReady(uuid: string): boolean {
    const room = this.rooms.find(item => item.uuid === uuid)
    if (!room) {
      return false
    }

    for (const cliendId in room.users) {
      if (room.users[cliendId].ready === false) {
        return false
      }
    }

    return true
  }

  isAllUsersArePut(uuid: string): boolean {
    const room = this.rooms.find(item => item.uuid === uuid)
    if (!room) {
      return false
    }

    for (const cliendId in room.users) {
      if (room.users[cliendId].put === false) {
        return false
      }
    }

    return true
  }

  changeRoomCondition(uuid: string, state: Room['cond']) {
    const roomIndex = this.rooms.findIndex(item => item.uuid === uuid)
    if (roomIndex === -1) {
      return
    }

    this.rooms[roomIndex].cond = state

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

  setReadyUser(uuid: string, clientId: string): string {
    const roomIndex = this.rooms.findIndex(room => room.uuid === uuid)
    if (roomIndex === -1) {
      return
    }

    this.rooms[roomIndex].users[clientId].ready = true

    return this.rooms[roomIndex].users[clientId].nickName
  }

  getOdai(): string {
    return this.odai[Math.floor(Math.random() * this.odai.length)]
  }

  getNumberCard(): number {
    return 1 + Math.floor(Math.random() * 100)
  }

  putNumberCard(uuid: string, cliendId: string, num: number): string {
    const roomIndex = this.rooms.findIndex(room => room.uuid === uuid)
    if (roomIndex === -1) {
      return ''
    }

    this.rooms[roomIndex].users[cliendId].put = true
    this.rooms[roomIndex].numbers.push(num)

    return this.rooms[roomIndex].users[cliendId].nickName
  }

  isWin(uuid: string): boolean {
    const room = this.rooms.find(item => item.uuid === uuid)
    if (!room) {
      return false
    }

    for (let i = 0; i < room.numbers.length - 1; i++) {
      if (room.numbers[i] < room.numbers[i + 1]) {
        continue
      }
      return false
    }

    return true
  }

  getResult(uuid: string) {
    const room = this.rooms.find(item => item.uuid === uuid)
    if (!room) {
      return false
    }

    return room.numbers
  }

  resetResult(uuid: string) {
    const roomIndex = this.rooms.findIndex(item => item.uuid === uuid)
    if (roomIndex === -1) {
      return false
    }

    this.rooms[roomIndex].numbers = []
  }

  private getUserNickName(uuid: string, clientId: string): string {
    const room = this.rooms.find(item => item.uuid === uuid)
    if (!room || room.users[clientId] === undefined) {
      return ''
    }

    return room.users[clientId].nickName
  }

  private generateUuid(): string {
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
