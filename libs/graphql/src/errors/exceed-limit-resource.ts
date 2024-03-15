import { GraphqlError } from './graphql-error';

export class ExceedLimitResource extends GraphqlError {
  constructor(message = '', extensions?: object) {
    super(`Exceed limit resources: ${message}`, extensions, 409);
  }
}
