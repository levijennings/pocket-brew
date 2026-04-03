/**
 * Tests for authentication functions
 */

import { signUp, signIn, signOut, getCurrentSession, getCurrentUser } from '../../lib/auth'
import { supabase } from '../../lib/supabase'
import { createMockSession } from '../../test/helpers'

jest.mock('../../lib/supabase')

describe('Auth Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('signUp', () => {
    it('should create a user account and profile', async () => {
      const mockSession = createMockSession()
      const mockProfileQuery = {
        insert: jest.fn().mockReturnThis(),
        then: jest.fn(async (onFulfilled) => {
          return onFulfilled({ data: null, error: null })
        }),
      }

      ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockSession.user, session: mockSession },
        error: null,
      })

      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
      })

      ;(supabase.from as jest.Mock).mockReturnValue(mockProfileQuery)

      const result = await signUp(
        'test@example.com',
        'TestPassword123!',
        'Test User'
      )

      expect(result).toEqual(mockSession)
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'TestPassword123!',
        options: {
          data: {
            display_name: 'Test User',
          },
        },
      })
      expect(supabase.from).toHaveBeenCalledWith('profiles')
    })

    it('should handle sign up errors', async () => {
      ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'User already exists' },
      })

      await expect(
        signUp('existing@example.com', 'TestPassword123!', 'Test User')
      ).rejects.toThrow('User already exists')
    })

    it('should continue even if profile creation fails', async () => {
      const mockSession = createMockSession()

      ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockSession.user, session: mockSession },
        error: null,
      })

      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
      })

      const mockProfileQuery = {
        insert: jest.fn().mockReturnThis(),
        then: jest.fn(async (onFulfilled) => {
          return onFulfilled({
            data: null,
            error: { message: 'Profile insert failed' },
          })
        }),
      }

      ;(supabase.from as jest.Mock).mockReturnValue(mockProfileQuery)

      const result = await signUp(
        'test@example.com',
        'TestPassword123!',
        'Test User'
      )

      expect(result).toEqual(mockSession)
    })
  })

  describe('signIn', () => {
    it('should authenticate user and return session', async () => {
      const mockSession = createMockSession()

      ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      })

      const result = await signIn('test@example.com', 'TestPassword123!')

      expect(result).toEqual(mockSession)
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'TestPassword123!',
      })
    })

    it('should handle invalid credentials', async () => {
      ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' },
      })

      await expect(
        signIn('test@example.com', 'WrongPassword')
      ).rejects.toThrow('Invalid login credentials')
    })

    it('should handle network errors', async () => {
      ;(supabase.auth.signInWithPassword as jest.Mock).mockRejectedValue(
        new Error('Network error')
      )

      await expect(
        signIn('test@example.com', 'TestPassword123!')
      ).rejects.toThrow('Network error')
    })
  })

  describe('signOut', () => {
    it('should sign out user', async () => {
      ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      })

      await signOut()

      expect(supabase.auth.signOut).toHaveBeenCalled()
    })

    it('should handle sign out errors', async () => {
      ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: { message: 'Sign out failed' },
      })

      await expect(signOut()).rejects.toThrow('Sign out failed')
    })
  })

  describe('getCurrentSession', () => {
    it('should return current user session', async () => {
      const mockSession = createMockSession()

      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      })

      const result = await getCurrentSession()

      expect(result).toEqual(mockSession)
      expect(supabase.auth.getSession).toHaveBeenCalled()
    })

    it('should return null if no session exists', async () => {
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: null,
      })

      const result = await getCurrentSession()

      expect(result).toBeNull()
    })

    it('should handle errors', async () => {
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Failed to get session' },
      })

      await expect(getCurrentSession()).rejects.toThrow(
        'Failed to get session'
      )
    })
  })

  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      const mockSession = createMockSession()

      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockSession.user },
        error: null,
      })

      const result = await getCurrentUser()

      expect(result).toEqual(mockSession.user)
      expect(supabase.auth.getUser).toHaveBeenCalled()
    })

    it('should return null if no user is logged in', async () => {
      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await getCurrentUser()

      expect(result).toBeNull()
    })

    it('should handle errors', async () => {
      ;(supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Failed to get user' },
      })

      await expect(getCurrentUser()).rejects.toThrow('Failed to get user')
    })
  })
})
