import React from 'react'
import '../styles/style.css'
import logoAfrijet from '../assets/images/Logo-SF.png'
import logoFlygabon from '../assets/images/Logo-FG2.png'
import { Link, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next';

const bienvenue = () => {

    const { t } = useTranslation();

    // Définition des variantes d'animation pour l'apparition
    const variants = {
        hidden: { opacity: 0, x: -100 }, // L'élément est caché en haut
        visible: {
            opacity: 1,
            x: 0, // L'élément descend à sa position d'origine
            transition: {
                duration: 0.2,
                ease: 'easeIn',
            },
        },
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            className='h-screen'
        >
            <div className=''>
                <div className=''>
                    <img src={logoAfrijet} alt='logo Afrijet' className='m-10 mx-auto w-80 h-10' />
                </div>
            </div>
            <section className='welcome-section'>
                <div className=''>
                    <h3 className='mt-20 p-3 text-center text-xl'>Plateforme d'enquête client AFRIJET</h3>
                </div>
                <ul className='mt-8 ml-[15%] options'>
                    <li className='p-3 bg-brown-500 rounded-md w-4/5'>
                        <Link className='flex items-center w-full h-full' to="/enquete_agence">
                            <span className='mx-3 text-xl text-white'>Enquête en Agence</span>
                            <i className="fa-solid fa-arrow-right text-xl text-white ml-auto"></i>
                        </Link>
                    </li>
                    <li className='mt-3 p-3 bg-brown-500 rounded-md w-4/5'>
                        <Link className='flex items-center w-full h-full' to="/enquete_satisfaction">
                            <span className='mx-3 text-xl text-white'>Enquête de Satisfaction</span>
                            <i className="fa-solid fa-arrow-right text-xl text-white ml-auto"></i>
                        </Link>
                    </li>
                    <li className='mt-3 p-3 bg-brown-500 rounded-md w-4/5'>
                        <Link className='flex items-center w-full h-full' to="/enquete_corporate">
                            <span className='mx-3 text-xl text-white'>Enquête Entreprise</span>
                            <i className="fa-solid fa-arrow-right text-xl text-white ml-auto"></i>
                        </Link>
                    </li>
                    <li className='mt-3 p-3 bg-brown-500 rounded-md w-4/5'>
                        <Link className='flex items-center w-full h-full' to="/login">
                            <span className='mx-3 text-xl text-white'>Administrateur</span>
                            <i className="fa-solid fa-arrow-right text-xl text-white ml-auto"></i>
                        </Link>
                    </li>
                </ul>
            </section>
            <div className=''>
                <div className=''>
                    <img src={logoFlygabon} alt='logo Afrijet' className='m-20 mx-auto w-80 h-20' />
                </div>
            </div>
        </motion.div>
    )
}

export default bienvenue