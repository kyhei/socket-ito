import { Controller, Get, Post, Req, Body, UseFilters, ForbiddenException, ValidationPipe, UsePipes, UseInterceptors } from '@nestjs/common'
import { ExRequest } from 'express'
import { Cat, createCatDto } from './cats.interface'
import { CatsService } from './cats.service'
import { HttpExceptionFilter } from '../common/filter/http-exception.filter'
import { LoggingInterceptor } from '../common/interceptor/logging.interceptor'

@Controller('cats')
@UseInterceptors(LoggingInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(private readonly catsService: CatsService) { }

  @Get()
  async findAll(@Req() request: ExRequest<{}>): Promise<Cat[]> {
    return this.catsService.findAll()
  }

  @Get('forbidden')
  async forbiddenRoute() {
    throw new ForbiddenException()
  }

  /*
  @Post()
  createOne(@Req() request: ExRequest<{ body: Cat }>): Cat {
    this.cats.push(request.body)
    return request.body
  }
  */

  @Post()
  @UsePipes(new ValidationPipe())
  async createOne(@Body() body: createCatDto): Promise<string> {
    this.catsService.create(body)
    return 'create new Neco!'
  }

}
