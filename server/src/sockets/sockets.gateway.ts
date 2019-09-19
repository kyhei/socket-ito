import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'

import { Server, Socket } from 'socket.io'

import { MessageService } from './sockets.service'
import { Body } from '@nestjs/common'
import { createMessageDto } from './sockets.interface'

@WebSocketGateway(3001)
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly messageService: MessageService) { }

  @WebSocketServer()
  server: Server

  handleConnection(socket: Socket) {
    console.log('someone is connected')
    // socket.broadcast.emit('join', 'moja!')
  }

  handleDisconnect(socket: Socket) {
    console.log('someone is leave')
    this.messageService.disconnectUser(socket.id)
    // socket.broadcast.emit('leave', 'leave event is emitted')
  }

  @SubscribeMessage('identity')
  async identify(socket: Socket) {
    return {
      id: socket.id,
    }
  }

  @SubscribeMessage('fetch all rooms')
  async subscribeFetchAllRooms(socket: Socket) {
    socket.emit(
      'fetch all rooms',
      this.messageService.getAllRooms().map(room => ({
        uuid: room.uuid,
        name: room.name,
      })),
    )
    return 'OK'
  }

  @SubscribeMessage('create room')
  async subscribeCreateRoom(socket: Socket, name: string) {
    this.messageService.createRoom(name)
    this.server.emit('create room', this.messageService.getLatestRoom())
    return 'OK'
  }

  @SubscribeMessage('join room')
  async subscribeJoinRoom(socket: Socket, params: { roomUuid: string, nickName: string }) {
    if (!this.messageService.isExistRoom(params.roomUuid)) {
      return 'room is not found'
    }

    socket.join(params.roomUuid)
    socket.to(params.roomUuid).broadcast.emit('join room', params.nickName)

    this.messageService.joinRoom(
      params.roomUuid,
      {
        nickName: params.nickName,
        cliendId: socket.id,
      },
    )
  }

  @SubscribeMessage('left room')
  async subscribeLeftRoom(socket: Socket, roomUuid: string) {
    const leftMemberName = this.messageService.leftRoom(roomUuid, socket.id)
    socket.to(roomUuid).broadcast.emit('left room', leftMemberName)

    if (this.messageService.isRoomEmpty(roomUuid)) {
      this.messageService.removeRoom(roomUuid)
      this.server.emit(
        'fetch all rooms',
        this.messageService.getAllRooms().map(room => ({
          uuid: room.uuid,
          name: room.name,
        })),
      )
    }
  }

  @SubscribeMessage('user ready')
  async subscribeReadyUser(socket: Socket, roomUuid: string) {
    const nickName = this.messageService.setReadyUser(roomUuid, socket.id)
    this.server.to(roomUuid).emit('user ready', nickName)

    if (this.messageService.isAllUsersAreReady(roomUuid)) {
      this.server.to(roomUuid).emit('game start', this.messageService.getOdai())
      this.messageService.changeRoomCondition(roomUuid, 'playing')
    }
  }

  @SubscribeMessage('fetch number card')
  async subscribeFetchNumberCard(socket: Socket) {
    socket.emit('fetch number card', this.messageService.getNumberCard())
    return 'OK'
  }

  @SubscribeMessage('put number card')
  async subscribePutNumberCard(socket: Socket, params: { roomUuid: string, num: number }) {
    const nickName = this.messageService.putNumberCard(params.roomUuid, socket.id, params.num)
    this.server.to(params.roomUuid).emit('put number card', nickName)

    if (this.messageService.isAllUsersArePut(params.roomUuid)) {
      this.server.to(params.roomUuid).emit('game end', {
        win: this.messageService.isWin(params.roomUuid),
        result: this.messageService.getResult(params.roomUuid),
      })
      this.messageService.changeRoomCondition(params.roomUuid, 'end')
      this.messageService.resetResult(params.roomUuid)
    }
  }

  @SubscribeMessage('fetch all messages')
  async subscribeFetchAllMessage(socket: Socket, roomUuid: string) {
    socket.emit('fetch all messages', this.messageService.getAllMessages(roomUuid))
    return 'OK'
  }

  @SubscribeMessage('new message')
  async subscribeNewMessage(socket: Socket, @Body() message: createMessageDto) {
    this.messageService.createMessage(message)
    this.server.to(message.roomUuid).emit('new message', this.messageService.getLatestMessage(message.roomUuid))
    return 'OK'
  }
}
