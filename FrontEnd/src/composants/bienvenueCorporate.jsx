import React from 'react'
import '../styles/style.css'
import logoAfrijet from '../assets/images/Logo-SF.png'
import logoFlygabon from '../assets/images/Logo-FG2.png'
import PopupBienvenue from './popupBienvenue'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next';

const bienvenueCorporate = () => {

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
            <PopupBienvenue />
            <div className=''>
                <div className=''>
                    <img src={logoAfrijet} alt='logo Afrijet' className='p-10 mx-auto logo-afrijet' />
                </div>
            </div>
            <section className='welcome-section'>
                <div className=''>
                    <h3 className='mt-10 p-3 text-center text-xl'>{t('choix_afrijet')}</h3>
                    <p className='p-3 text-center text-sm'>{t('appel_enquete')}</p>
                </div>
                <ul className='mt-8 ml-[15%] options'>
                    <li className='p-3 bg-brown-500 rounded-md w-4/5'>
                        <Link className='flex items-center w-full h-full' to="/enquete_corporate/enquete">
                            <span className='mx-3 text-xl text-white'>{t('start_enquete')}</span>
                            <i className="fa-solid fa-arrow-right text-xl text-white ml-auto"></i>
                        </Link>
                    </li>
                </ul>
            </section>
            <div className=''>
                <div className=''>
                    <img src={logoFlygabon} alt='logo Afrijet' className='fixed bottom-20 mx-auto logo-flygabon' />
                </div>
            </div>
        </motion.div>
    )
}

export default bienvenueCorporate