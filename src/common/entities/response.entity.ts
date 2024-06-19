import { HttpStatus } from '@nestjs/common';

export class ResponseEntity<T = unknown> {
  data: T;
  message?: string;
  status?: HttpStatus;

  constructor({
    message,
    data,
    status,
  }: {
    message?: string;
    data?: T;
    status?: HttpStatus;
  }) {
    this.message = message || 'success';
    this.data = data;
    this.status = status;
  }
}
