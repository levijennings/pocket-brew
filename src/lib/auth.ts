import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { supabase } from './supabase'
import type { Session, User } from '@supabase/supabase-js'

/**
 * Auth Context Types
 */

export interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

/**
 * Create Auth Context
 */

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Auth Provider Component
 */

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Failed to get session:', error)
        } else {
          setSession(data.session)
          setUser(data.session?.user || null)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    /**
     * Subscribe to auth state changes
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user || null)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  /**
   * Sign In with Email and Password
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }, [])

  /**
   * Sign Up with Email, Password, and Display Name
   */
  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      })

      if (signUpError) {
        throw new Error(signUpError.message)
      }

      /**
       * Create user profile after sign up
       */
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session?.user?.id) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: sessionData.session.user.id,
          email,
          display_name: displayName,
          favorite_styles: [],
          beers_logged: 0,
        })

        if (profileError) {
          console.error('Failed to create profile:', profileError)
          // Don't throw here - auth succeeded, just profile creation failed
        }
      }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }, [])

  /**
   * Sign Out
   */
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw new Error(error.message)
      }

      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }, [])

  /**
   * Reset Password
   */
  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.EXPO_PUBLIC_APP_URL}/reset-password`,
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }, [])

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth Hook
 */

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

/**
 * Standalone Auth Functions (for use outside of React components)
 */

/**
 * Sign In with Email and Password
 */
export async function signIn(email: string, password: string): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data.session
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}

/**
 * Sign Up with Email, Password, and Display Name
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    /**
     * Create user profile after sign up
     */
    if (data.user?.id) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        display_name: displayName,
        favorite_styles: [],
        beers_logged: 0,
      })

      if (profileError) {
        console.error('Failed to create profile:', profileError)
      }
    }

    return data.session
  } catch (error) {
    console.error('Sign up error:', error)
    throw error
  }
}

/**
 * Sign Out
 */
export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

/**
 * Reset Password
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.EXPO_PUBLIC_APP_URL}/reset-password`,
    })

    if (error) {
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('Reset password error:', error)
    throw error
  }
}

/**
 * Get Current Session
 */
export async function getCurrentSession(): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      throw new Error(error.message)
    }

    return data.session
  } catch (error) {
    console.error('Get session error:', error)
    throw error
  }
}

/**
 * Get Current User
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      throw new Error(error.message)
    }

    return data.user
  } catch (error) {
    console.error('Get user error:', error)
    throw error
  }
}

/**
 * Update Password
 */
export async function updatePassword(newPassword: string): Promise<void> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('Update password error:', error)
    throw error
  }
}

/**
 * Update User Email
 */
export async function updateEmail(newEmail: string): Promise<void> {
  try {
    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    })

    if (error) {
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('Update email error:', error)
    throw error
  }
}

/**
 * Verify OTP (for email confirmation or phone verification)
 */
export async function verifyOtp(phone: string, token: string, type: 'sms' | 'email'): Promise<Session | null> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data.session
  } catch (error) {
    console.error('Verify OTP error:', error)
    throw error
  }
}
