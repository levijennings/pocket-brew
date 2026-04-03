/**
 * Tests for Button component
 */

import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Button } from '../../../components/ui/Button'

describe('Button Component', () => {
  it('should render with correct title', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={jest.fn()} />
    )

    expect(getByText('Click Me')).toBeTruthy()
  })

  it('should render with primary variant by default', () => {
    const { getByText } = render(
      <Button title="Primary" onPress={jest.fn()} />
    )

    const button = getByText('Primary')
    expect(button).toBeTruthy()
  })

  it('should render with secondary variant', () => {
    const { getByText } = render(
      <Button title="Secondary" onPress={jest.fn()} variant="secondary" />
    )

    const button = getByText('Secondary')
    expect(button).toBeTruthy()
  })

  it('should render with ghost variant', () => {
    const { getByText } = render(
      <Button title="Ghost" onPress={jest.fn()} variant="ghost" />
    )

    const button = getByText('Ghost')
    expect(button).toBeTruthy()
  })

  it('should render with correct size', () => {
    const { getByText: getByTextSm } = render(
      <Button title="Small" onPress={jest.fn()} size="sm" />
    )
    expect(getByTextSm('Small')).toBeTruthy()

    const { getByText: getByTextMd } = render(
      <Button title="Medium" onPress={jest.fn()} size="md" />
    )
    expect(getByTextMd('Medium')).toBeTruthy()

    const { getByText: getByTextLg } = render(
      <Button title="Large" onPress={jest.fn()} size="lg" />
    )
    expect(getByTextLg('Large')).toBeTruthy()
  })

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn()
    const { getByRole } = render(
      <Button title="Press Me" onPress={onPressMock} />
    )

    const button = getByRole('button')
    fireEvent.press(button)

    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn()
    const { getByRole } = render(
      <Button title="Disabled" onPress={onPressMock} disabled={true} />
    )

    const button = getByRole('button')
    fireEvent.press(button)

    expect(onPressMock).not.toHaveBeenCalled()
  })

  it('should render as disabled when disabled prop is true', () => {
    const { getByRole } = render(
      <Button title="Disabled Button" onPress={jest.fn()} disabled={true} />
    )

    const button = getByRole('button')
    expect(button.props.disabled).toBe(true)
  })

  it('should render with custom style', () => {
    const customStyle = { marginTop: 10 }
    const { getByRole } = render(
      <Button
        title="Styled"
        onPress={jest.fn()}
        style={customStyle}
      />
    )

    const button = getByRole('button')
    expect(button.props.style).toContainEqual(customStyle)
  })

  it('should apply activeOpacity', () => {
    const { getByRole } = render(
      <Button title="Opaque" onPress={jest.fn()} />
    )

    const button = getByRole('button')
    expect(button.props.activeOpacity).toBe(0.8)
  })
})
