import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'

import { Client, Server, Socket } from 'socket.io'

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
    // socket.broadcast.emit('leave', 'leave event is emitted')
  }

  @SubscribeMessage('identity')
  async identify(client: Client) {
    return {
      id: client.id,
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
        cliendId: socket.client.id,
      },
    )
  }

  @SubscribeMessage('left room')
  async subscribeLeftRoom(socket: Socket, roomUuid: string) {
    const leftMemberName = this.messageService.leftRoom(roomUuid, socket.client.id)
    socket.to(roomUuid).broadcast.emit('left room', leftMemberName)
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
