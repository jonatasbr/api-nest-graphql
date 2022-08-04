import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TestUtil from '../../common/test/TestUtil';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    mockRepository.create.mockReset();
    mockRepository.delete.mockReset();
    mockRepository.find.mockReset();
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.findOneBy.mockReset();
    mockRepository.save.mockReset();
    mockRepository.update.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When find all users', () => {
    it('should be list all users', async () => {
      const user = TestUtil.giveMeAValidUserMock();
      mockRepository.find.mockReturnValue([user, user]);
      const users = await service.findAllUsers();
      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When get user by id', () => {
    it('should be get user', async () => {
      const user = TestUtil.giveMeAValidUserMock();
      mockRepository.findOneBy.mockReturnValue(user);
      const userFound = await service.getUserById(user.id);
      expect(userFound).toBe(user);
      expect(mockRepository.findOneBy).toHaveBeenCalledTimes(1);
    });

    it('should get an exception when doesn`t to find a user', async () => {
      mockRepository.findOneBy.mockReturnValue(null);
      await expect(service.getUserById('4')).rejects.toMatchObject(
        new NotFoundException('Usuário não encontrado'),
      );
    });
  });

  describe('When get user by e-mail', () => {
    it('should be get user', async () => {
      const user = TestUtil.giveMeAValidUserMock();
      mockRepository.findOne.mockReturnValue(user);
      const userFound = await service.getUserByEmail(user.email);
      expect(userFound).toMatchObject({
        name: user.name,
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should get an exception when doesn`t to find a user', async () => {
      mockRepository.findOne.mockReturnValue(null);
      await expect(
        service.getUserByEmail('alguem@mail.com'),
      ).rejects.toMatchObject(new NotFoundException('Usuário não encontrado'));
    });
  });

  describe('When create user', () => {
    it('should create a user', async () => {
      const user = TestUtil.giveMeAValidUserMock();
      mockRepository.save.mockReturnValue(user);
      mockRepository.create.mockReturnValue(user);

      const savedUser = await service.createUser(user);
      expect(savedUser).toMatchObject(user);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });

    it('should get a exception to create a user', async () => {
      const user = TestUtil.giveMeAValidUserMock();
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(null);

      await expect(service.createUser(user)).rejects.toMatchObject(
        new InternalServerErrorException('Erro ao criar usuário'),
      );
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });

  describe('When update user', () => {
    it('should update a user', async () => {
      const user = TestUtil.giveMeAValidUserMock();
      const updatedUser = { name: 'Nome Atualizado' };
      mockRepository.findOneBy.mockReturnValue(user);
      mockRepository.save.mockReturnValue({
        ...user,
        ...updatedUser,
      });
      mockRepository.create.mockReturnValue({
        ...user,
        ...updatedUser,
      });
      const resultUser = await service.updateUser({ ...user, ...updatedUser });
      expect(resultUser).toMatchObject(updatedUser);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.findOneBy).toBeCalledTimes(1);
      expect(mockRepository.update).toBeCalledTimes(1);
    });
  });

  describe('When delete user', () => {
    it('should delete a user', async () => {
      const user = TestUtil.giveMeAValidUserMock();
      mockRepository.findOneBy.mockReturnValue(user);
      mockRepository.delete.mockReturnValue(user);

      const deletedUser = await service.deleteUser('1');
      expect(deletedUser).toBe(true);
      expect(mockRepository.findOneBy).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });

    it('should return false to delete user', async () => {
      const user = TestUtil.giveMeAValidUserMock();
      mockRepository.findOneBy.mockReturnValue(user);
      mockRepository.delete.mockReturnValue(null);

      const deletedUser = await service.deleteUser('0');
      expect(deletedUser).toBe(false);
      expect(mockRepository.findOneBy).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });
  });
});
