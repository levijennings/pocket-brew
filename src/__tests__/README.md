# Pocket Brew Test Suite

This directory contains the complete test suite for the Pocket Brew React Native Expo application.

## Structure

```
__tests__/
├── lib/
│   ├── validations.test.ts    # Zod schema validation tests
│   ├── api.test.ts            # API layer function tests
│   └── auth.test.ts           # Authentication function tests
└── components/
    ├── ui/
    │   ├── Button.test.tsx     # Button component tests
    │   └── StarRating.test.tsx # StarRating component tests
    └── beer/
        ├── BeerCard.test.tsx   # BeerCard component tests
        └── FlavorTag.test.tsx  # FlavorTag component tests
```

## Test Coverage

### Library Tests

#### Validations (src/__tests__/lib/validations.test.ts)
- Zod schema validation for all input types
- TastingNote validation (rating, scores, impressions)
- Collection validation (name, description)
- Profile update validation
- Beer search parameters
- Sign up/Sign in schemas
- 100% coverage of validation logic

#### API Layer (src/__tests__/lib/api.test.ts)
- Beer retrieval and filtering
- Search with multiple filters
- Tasting note creation and validation
- User statistics calculation
- Collection management
- Wishlist operations
- Error handling and edge cases

#### Authentication (src/__tests__/lib/auth.test.ts)
- User sign up with profile creation
- User sign in with credentials
- Sign out functionality
- Session management
- Password reset
- User retrieval
- Error scenarios

### Component Tests

#### UI Components

**Button Component**
- Renders with correct title
- Supports primary, secondary, ghost variants
- Supports sm, md, lg sizes
- onPress callback fires correctly
- Disabled state prevents interaction
- Custom styling applies

**StarRating Component**
- Renders all 5 stars
- Displays correct rating
- Interactive mode allows rating selection
- Custom size support
- Hover/press state changes
- Decimal ratings handled

#### Beer Components

**BeerCard Component**
- Renders beer name, brewery, style
- Displays ABV percentage
- Shows rating with correct count text (singular/plural)
- Image rendering when provided
- onPress navigation callback
- Custom styling and opacity effects

**FlavorTag Component**
- Renders tag label
- Toggle selection on/off
- Shows correct label for different flavors
- Selected state styling
- Press handler callback
- Custom styling support
- Multiple selections

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- validations.test.ts
npm test -- Button.test.tsx
```

### Run tests matching pattern
```bash
npm test -- --testNamePattern="Button"
npm test -- --testNamePattern="API"
```

## Coverage Requirements

The project enforces 80% coverage threshold for:
- Branches
- Functions
- Lines
- Statements

View coverage report after running tests:
```bash
npm run test:coverage
# Open coverage/lcov-report/index.html
```

## Test Utilities

### Mock Data Factories (src/test/helpers.ts)

Factory functions for creating consistent test data:

```typescript
import {
  createMockBeer,
  createMockBrewery,
  createMockTastingNote,
  createMockCollection,
  createMockProfile,
  createMockSession,
} from '../test/helpers'

// Create a mock beer with defaults
const beer = createMockBeer()

// Override specific fields
const customBeer = createMockBeer({
  name: 'Custom IPA',
  abv: 7.5,
  avg_rating: 4.8,
})
```

Available factories:
- `createMockBeer()` - Beer with rating, ABV, style
- `createMockBrewery()` - Brewery with location, website
- `createMockTastingNote()` - Tasting note with scores and impressions
- `createMockCollection()` - Beer collection with beer IDs
- `createMockProfile()` - User profile with preferences
- `createMockSession()` - Authenticated session object

### Test Setup (src/test/setup.ts)

Automatically configured:
- AsyncStorage mocking
- Supabase client mocking
- lucide-react-native icon mocking
- Test environment initialization
- Mock cleanup after each test

### Mock Supabase (src/test/mocks/supabase.ts)

Provides chainable query builder mock:

```typescript
import { createMockSupabaseClient } from '../test/mocks/supabase'

const supabase = createMockSupabaseClient({
  beers: [mockBeer1, mockBeer2],
  profiles: [mockProfile1],
})

// Supports all Supabase operations
const { data, error } = await supabase
  .from('beers')
  .select('*')
  .eq('style', 'IPA')
  .order('avg_rating', { ascending: false })
  .limit(10)
```

## Writing New Tests

### Test Template

```typescript
import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { YourComponent } from '../path/to/YourComponent'

describe('YourComponent', () => {
  it('should do something', () => {
    const { getByText } = render(<YourComponent />)

    expect(getByText('Expected Text')).toBeTruthy()
  })

  it('should handle user interaction', () => {
    const onPressMock = jest.fn()
    const { getByRole } = render(
      <YourComponent onPress={onPressMock} />
    )

    const button = getByRole('button')
    fireEvent.press(button)

    expect(onPressMock).toHaveBeenCalled()
  })
})
```

### Best Practices

1. **Descriptive test names**: Use `it('should do X when Y happens')`
2. **Arrange-Act-Assert**: Separate setup, action, and assertions
3. **Mock external dependencies**: Use Jest mocks for API, storage
4. **Test behavior, not implementation**: Focus on what users see
5. **Isolate tests**: Each test should be independent
6. **Use test utilities**: Leverage factory functions for consistent data
7. **Test edge cases**: Empty states, errors, boundary values

## CI/CD Integration

GitHub Actions workflow (`.github/workflows/ci.yml`):

- Runs on push to main/develop and PRs
- Node.js 20.x environment
- Steps:
  1. Install dependencies
  2. Run linter
  3. Type check with TypeScript
  4. Run unit tests with coverage
  5. Upload coverage to Codecov
  6. Validate Expo compatibility

Minimum passing criteria:
- All tests pass
- 80% code coverage
- No TypeScript errors
- Clean linting

## Troubleshooting

### Tests timing out

Increase Jest timeout:
```typescript
jest.setTimeout(10000)
```

### Module not found errors

Check module path aliases in `jest.config.js` match `tsconfig.json`

### Mock not working

Ensure mocks are defined before imports:
```typescript
jest.mock('../../lib/supabase')

import { supabase } from '../../lib/supabase'
```

### Snapshot mismatches

Update snapshots if changes are intentional:
```bash
npm test -- -u
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)
- [Jest Expo Configuration](https://docs.expo.dev/guides/testing-with-jest/)
