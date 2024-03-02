import { useEffect } from 'react';
import './App.css';
import Homepage from './pages/Homepage';
import {Toaster, toast} from 'sonner';

function App() {

  useEffect( () => {
    document.title = "MatchQ App"
  }, []);

  return (
    <div className="App">
      <Toaster richColors/>
      <Homepage/>
    </div>
  );
}

export default App;
