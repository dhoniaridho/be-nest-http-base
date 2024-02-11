export class ResponseEntity<T> {
  data: T;
  message?: string;

  constructor({ message, data }: { message?: string; data: T }) {
    this.message = message;
    this.data = data;
  }
}
