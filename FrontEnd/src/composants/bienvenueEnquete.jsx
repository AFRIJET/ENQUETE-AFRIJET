import React from 'react'
import '../styles/style.css'
import logoAfrijet from '../assets/images/Logo-SF.png'
import logoFlygabon from '../assets/images/Logo-FG2.png'
import PopupBienvenue from './popupBienvenue'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next';

const bienvenueEnquete = ({ link }) => {
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
                    <img src={logoAfrijet} alt='logo Afrijet' className='pt-10 mx-auto w-80 h-20' />
                </div>
                <div className=''>
                    <img src={logoFlygabon} alt='logo Afrijet' className='mt-3 pb-8 mx-auto w-80 h-[100px]' />
                </div>
            </div>
            <section className='welcome-section'>
                <div className=''>
                    <p className='mt-3 p-5 text-justify text-sm'>{t('offre')}</p>
                    <p className='mt-2 text-center'><strong>{t('pourquoi_repondre')} ?</strong></p>
                    <ol className='text-center mt-2'>
                        <li>1. {t('opinion')}</li>
                        <li>2. {t('aide_service')}</li>
                        <li>3. {t('evolution_offre')}</li>
                    </ol>
                </div>
                <ul className='mt-8 ml-[15%] options'>
                    <li className='p-3 bg-brown-500 rounded-md w-4/5'>
                        <Link className='flex items-center w-full h-full' to={link}>
                            <span className='mx-3 text-xl text-white'>{t('start_enquete')}</span>
                            <i className="fa-solid fa-arrow-right text-xl text-white ml-auto"></i>
                        </Link>
                    </li>
                </ul>
            </section>
        </motion.div>
    )
}

export default bienvenueEnquete