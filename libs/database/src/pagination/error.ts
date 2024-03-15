export class InvalidPaginationArgs extends Error {
  constructor(message: string) {
    super(message);
  }
}
