import './App.css'
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Loader from './composants/loader'
import Animation from './composants/animation'
import Bienvenue from './composants/bienvenueAgence';
import EnqueteAgence from './pages/enqueteAgence'
import EnqueteEscale from './pages/enqueteEscale';
import EnqueteEnvol from './pages/enqueteEnVol';
import EnqueteCorporate from './pages/enqueteCorporate';

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
              <Route path='/enquete_agence' element={<Bienvenue />}></Route>
              <Route path='/enquete_agence/enquete' element={<EnqueteAgence />}></Route>
              <Route path='/enquete_escale' element={<EnqueteEscale />}></Route>
              <Route path='/enquete_envol' element={<EnqueteEnvol />}></Route>
              <Route path='/enquete_corporate' element={<EnqueteCorporate />}></Route>
            </Routes>
          </BrowserRouter>
        </Animation>
      )}
    </>
  )
}

export default App
