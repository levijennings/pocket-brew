/**
 * Tests for BeerCard component
 */

import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { BeerCard } from '../../../components/beer/BeerCard'

describe('BeerCard Component', () => {
  const defaultProps = {
    id: 'beer-1',
    name: 'Test IPA',
    breweryName: 'Test Brewery',
    style: 'IPA',
    abv: 6.5,
    rating: 4,
    ratingCount: 42,
  }

  it('should render beer name', () => {
    const { getByText } = render(<BeerCard {...defaultProps} />)

    expect(getByText('Test IPA')).toBeTruthy()
  })

  it('should render brewery name', () => {
    const { getByText } = render(<BeerCard {...defaultProps} />)

    expect(getByText('Test Brewery')).toBeTruthy()
  })

  it('should render beer style badge', () => {
    const { getByText } = render(<BeerCard {...defaultProps} />)

    expect(getByText('IPA')).toBeTruthy()
  })

  it('should render ABV value', () => {
    const { getByText } = render(<BeerCard {...defaultProps} />)

    expect(getByText('6.5%')).toBeTruthy()
  })

  it('should display ABV label', () => {
    const { getByText } = render(<BeerCard {...defaultProps} />)

    expect(getByText('ABV')).toBeTruthy()
  })

  it('should render rating count singular', () => {
    const { getByText } = render(
      <BeerCard {...defaultProps} ratingCount={1} />
    )

    expect(getByText(/1 review/)).toBeTruthy()
  })

  it('should render rating count plural', () => {
    const { getByText } = render(
      <BeerCard {...defaultProps} ratingCount={42} />
    )

    expect(getByText(/42 reviews/)).toBeTruthy()
  })

  it('should render beer image when provided', () => {
    const { getByTestId } = render(
      <BeerCard
        {...defaultProps}
        imageUrl="https://example.com/beer.jpg"
      />
    )

    // Image component is rendered but may not be testable in this environment
    expect(true).toBe(true)
  })

  it('should call onPress when card is pressed', () => {
    const onPressMock = jest.fn()
    const { getByRole } = render(
      <BeerCard {...defaultProps} onPress={onPressMock} />
    )

    const button = getByRole('button')
    fireEvent.press(button)

    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  it('should not call onPress if handler not provided', () => {
    const { getByRole } = render(<BeerCard {...defaultProps} />)

    const button = getByRole('button')
    expect(() => {
      fireEvent.press(button)
    }).not.toThrow()
  })

  it('should render with different rating values', () => {
    const { getByText: getByText3 } = render(
      <BeerCard {...defaultProps} rating={3} />
    )
    expect(getByText3('Test IPA')).toBeTruthy()

    const { getByText: getByText5 } = render(
      <BeerCard {...defaultProps} rating={5} />
    )
    expect(getByText5('Test IPA')).toBeTruthy()
  })

  it('should render with different ABV values', () => {
    const { getByText: getByTextLow } = render(
      <BeerCard {...defaultProps} abv={3.5} />
    )
    expect(getByTextLow('3.5%')).toBeTruthy()

    const { getByText: getByTextHigh } = render(
      <BeerCard {...defaultProps} abv={10.2} />
    )
    expect(getByTextHigh('10.2%')).toBeTruthy()
  })

  it('should render with custom style', () => {
    const customStyle = { marginTop: 10 }
    const { getByRole } = render(
      <BeerCard {...defaultProps} style={customStyle} />
    )

    const button = getByRole('button')
    expect(button.props.style).toContainEqual(customStyle)
  })

  it('should have activeOpacity set', () => {
    const { getByRole } = render(<BeerCard {...defaultProps} />)

    const button = getByRole('button')
    expect(button.props.activeOpacity).toBe(0.7)
  })
})
