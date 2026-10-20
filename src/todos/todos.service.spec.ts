import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

describe('TodosService', () => {
  let service: TodosService;

  const prismaMock = {
    todo: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  }

  beforeEach(async () => {

    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [TodosService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('retorna o todo quando ele existe', async () => {
    const todo = { id: 1, title: 'Estudar NestJS', done: false, createdAt: new Date() };
    prismaMock.todo.findUnique.mockResolvedValue(todo);

    await expect(service.findOne(1)).resolves.toEqual(todo);
    expect(prismaMock.todo.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('lança NotFoundException quando o todo não existe', async () => {
    prismaMock.todo.findUnique.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('não chama o delete quando o todo não existe', async () => {
    prismaMock.todo.findUnique.mockResolvedValue(null);

    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    expect(prismaMock.todo.delete).not.toHaveBeenCalled();
  });
});
