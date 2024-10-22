import React from 'react';
import '../styles/style.css';

// Composant pour le header 
const Header = ({ image, type }) => {
    return (
        <div className='header'>
            <div className='overlay'>
                <div className='content'>
                    <div className='logo'>
                        <img src={image} alt='logo Afrijet' />
                    </div>
                    <div className='customer_survey'>
                        <h1 className=''>{type}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;