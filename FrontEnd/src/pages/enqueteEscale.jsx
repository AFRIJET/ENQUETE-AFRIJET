import React from 'react'
import Header from '../composants/header'
import LogoAfrijet from '../assets/images/LogoAfrijet.jpg'

const enqueteEscale = () => {
  return (
    <div className='fixed'>
      <Header image={LogoAfrijet} type="Enquete Escale" />
      <div>Test</div>
      <div class="absolute pt-2 mr-2 inset-y-0 right-0 block items-center px-2 pointer-events-none">
        <svg class="w-3 h-3 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"></path>
        </svg>
        <svg class="w-3 h-3 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  )
}

export default enqueteEscale