import { NextResponse } from 'next/server';

export class ApiError {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly code?: string
  ) {}

  toResponse(): NextResponse {
    const body = this.code
      ? { error: { message: this.message, code: this.code } }
      : { error: { message: this.message } };

    return NextResponse.json(body, { status: this.status });
  }
}
