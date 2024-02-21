import { useEffect } from 'react';
import './App.css';
import Homepage from './pages/Homepage';

function App() {

  useEffect( () => {
    document.title = "MatchQ App"
  }, []);

  return (
    <div className="App">
      <Homepage/>
    </div>
  );
}

export default App;
