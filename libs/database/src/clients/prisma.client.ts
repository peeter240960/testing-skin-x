import { PrismaClientPrimary } from '..';

let _primaryPrismaClient: PrismaClientPrimary | null = null;

function getClient(): PrismaClientPrimary {
  if (_primaryPrismaClient) {
    return _primaryPrismaClient;
  }
  _primaryPrismaClient = new PrismaClientPrimary();

  return _primaryPrismaClient;
}

export const prismaClient = getClient();
