import type { IError } from '@/types';

export class ClientError extends Error implements IError {
  constructor(message: string) {
    super(message);
    this.name = 'ClientError';
  }
}

export class NetworkError extends Error implements IError {
  httpCode: string | number;
  constructor(httpCode: string | number, message: string) {
    super(message);
    this.httpCode = httpCode;
    this.name = 'NetworkError';
  }
}

export class BuessinessError extends Error implements IError {
  code: string | number;
  constructor(code: string | number, message: string) {
    super(message);
    this.code = code;
    this.name = 'BuessinessError';
  }
}

export default { ClientError, NetworkError, BuessinessError };
