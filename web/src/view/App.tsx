import { ApolloProvider, useQuery } from '@apollo/client'
import { Redirect, Router } from '@reach/router'
import * as React from 'react'
import { hydrate, render } from 'react-dom'
import { Provider as StyletronProvider } from 'styletron-react'
import { appContext } from '../../../common/src/context'
import { getApolloClient } from '../graphql/apolloClient'
import { FetchUserContext } from '../graphql/query.gen'
import { style } from '../style/styled'
import { fetchUser } from './auth/fetchUser'
import { UserContext, UserCtx } from './auth/user'
import { Route } from './nav/route'
import { HomePage } from './page/HomePage'
import { LecturesPage } from './page/LecturesPage'
import { MapPage } from './page/MapPage'
import { PlaygroundPage } from './page/PlaygroundPage'
import { ProjectsPage } from './page/ProjectsPage'

const Styletron = require('styletron-engine-monolithic')

export function init() {
  const renderFn = appContext().serverRendered ? hydrate : render
  const engine = new Styletron.Client({
    hydrate: document.getElementsByClassName('_styletron_hydrate_'),
  })

  renderFn(
    <ApolloProvider client={getApolloClient()}>
      <StyletronProvider value={engine}>
        <App />
      </StyletronProvider>
    </ApolloProvider>,
    document.getElementById('app')
  )
}

export function App() {
  const { loading, data } = useQuery<FetchUserContext>(fetchUser)
  if (loading || data == null) {
    return null
  }

  return (
    <UserContext.Provider value={new UserCtx(data.self)}>
      <AppBody />
    </UserContext.Provider>
  )
}

export function AppBody() {
  return (
    <>
      <Router className={bodyClass}>
        <Redirect noThrow from="app" to="map" />
        <Redirect noThrow from="app/playground" to="surveys" />
        <MapPage path={Route.MAP} />
        <HomePage path={Route.HOME} />
        <LecturesPage path={Route.LECTURES} />
        <ProjectsPage path={Route.PROJECTS} />
        <PlaygroundPage path={Route.PLAYGROUND} />
        <PlaygroundPage path={Route.PLAYGROUND_APP} />
      </Router>
      <Footer>
        <FooterText>&copy; 2020 Wanderlust</FooterText>
      </Footer>
    </>
  )
}

const bodyClass = 'flex flex-column items-center mh2 mh3-ns mh5-l pt5 min-vh-100 avenir'

const Footer = style('footer', 'fixed flex items-center bottom-0 w-100')

const FooterText = style('small', 'mid-gray avenir', { margin: 'auto', opacity: '0.2' })
