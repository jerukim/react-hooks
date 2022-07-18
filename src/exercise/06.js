// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

const idle = 'idle'
const pending = 'pending'
const resolved = 'resolved'
const rejected = 'rejected'

function ErrorMessage({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

class ErrorBoundry extends React.Component {
  state = {error: null}

  static getDerivedStateFromError(error) {
    return {error}
  }

  render() {
    const {error} = this.state

    if (error) return <this.props.FallbackComponent error={error} />

    return this.props.children
  }
}

function PokemonInfo({pokemonName}) {
  const noPokemonName = pokemonName === ''
  const [state, setState] = React.useState({
    pokemon: null,
    error: null,
    status: idle,
  })

  React.useEffect(() => {
    if (noPokemonName) return

    setState({pokemon: null, status: pending})

    fetchPokemon(pokemonName)
      .then(pokemon => {
        setState({pokemon, status: resolved, error: null})
      })
      .catch(error => {
        setState({status: rejected, error})
      })
  }, [pokemonName, noPokemonName])

  const {pokemon, error, status} = state

  if (status === idle) return 'Submit a pokemon'
  else if (status === pending) return <PokemonInfoFallback name={pokemonName} />
  else if (status === rejected) throw error
  else if (status === resolved) return <PokemonDataView pokemon={pokemon} />

  throw new Error('Something went terribly wrong')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundry
          FallbackComponent={ErrorMessage}
          key={pokemonName}
          // resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundry>
      </div>
    </div>
  )
}

export default App
