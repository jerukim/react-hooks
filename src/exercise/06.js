// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const noPokemonName = pokemonName === ''
  const [pokemon, setPokemon] = React.useState(null)

  React.useEffect(() => {
    if (noPokemonName) return

    setPokemon(null)
    fetchPokemon(pokemonName).then(setPokemon)
  }, [pokemonName, noPokemonName])

  if (noPokemonName) return 'Submit a pokemon'

  if (!noPokemonName && !pokemon)
    return <PokemonInfoFallback name={pokemonName} />

  if (pokemon) return <PokemonDataView pokemon={pokemon} />
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
