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

function Error({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
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

  if (status === pending) return <PokemonInfoFallback name={pokemonName} />

  if (status === resolved) return <PokemonDataView pokemon={pokemon} />

  if (status === rejected) return <Error error={error} />
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
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
