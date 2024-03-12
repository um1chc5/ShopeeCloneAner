// Replace your-framework with the name of your framework

import { Meta, StoryObj } from '@storybook/react'
import Input from './Input'

const meta: Meta<typeof Input> = {
  component: Input
}

export default meta
type Story = StoryObj<typeof Input>

export const Sample: Story = {
  args: {
    placeholder: 'Sample'
  }
}

export const EmailInput: Story = {
  args: {
    type: 'email',
    name: 'email',
    className: 'mt-8',
    placeholder: 'Email'
  }
}
