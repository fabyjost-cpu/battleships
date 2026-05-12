import { adminDb } from '../firebase-admin';

jest.mock('../firebase-admin', () => ({
  adminDb: {
    ref: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      onDisconnect: jest.fn(() => ({
        remove: jest.fn(),
      })),
      on: jest.fn(),
      child: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        remove: jest.fn(),
      })),
    })),
  },
}));

jest.mock('../game/ships', () => ({
  createShips: jest.fn(() => ({
    ships: [
      { id: 'test-ship-1', type: 'Carrier', size: 5, x: 0, y: 0, horizontal: true, hits: [false, false, false, false, false] },
    ],
    board: [
      ['ship', 'ship', 'ship', 'ship', 'ship', 'water', 'water', 'water', 'water', 'water'],
      ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water'],
      ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water'],
      ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water'],
      ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water'],
      ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water'],
      ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water'],
      ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water'],
      ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water'],
      ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water'],
    ],
  })),
}));

describe('matchmaking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createGameRoom', () => {
    it('should create a game room with both players', async () => {
      const { createGameRoom } = await import('../matchmaking');

      const mockSet = jest.fn().mockResolvedValue(undefined);
      const mockPush = jest.fn(() => ({
        key: 'test-room-123',
        set: mockSet,
      }));

      const mockRef = jest.fn(() => ({
        set: mockSet,
      }));

      (adminDb.ref as jest.Mock).mockReturnValue({
        push: mockPush,
        ref: mockRef,
      });

      const roomId = await createGameRoom('playerA', 'playerB');

      expect(roomId).toBe('test-room-123');
      expect(mockPush).toHaveBeenCalledWith();
    });

    it('should set room status to setup', async () => {
      const { createGameRoom } = await import('../matchmaking');

      const mockSet = jest.fn().mockResolvedValue(undefined);
      const mockPush = jest.fn(() => ({
        key: 'test-room-123',
        set: mockSet,
      }));

      (adminDb.ref as jest.Mock).mockReturnValue({
        push: mockPush,
      });

      await createGameRoom('playerA', 'playerB');

      expect(mockSet).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'setup',
          phaseEndsAt: expect.any(Number),
          winner: null,
          players: expect.objectContaining({
            playerA: expect.objectContaining({ ready: false, bombPosition: null }),
            playerB: expect.objectContaining({ ready: false, bombPosition: null }),
          }),
        })
      );
    });

    it('should set phaseEndsAt to 30 seconds from now', async () => {
      const { createGameRoom } = await import('../matchmaking');

      const mockSet = jest.fn().mockResolvedValue(undefined);
      const beforeTime = Date.now();
      const mockPush = jest.fn(() => ({
        key: 'test-room-123',
        set: mockSet,
      }));

      (adminDb.ref as jest.Mock).mockReturnValue({
        push: mockPush,
      });

      await createGameRoom('playerA', 'playerB');

      const callArg = mockSet.mock.calls[0][0];
      expect(callArg.phaseEndsAt).toBeGreaterThanOrEqual(beforeTime + 30000);
      expect(callArg.phaseEndsAt).toBeLessThanOrEqual(Date.now() + 30000);
    });
  });

  describe('matchPlayers', () => {
    it('should return null when queue is empty', async () => {
      const { matchPlayers } = await import('../matchmaking');

      const mockGet = jest.fn().mockResolvedValue({
        exists: () => false,
      });

      (adminDb.ref as jest.Mock).mockReturnValue({
        get: mockGet,
      });

      const result = await matchPlayers();
      expect(result).toBeNull();
    });

    it('should return null when fewer than 2 players in queue', async () => {
      const { matchPlayers } = await import('../matchmaking');

      const mockGet = jest.fn().mockResolvedValue({
        exists: () => true,
        val: () => ({
          player1: { joinedAt: Date.now(), status: 'waiting' },
        }),
      });

      (adminDb.ref as jest.Mock).mockReturnValue({
        get: mockGet,
      });

      const result = await matchPlayers();
      expect(result).toBeNull();
    });

    it('should pair two players and create room when queue has 2+ players', async () => {
      const { matchPlayers } = await import('../matchmaking');

      const queueData = {
        player1: { joinedAt: 1000, status: 'waiting' },
        player2: { joinedAt: 2000, status: 'waiting' },
      };

      const mockGet = jest.fn()
        .mockResolvedValueOnce({
          exists: () => true,
          val: () => queueData,
        })
        .mockResolvedValueOnce({ exists: () => false });

      const mockRemove = jest.fn().mockResolvedValue(undefined);
      const mockSet = jest.fn().mockResolvedValue(undefined);
      const mockPush = jest.fn(() => ({
        key: 'new-room-123',
        set: mockSet,
      }));

      (adminDb.ref as jest.Mock).mockImplementation((path: string) => {
        if (path === 'matchmaking/queue') {
          return {
            get: mockGet,
            child: jest.fn(() => ({
              remove: mockRemove,
            })),
          };
        }
        if (path === 'games') {
          return {
            push: mockPush,
          };
        }
        return { get: mockGet };
      });

      const result = await matchPlayers();

      expect(result).toBe('new-room-123');
      expect(mockRemove).toHaveBeenCalledTimes(2);
    });
  });
});

describe('QueueEntry type', () => {
  it('should have correct structure', () => {
    const entry = {
      joinedAt: Date.now(),
      status: 'waiting' as const,
    };

    expect(entry.joinedAt).toBeDefined();
    expect(entry.status).toBe('waiting');
  });
});
