'use strict'

import React from 'react'
import { Card, Button, Icon } from 'semantic-ui-react'
import { DEMO_MODE } from '../../../demo/config'

const SpotifyLogin = () => {
  return (
    <Card style={{
      width: '425px',
      marginTop: '1rem',
      marginBottom: '1rem'
    }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '1.5rem',
          marginBottom: '1.5rem'
        }}
      >
        <Icon
          name='spotify'
          color='blue'
          size='huge'
        />
        {DEMO_MODE ? (
          <Button primary floated='right' disabled>
            <Button.Content>
              Spotify unavailable in demo
            </Button.Content>
          </Button>
        ) : (
          <a href="/auth/spotify">
            <Button primary floated='right'>
              <Button.Content>
                Connect to Spotify
              </Button.Content>
            </Button>
          </a>
        )}
      </div>
    </Card>
  )
}

export default SpotifyLogin
