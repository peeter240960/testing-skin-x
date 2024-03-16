import { atomWithStorage } from 'jotai/utils';
import { AUTH_KEY } from '../const';
import { Authentication } from '../../graphql/generated';

export const authAtom = atomWithStorage<Authentication | undefined>(
  AUTH_KEY,
  undefined
);
