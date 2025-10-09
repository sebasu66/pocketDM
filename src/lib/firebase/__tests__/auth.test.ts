import { findOrCreateUser, createUser, getUserById } from '../auth';
import { createNewCampaignForUser } from '../campaigns';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { User as FirebaseAuthUser } from 'firebase/auth';

// Mock the dependencies
jest.mock('../campaigns');
jest.mock('firebase/firestore');
jest.mock('../config', () => ({
  db: {},
  auth: {},
}));

describe('findOrCreateUser', () => {
  const mockFirebaseUser: FirebaseAuthUser = {
    uid: 'test-uid-123',
    email: 'test@example.com',
    displayName: 'Test User',
  } as FirebaseAuthUser;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Existing User Scenarios', () => {
    it('should return existing user if found', async () => {
      const existingUser = {
        id: 'test-uid-123',
        name: 'Existing User',
        email: 'test@example.com',
        role: { isGm: true, isPlayer: false },
        campaignId: 'existing-campaign',
        enabled: true,
        avatar: '/ui/avatar/avatar.jpg',
      };

      // Mock getUserById to return existing user
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => true,
        id: existingUser.id,
        data: () => existingUser,
      });

      const result = await findOrCreateUser(mockFirebaseUser, {
        name: 'New Name',
        role: { isGm: false, isPlayer: true },
      });

      expect(result).toEqual(existingUser);
      expect(setDoc).not.toHaveBeenCalled();
    });
  });

  describe('New User Creation - Validation', () => {
    beforeEach(() => {
      // Mock getUserById to return undefined (no existing user)
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });
    });

    it('should throw error if name is not provided', async () => {
      await expect(
        findOrCreateUser(mockFirebaseUser, {
          role: { isGm: true, isPlayer: false },
        })
      ).rejects.toThrow('Name must be explicitly provided during user creation');
    });

    it('should throw error if role is not provided', async () => {
      await expect(
        findOrCreateUser(mockFirebaseUser, {
          name: 'Test User',
        })
      ).rejects.toThrow('Role must be explicitly provided during user creation');
    });

    it('should throw error if both name and role are missing', async () => {
      await expect(
        findOrCreateUser(mockFirebaseUser, {})
      ).rejects.toThrow('Role must be explicitly provided during user creation');
    });
  });

  describe('New GM User Creation', () => {
    beforeEach(() => {
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });
      (createNewCampaignForUser as jest.Mock).mockResolvedValue('new-gm-campaign-id');
      (setDoc as jest.Mock).mockResolvedValue(undefined);
    });

    it('should create new GM user with new campaign', async () => {
      const result = await findOrCreateUser(mockFirebaseUser, {
        name: 'New GM',
        role: { isGm: true, isPlayer: false },
      });

      expect(createNewCampaignForUser).toHaveBeenCalledWith(
        { id: 'test-uid-123', name: 'New GM' },
        'en'
      );

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          id: 'test-uid-123',
          name: 'New GM',
          email: 'test@example.com',
          role: { isGm: true, isPlayer: false },
          campaignId: 'new-gm-campaign-id',
          enabled: true,
          avatar: '/ui/avatar/avatar.jpg',
        })
      );

      expect(result).toMatchObject({
        id: 'test-uid-123',
        name: 'New GM',
        email: 'test@example.com',
        role: { isGm: true, isPlayer: false },
        campaignId: 'new-gm-campaign-id',
      });
    });

    it('should use email from Firebase Auth user', async () => {
      const userWithEmail = {
        ...mockFirebaseUser,
        email: 'gm@example.com',
      } as FirebaseAuthUser;

      await findOrCreateUser(userWithEmail, {
        name: 'GM User',
        role: { isGm: true, isPlayer: false },
      });

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          email: 'gm@example.com',
        })
      );
    });
  });

  describe('New Player User Creation', () => {
    beforeEach(() => {
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });
      (setDoc as jest.Mock).mockResolvedValue(undefined);
    });

    it('should create player user and join existing campaign with valid secret code', async () => {
      // Mock campaign lookup by secret code
      (getDocs as jest.Mock).mockResolvedValue({
        empty: false,
        docs: [
          {
            id: 'existing-campaign-id',
            data: () => ({
              secretCode: 'VALID123',
              enabled: true,
            }),
          },
        ],
      });

      const result = await findOrCreateUser(mockFirebaseUser, {
        name: 'New Player',
        role: { isGm: false, isPlayer: true },
        campaignSecret: 'VALID123',
      });

      expect(query).toHaveBeenCalled();
      expect(where).toHaveBeenCalledWith('secretCode', '==', 'VALID123');
      expect(where).toHaveBeenCalledWith('enabled', '==', true);

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          id: 'test-uid-123',
          name: 'New Player',
          email: 'test@example.com',
          role: { isGm: false, isPlayer: true },
          campaignId: 'existing-campaign-id',
          enabled: true,
        })
      );

      expect(result).toMatchObject({
        id: 'test-uid-123',
        name: 'New Player',
        email: 'test@example.com',
        role: { isGm: false, isPlayer: true },
        campaignId: 'existing-campaign-id',
      });
    });

    it('should throw error if campaign secret code is invalid', async () => {
      // Mock campaign lookup returning empty
      (getDocs as jest.Mock).mockResolvedValue({
        empty: true,
        docs: [],
      });

      await expect(
        findOrCreateUser(mockFirebaseUser, {
          name: 'New Player',
          role: { isGm: false, isPlayer: true },
          campaignSecret: 'INVALID',
        })
      ).rejects.toThrow('Invalid or expired secret code. Could not find an active campaign.');
    });

    it('should throw error if player has no campaign secret', async () => {
      await expect(
        findOrCreateUser(mockFirebaseUser, {
          name: 'New Player',
          role: { isGm: false, isPlayer: true },
        })
      ).rejects.toThrow('A secret code is required to join a campaign as a player.');
    });

    it('should not create new campaign for player', async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        empty: false,
        docs: [{ id: 'campaign-123', data: () => ({}) }],
      });

      await findOrCreateUser(mockFirebaseUser, {
        name: 'Player',
        role: { isGm: false, isPlayer: true },
        campaignSecret: 'CODE123',
      });

      expect(createNewCampaignForUser).not.toHaveBeenCalled();
    });
  });

  describe('Email Handling', () => {
    beforeEach(() => {
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });
      (createNewCampaignForUser as jest.Mock).mockResolvedValue('campaign-id');
      (setDoc as jest.Mock).mockResolvedValue(undefined);
    });

    it('should use Firebase Auth email and convert to lowercase', async () => {
      const userWithMixedCaseEmail = {
        ...mockFirebaseUser,
        email: 'User@Example.COM',
      } as FirebaseAuthUser;

      await findOrCreateUser(userWithMixedCaseEmail, {
        name: 'Test',
        role: { isGm: true, isPlayer: false },
      });

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          email: 'user@example.com',
        })
      );
    });

    it('should handle users without email by generating anonymous email', async () => {
      const userWithoutEmail = {
        ...mockFirebaseUser,
        email: null,
      } as FirebaseAuthUser;

      await findOrCreateUser(userWithoutEmail, {
        name: 'Anonymous User',
        role: { isGm: true, isPlayer: false },
      });

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          email: 'anonymous-test-uid-123@demo.local',
        })
      );
    });
  });

  describe('Role Validation', () => {
    beforeEach(() => {
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });
    });

    it('should respect explicitly provided isGm: false, isPlayer: true', async () => {
      (getDocs as jest.Mock).mockResolvedValue({
        empty: false,
        docs: [{ id: 'campaign-id', data: () => ({}) }],
      });

      await findOrCreateUser(mockFirebaseUser, {
        name: 'Player',
        role: { isGm: false, isPlayer: true },
        campaignSecret: 'CODE',
      });

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          role: { isGm: false, isPlayer: true },
        })
      );
    });

    it('should respect explicitly provided isGm: true, isPlayer: false', async () => {
      (createNewCampaignForUser as jest.Mock).mockResolvedValue('gm-campaign');

      await findOrCreateUser(mockFirebaseUser, {
        name: 'GM',
        role: { isGm: true, isPlayer: false },
      });

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          role: { isGm: true, isPlayer: false },
        })
      );
    });

    it('should not infer role from campaignSecret presence', async () => {
      // Even with campaignSecret, role should be what's explicitly provided
      (createNewCampaignForUser as jest.Mock).mockResolvedValue('campaign-id');

      await findOrCreateUser(mockFirebaseUser, {
        name: 'User',
        role: { isGm: true, isPlayer: false },
        campaignSecret: 'IGNORED',
      });

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          role: { isGm: true, isPlayer: false },
        })
      );
    });
  });

  describe('Name Handling', () => {
    beforeEach(() => {
      (getDoc as jest.Mock).mockResolvedValue({
        exists: () => false,
      });
      (createNewCampaignForUser as jest.Mock).mockResolvedValue('campaign-id');
      (setDoc as jest.Mock).mockResolvedValue(undefined);
    });

    it('should use explicitly provided name', async () => {
      await findOrCreateUser(mockFirebaseUser, {
        name: 'Chosen Username',
        role: { isGm: true, isPlayer: false },
      });

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          name: 'Chosen Username',
        })
      );
    });

    it('should not use Firebase displayName as fallback', async () => {
      const userWithDisplayName = {
        ...mockFirebaseUser,
        displayName: 'Firebase Display Name',
      } as FirebaseAuthUser;

      await expect(
        findOrCreateUser(userWithDisplayName, {
          role: { isGm: true, isPlayer: false },
          // name intentionally not provided
        })
      ).rejects.toThrow('Name must be explicitly provided during user creation');
    });

    it('should not use default name as fallback', async () => {
      await expect(
        findOrCreateUser(mockFirebaseUser, {
          role: { isGm: true, isPlayer: false },
          // name intentionally not provided
        })
      ).rejects.toThrow('Name must be explicitly provided during user creation');
    });
  });
});
