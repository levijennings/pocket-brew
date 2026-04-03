/**
 * Tests for FlavorTag component
 */

import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { FlavorTag } from '../../../components/beer/FlavorTag'

describe('FlavorTag Component', () => {
  it('should render tag label', () => {
    const { getByText } = render(
      <FlavorTag label="Citrus" onPress={jest.fn()} />
    )

    expect(getByText('Citrus')).toBeTruthy()
  })

  it('should render unselected state by default', () => {
    const { getByRole } = render(
      <FlavorTag label="Hoppy" onPress={jest.fn()} />
    )

    const button = getByRole('button')
    expect(button.props.disabled).not.toBe(true)
  })

  it('should render selected state when selected prop is true', () => {
    const { container } = render(
      <FlavorTag label="Pine" selected={true} onPress={jest.fn()} />
    )

    expect(container).toBeTruthy()
  })

  it('should call onPress when tag is pressed', () => {
    const onPressMock = jest.fn()
    const { getByRole } = render(
      <FlavorTag label="Malty" onPress={onPressMock} />
    )

    const button = getByRole('button')
    fireEvent.press(button)

    expect(onPressMock).toHaveBeenCalledTimes(1)
  })

  it('should toggle selection on press', () => {
    const onPressMock = jest.fn()
    let isSelected = false

    const { getByRole, rerender } = render(
      <FlavorTag
        label="Bitter"
        selected={isSelected}
        onPress={() => {
          isSelected = !isSelected
          onPressMock()
        }}
      />
    )

    let button = getByRole('button')
    fireEvent.press(button)

    expect(onPressMock).toHaveBeenCalledTimes(1)

    isSelected = !isSelected
    rerender(
      <FlavorTag
        label="Bitter"
        selected={isSelected}
        onPress={() => {
          isSelected = !isSelected
          onPressMock()
        }}
      />
    )

    button = getByRole('button')
    fireEvent.press(button)

    expect(onPressMock).toHaveBeenCalledTimes(2)
  })

  it('should display different labels', () => {
    const labels = ['Fruity', 'Spicy', 'Floral', 'Earthy']

    labels.forEach((label) => {
      const { getByText } = render(
        <FlavorTag label={label} onPress={jest.fn()} />
      )

      expect(getByText(label)).toBeTruthy()
    })
  })

  it('should apply custom style', () => {
    const customStyle = { marginTop: 10 }
    const { getByRole } = render(
      <FlavorTag label="Styled" onPress={jest.fn()} style={customStyle} />
    )

    const button = getByRole('button')
    expect(button.props.style).toContainEqual(customStyle)
  })

  it('should have activeOpacity set', () => {
    const { getByRole } = render(
      <FlavorTag label="Opacity" onPress={jest.fn()} />
    )

    const button = getByRole('button')
    expect(button.props.activeOpacity).toBe(0.7)
  })

  it('should handle multiple selected tags', () => {
    const onPressMock1 = jest.fn()
    const onPressMock2 = jest.fn()

    const { getByText: getByText1 } = render(
      <FlavorTag label="Hoppy" selected={true} onPress={onPressMock1} />
    )
    expect(getByText1('Hoppy')).toBeTruthy()

    const { getByText: getByText2 } = render(
      <FlavorTag label="Citrus" selected={true} onPress={onPressMock2} />
    )
    expect(getByText2('Citrus')).toBeTruthy()
  })

  it('should render without onPress handler', () => {
    const { getByText } = render(<FlavorTag label="Static" />)

    expect(getByText('Static')).toBeTruthy()
  })

  it('should display selected styling when selected', () => {
    const { container: containerSelected } = render(
      <FlavorTag label="Selected" selected={true} onPress={jest.fn()} />
    )

    expect(containerSelected).toBeTruthy()

    const { container: containerUnselected } = render(
      <FlavorTag label="Unselected" selected={false} onPress={jest.fn()} />
    )

    expect(containerUnselected).toBeTruthy()
  })
})
