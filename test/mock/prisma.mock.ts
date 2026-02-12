export const mockPrismaService = {
  profile: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  },
};
