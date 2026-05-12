import { ApiError } from '../api-error';

describe('ApiError', () => {
  describe('toResponse', () => {
    it('should return NextResponse with correct status and message', async () => {
      const error = new ApiError(400, 'Bad request');
      const response = error.toResponse();

      expect(response.status).toBe(400);

      const body = await response.json();
      expect(body).toEqual({ error: { message: 'Bad request' } });
    });

    it('should include error code when provided', async () => {
      const error = new ApiError(404, 'Not found', 'RESOURCE_NOT_FOUND');
      const response = error.toResponse();

      expect(response.status).toBe(404);

      const body = await response.json();
      expect(body).toEqual({
        error: { message: 'Not found', code: 'RESOURCE_NOT_FOUND' },
      });
    });

    it('should support common HTTP status codes', async () => {
      const statuses = [400, 401, 403, 404, 500] as const;

      for (const status of statuses) {
        const error = new ApiError(status, 'Test error');
        const response = error.toResponse();
        expect(response.status).toBe(status);
      }
    });
  });
});
