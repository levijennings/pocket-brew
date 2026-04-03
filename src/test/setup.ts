// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(async () => true),
  getItem: jest.fn(async () => null),
  removeItem: jest.fn(async () => true),
  clear: jest.fn(async () => true),
  getAllKeys: jest.fn(async () => []),
  multiSet: jest.fn(async () => true),
  multiGet: jest.fn(async () => []),
  multiRemove: jest.fn(async () => true),
}))

// Mock Supabase
jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signIn: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      getUser: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      })),
      verifyOtp: jest.fn(),
    },
    from: jest.fn(),
    rpc: jest.fn(),
  },
}))

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Star: jest.fn(({ size, color, fill }) => null),
  Heart: jest.fn(() => null),
  MessageCircle: jest.fn(() => null),
  Settings: jest.fn(() => null),
  LogOut: jest.fn(() => null),
  Search: jest.fn(() => null),
  Plus: jest.fn(() => null),
  X: jest.fn(() => null),
  ChevronRight: jest.fn(() => null),
  ChevronLeft: jest.fn(() => null),
  Home: jest.fn(() => null),
  Compass: jest.fn(() => null),
  Trophy: jest.fn(() => null),
  User: jest.fn(() => null),
}))

// Suppress console errors and warnings in tests
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = jest.fn((...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return
    }
    originalError.call(console, ...args)
  })

  console.warn = jest.fn((...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Non-serializable values') ||
        args[0].includes('jest.useFakeTimers'))
    ) {
      return
    }
    originalWarn.call(console, ...args)
  })
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks()
})
