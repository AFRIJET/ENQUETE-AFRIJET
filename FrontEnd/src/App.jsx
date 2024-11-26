import './App.css'
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Loader from './composants/loader'
import Animation from './composants/animation';
import Bienvenue from './pages/bienvenue';
import BienvenueAgence from './composants/bienvenueAgence';
import BienvenueCorporate from './composants/bienvenueCorporate';
import BienvenueSatisfaction from './composants/bienvenueSatisfaction'
import EnqueteAgence from './pages/enqueteAgence'
import EnqueteSatisfaction from './pages/enqueteSatisfaction';
import EnqueteCorporate from './pages/enqueteCorporate';
import Login from './pages/login';
import Dashboard from './pages/dashboard'

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
              <Route path='/enquete_agence' element={<BienvenueAgence />}></Route>
              <Route path='/enquete_agence/enquete' element={<EnqueteAgence />}></Route>
              <Route path='/enquete_satisfaction' element={<BienvenueSatisfaction />}></Route>
              <Route path='/enquete_satisfaction/enquete' element={<EnqueteSatisfaction />}></Route>
              <Route path='/enquete_corporate' element={<BienvenueCorporate />}></Route>
              <Route path='/enquete_corporate/enquete' element={<EnqueteCorporate />}></Route>
              <Route path='/admin' element={<Login />}></Route>
              <Route path='/admin/dashboard' element={<Dashboard />}></Route>
            </Routes>
          </BrowserRouter>
        </Animation>
      )}
    </>
  )
}

export default App
