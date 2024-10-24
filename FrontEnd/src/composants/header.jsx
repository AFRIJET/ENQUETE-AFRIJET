import React from 'react';
import '../styles/style.css';

// Composant pour le header 
const Header = ({ image, type }) => {
    return (
        <div className='header'>
            <div className='w-full h-full bg-red-500/15'>
                <div className='content relative text-center z-10'>
                    <div className='float-left w-1/2 p-[30px_2px]'>
                        <img src={image} alt='logo Afrijet' />
                    </div>
                    <div className='customer_survey float-right w-1/2'>
                        <h1 className='text-white'>{type}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;