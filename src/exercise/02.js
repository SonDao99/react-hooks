// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react';

const useLocalStorageState = (key, initialState='') => {
  const [state, setState] = React.useState(
    () => {
      const storedItem = window.localStorage.getItem(key);
      if (storedItem) {
        return JSON.parse(storedItem);
      }
      return initialState;
    }
  )

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState];
}

function Greeting({initialName = ''}) {

  const [name, setName] = useLocalStorageState('name', initialName);

  function handleChange(event) {
    setName(event.target.value)
  }
  
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
