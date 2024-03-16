import { PrismaClient } from "..";

let _primaryPrismaClient: PrismaClient | null = null;

function getClient(): PrismaClient {
  if (_primaryPrismaClient) {
    return _primaryPrismaClient;
  }
  _primaryPrismaClient = new PrismaClient();

  return _primaryPrismaClient;
}

export const prismaClient = getClient();
