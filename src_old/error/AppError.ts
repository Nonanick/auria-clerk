export class AppError extends Error {

  public statusCode: number = 500;

  constructor(message: string, code?: number) {
    super(message);
    this.statusCode = code ?? 500;
  }
}