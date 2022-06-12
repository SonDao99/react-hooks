// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonDataView, PokemonInfoFallback} from '../pokemon'
import { ErrorBoundary } from 'react-error-boundary';

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { error : null};
//   }

//   static getDerivedStateFromError(error) {
//     return { error };
//   }

//   render() {
//     const {error} = this.state;
//     if (error) {
//       return <this.props.FallbackComponent error={error} />;
//     }

//     return this.props.children;
//   }
// }

function ErrorFallback({error, resetErrorBoundary}) {
  return(
    <>
      <div role="alert">
        There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
      <button onClick={resetErrorBoundary}>Try again</button>
    </>
  )
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({status: 'idle'});

  React.useEffect(() => {
    if (!pokemonName) return;

    setState({status: 'pending'})
    fetchPokemon(pokemonName)
      .then(
        pokemon => {
          setState({status: 'resolved', pokemon});
        }
      )
      .catch(error => {
        setState({status: 'rejected', error});
        throw error;
      })

  }, [pokemonName])

  if (state.status === 'rejected') {
    throw state.error;
  } else if (state.status === 'idle') {
    return "Submit a pokemon";
  } else if (state.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />;
  } else {
    return <PokemonDataView pokemon={state.pokemon} />
  }
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
        <ErrorBoundary 
          FallbackComponent={ErrorFallback}
          onReset={() => {setPokemonName('')}}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
