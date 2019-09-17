import { Module } from '@nestjs/common'
import { EventGateway } from './sockets.gateway'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

@Module({
  providers: [EventGateway],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: '/opt/workspace/server/static',
    },
    ),
  ],
})
export class SocketsModule { }
