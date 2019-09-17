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
    socket.broadcast.emit('join', 'moja!')
  }

  handleDisconnect(socket: Socket) {
    console.log('someone is leave')
    socket.broadcast.emit('leave', 'leave event is emitted')
  }

  @SubscribeMessage('events')
  async findAll(client: Client, data: any) {
    console.log(data)
    console.log(`clientID is ${client.id}`)
    return {
      id: client.id,
      name: 'your name!',
    }
  }

  @SubscribeMessage('identity')
  async identify(client: Client, data: number) {
    console.log(data)
    return {
      id: client.id,
      data,
    }
  }

  @SubscribeMessage('fetch all messages')
  async subscribeFetchAllMessage(socket: Socket) {
    socket.emit('fetch all messages', this.messageService.getAll())
    return 'OK'
  }

  @SubscribeMessage('new message')
  async subscribeNewMessage(socket: Socket, @Body() message: createMessageDto) {
    this.messageService.create(message)
    this.server.emit('new message', this.messageService.getLatestOne())
    return 'OK'
  }
}
