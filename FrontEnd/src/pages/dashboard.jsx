import React from 'react'
import logoAfrijet from '../assets/images/Logo-SF.png'

const dashboard = () => {
  return (
    <div className='bg-gray-300 h-screen'>
      <img
        alt="Logo Afrijet"
        src={logoAfrijet}
        className="mx-auto h-40 pt-10 w-auto"
      />
      <h1 className='text-xl text-center mt-40 text-brown-500'>Bienvenue dans le Dashboard en cours de developpement...</h1>
    </div>
  )
}

export default dashboard