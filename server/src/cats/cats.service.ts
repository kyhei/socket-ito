import { Injectable } from '@nestjs/common'
import { Cat, createCatDto } from './cats.interface'

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = []

  create(catDto: createCatDto) {
    if (typeof catDto.age === 'string') {
      catDto.age = parseInt(catDto.age, 10)
    }

    this.cats.push({
      name: catDto.name,
      age: catDto.age,
    })
  }

  findAll(): Cat[] {
    return this.cats
  }
}
