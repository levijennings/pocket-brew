/**
 * Mock Supabase client with chainable query builder
 * Used for testing database operations
 */

export class MockQueryBuilder {
  private _filters: Array<{ type: string; key: string; value: any }> = []
  private _select: string = '*'
  private _orderBy: { column: string; ascending: boolean } | null = null
  private _limitValue: number | null = null
  private _rangeValue: { start: number; end: number } | null = null
  private _data: any[] = []
  private _error: any = null
  private _single: boolean = false

  constructor(data: any[] = []) {
    this._data = data
  }

  select(columns: string) {
    this._select = columns
    return this
  }

  eq(key: string, value: any) {
    this._filters.push({ type: 'eq', key, value })
    return this
  }

  in(key: string, values: any[]) {
    this._filters.push({ type: 'in', key, value: values })
    return this
  }

  gte(key: string, value: any) {
    this._filters.push({ type: 'gte', key, value })
    return this
  }

  lte(key: string, value: any) {
    this._filters.push({ type: 'lte', key, value })
    return this
  }

  or(condition: string) {
    this._filters.push({ type: 'or', key: 'condition', value: condition })
    return this
  }

  order(column: string, options?: { ascending?: boolean }) {
    this._orderBy = {
      column,
      ascending: options?.ascending !== false,
    }
    return this
  }

  limit(value: number) {
    this._limitValue = value
    return this
  }

  range(start: number, end: number) {
    this._rangeValue = { start, end }
    return this
  }

  single() {
    this._single = true
    return this
  }

  insert(data: any) {
    this._data = Array.isArray(data) ? data : [data]
    return this
  }

  update(data: any) {
    this._data = [data]
    return this
  }

  delete() {
    this._data = []
    return this
  }

  async then(onFulfilled: any, onRejected: any) {
    try {
      const result = this._applyFilters()
      const response = {
        data: this._single ? result[0] || null : result,
        error: this._error,
      }
      return Promise.resolve(response).then(onFulfilled, onRejected)
    } catch (error) {
      return Promise.reject(error).then(onFulfilled, onRejected)
    }
  }

  private _applyFilters() {
    let result = [...this._data]

    // Apply filters
    for (const filter of this._filters) {
      result = result.filter((item) => {
        if (filter.type === 'eq') {
          return item[filter.key] === filter.value
        }
        if (filter.type === 'in') {
          return filter.value.includes(item[filter.key])
        }
        if (filter.type === 'gte') {
          return item[filter.key] >= filter.value
        }
        if (filter.type === 'lte') {
          return item[filter.key] <= filter.value
        }
        return true
      })
    }

    // Apply ordering
    if (this._orderBy) {
      result.sort((a, b) => {
        const aVal = a[this._orderBy!.column]
        const bVal = b[this._orderBy!.column]
        const order = this._orderBy!.ascending ? 1 : -1
        return aVal > bVal ? order : aVal < bVal ? -order : 0
      })
    }

    // Apply limit
    if (this._limitValue !== null) {
      result = result.slice(0, this._limitValue)
    }

    // Apply range
    if (this._rangeValue) {
      result = result.slice(this._rangeValue.start, this._rangeValue.end + 1)
    }

    return result
  }
}

export function createMockSupabaseClient(initialData: any = {}) {
  return {
    from: jest.fn((table: string) => {
      return new MockQueryBuilder(initialData[table] || [])
    }),
    rpc: jest.fn(async () => ({ data: [], error: null })),
    auth: {
      signUp: jest.fn(async () => ({ data: null, error: null })),
      signIn: jest.fn(async () => ({ data: null, error: null })),
      signInWithPassword: jest.fn(async () => ({ data: null, error: null })),
      signOut: jest.fn(async () => ({ data: null, error: null })),
      getSession: jest.fn(async () => ({ data: { session: null } })),
      getUser: jest.fn(async () => ({ data: { user: null } })),
      resetPasswordForEmail: jest.fn(async () => ({ data: null, error: null })),
      updateUser: jest.fn(async () => ({ data: null, error: null })),
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      })),
      verifyOtp: jest.fn(async () => ({ data: null, error: null })),
    },
  }
}
