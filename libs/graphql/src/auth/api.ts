import { prismaClient, redisClient } from '@geoint/db';
import { AuthenticationError } from '../errors/authentication';
import { GraphqlContext } from './@types';

type VerifyApiAuthPayload = {
  projectId: string;
  apiKey: string;
};

async function getProjectInfo({ apiKey, projectId }: VerifyApiAuthPayload) {
  const cachedApiInfo = await redisClient.get(apiKey);
  if (cachedApiInfo) {
    return JSON.parse(cachedApiInfo) as { projectId: string; permissions: string[] };
  }

  const apiKeyInfo = await prismaClient.projectApiConfiguration.findFirst({
    select: {
      projectId: true,
      limit: true,
      type: true,
    },
    where: {
      apiKey,
    },
  });

  if (!apiKeyInfo) {
    throw new AuthenticationError('Invalid Token');
  }

  // if (apiKeyInfo.projectId !== projectId) {
  //   throw new AuthenticationError('Invalid Token');
  // }

  // const projectPermissions = await prismaClient.projectRole.findMany({
  //   select: {
  //     projectRolePermissions: {
  //       select: {
  //         permissionAbility: {
  //           select: {
  //             action: true,
  //             subject: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  //   where: {
  //     projectId,
  //   },
  // });

  // const permissions = projectPermissions.flatMap((p) => p.projectRolePermissions.map((role) => role.permissionAbility.subject));

  return {
    projectId,
    permissions: [],
  };
}

export async function verifyApiKeyAuth({ apiKey, projectId }: VerifyApiAuthPayload): Promise<GraphqlContext> {
  if (!apiKey) {
    throw new AuthenticationError('Invalid Token');
  }

  const projectInfo = await getProjectInfo({ apiKey, projectId });

  return {
    accountId: '',
    authorization: apiKey,
    projectId: projectInfo.projectId,
    permissions: projectInfo.permissions,
    role: 'API_KEY',
    apiKeys: [],
  };
}
