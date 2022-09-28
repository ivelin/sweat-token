import * as React from 'react'
import { MockConnector } from 'wagmi/connectors/mock'

import {
  Providers,
  UserEvent,
  act,
  addressRegex,
  getSigners,
  render,
  screen,
  setupClient,
  userEvent,
  waitFor
} from '../../test'
import { Connect } from './Connect'

describe('<Connect />', () => {
  let user: UserEvent
  beforeEach(() => {
    user = userEvent.setup()
  })

  it('connects and disconnects wallet', async () => {
    render(<Connect />)

    // Connect to wallet
    const connectButton = screen.getByRole('button', { name: 'Mock' })
    act(() => {
      user.click(connectButton)
    })
    await waitFor(() => expect(screen.getByText(addressRegex)).toBeInTheDocument())

    // Disconnect
    const disconnectButton = screen.getByRole('button')
    expect(disconnectButton).toHaveTextContent(/disconnect/i)
    user.click(disconnectButton)
    expect(screen.getByRole('button')).toHaveTextContent('Mock')
  })

  it('fails to connect', async () => {
    const client = setupClient({
      connectors: [
        new MockConnector({
          options: {
            signer: getSigners()[0]!,
            // Turn on `failConnect` flag to simulate connect failure
            flags: { failConnect: true }
          }
        })
      ]
    })

    render(<Connect />, {
      wrapper: ({ children }: { children: React.ReactNode }) => <Providers client={client}>{children}</Providers>
    })

    // Try to connect and check for error message
    const connectButton = screen.getByRole('button', { name: 'Mock' })
    act(() => {
      user.click(connectButton)
    })
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    expect(screen.getByRole('alert')).toHaveTextContent(/user rejected request/i)
  })
})
