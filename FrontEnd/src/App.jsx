import './App.css'
import './styles/style.css'
import logoAfrijet from './assets/images/LogoAfrijet.jpg'

function App() {

  return (
    <>
      <div className='mt-40'>
        <div className='w-80 mx-auto'>
          <img src={logoAfrijet} alt='logo Afrijet' />
        </div>
        <h1 className='text-3xl font-bold flex justify-center'>Bienvenue sur la plateforme d'enquête client AFRIJET</h1>
        <h3 className='text-red-800 mt-10 text-2xl flex justify-center'>Projet en cours de developpement...</h3>
      </div>
    </>
  )
}

export default App
