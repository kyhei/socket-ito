import { Injectable } from '@nestjs/common'
import { createMessageDto, Message, Room, User } from './sockets.interface'
import { odai } from './sockets.odai'
import { makeShuffledArray } from '../common/functions'

@Injectable()
export class MessageService {
  private readonly messages: Message[] = []
  private readonly rooms: Room[] = []
  private readonly odai = odai

  createMessage(messageDto: createMessageDto) {
    const roomIndex = this.rooms.findIndex(room => room.uuid === messageDto.roomUuid)
    if (roomIndex === -1) {
      return false
    }
    this.rooms[roomIndex].messages.push({
      id: this.rooms[roomIndex].messages.length + 1,
      name: this.getUserNickName(messageDto.roomUuid, messageDto.name),
      content: messageDto.content,
      date: this.generateDateString(),
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
      odaiIndexs: [],
    })
  }

  joinRoom(uuid: string, user: User) {
    const roomIndex = this.rooms.findIndex(item => item.uuid === uuid)
    if (roomIndex === -1) {
      return
    }

    this.rooms[roomIndex].users[user.cliendId] = {
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

  getRoomMembersNames(uuid: string): string[] {
    const room = this.rooms.find(item => item.uuid === uuid)
    if (!room) {
      return []
    }

    const names: string[] = []
    for (const cliendId in room.users) {

      if (room.users[cliendId] === undefined) {
        continue
      }
      names.push(room.users[cliendId].nickName)
    }

    return names

  }

  getOdai(uuid: string): string {
    const names = this.getRoomMembersNames(uuid)
    const target = makeShuffledArray<string>(names).pop()

    const roomIndex = this.rooms.findIndex(room => room.uuid === uuid)
    if (roomIndex === -1) {
      return ''
    }

    if (this.rooms[roomIndex].odaiIndexs.length === 0) {
      this.rooms[roomIndex].odaiIndexs = makeShuffledArray(this.odai.length)
    }

    return this.odai[this.rooms[roomIndex].odaiIndexs.pop()].replace('<name>', target)
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
      if (room.numbers[i] <= room.numbers[i + 1]) {
        continue
      }
      return false
    }

    return true
  }

  isRoomEmpty(uuid: string): boolean {
    const roomIndex = this.rooms.findIndex(item => item.uuid === uuid)
    if (roomIndex === -1) {
      return false
    }

    return (Object.keys(this.rooms[roomIndex].users).length === 0) ? true : false
  }

  getResult(uuid: string) {
    const room = this.rooms.find(item => item.uuid === uuid)
    if (!room) {
      return false
    }

    return room.numbers
  }

  removeRoom(uuid: string) {
    const roomIndex = this.rooms.findIndex(item => item.uuid === uuid)
    if (roomIndex === -1) {
      return
    }

    this.rooms.splice(roomIndex, 1)
  }

  resetResult(uuid: string) {
    const roomIndex = this.rooms.findIndex(item => item.uuid === uuid)
    if (roomIndex === -1) {
      return false
    }

    this.rooms[roomIndex].numbers = []

    for (const clientId in this.rooms[roomIndex].users) {
      if (this.rooms[roomIndex].users[clientId] === undefined) {
        continue
      }

      this.rooms[roomIndex].users[clientId].ready = false
      this.rooms[roomIndex].users[clientId].put = false
      this.rooms[roomIndex].messages = []
    }
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

  private generateDateString(): string {
    return new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
}
