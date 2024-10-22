import './App.css'
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Loader from './composants/loader'
import Animation from './composants/animation'
import Bienvenue from './pages/bienvenue';
import EnqueteAgence from './pages/enqueteAgence'
import EnqueteEscale from './pages/enqueteEscale';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un délai de chargement (ex : chargement de données)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 3 secondes
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Animation>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Bienvenue />}></Route>
              <Route path='/enquete_agence' element={<EnqueteAgence />}></Route>
              <Route path='/enquete_escale' element={<EnqueteEscale />}></Route>
            </Routes>
          </BrowserRouter>
        </Animation>
      )}
    </>
  )
}

export default App
