import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'

import { Client, Server, Socket } from 'socket.io'

@WebSocketGateway(3001)
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {

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
  async identify(client: Client, data: number): Promise<number> {
    console.log(data)
    return data
  }
}
