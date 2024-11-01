import React from 'react'
import '../styles/style.css'
import logoAfrijet from '../assets/images/Logo-SF.png'
import PopupBienvenue from '../composants/popupBienvenue'
import { Link } from 'react-router-dom'
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
        >
            <PopupBienvenue />
            <div className=''>
                <div className=''>
                    <img src={logoAfrijet} alt='logo Afrijet' className='p-10 mx-auto logo-afrijet' />
                </div>
            </div>
            <section className='welcome-section'>
                <div className=''>
                    <h3 className='mt-10 p-3 text-center text-xl'>{t('select_enquete')}</h3>
                </div>
                <ul className='mt-8 ml-[15%] options'>
                    <li className='p-3 bg-brown-500 rounded-md w-4/5'>
                        <Link className='flex items-center w-full h-full' to='/enquete_agence'>
                            <i className="fa-solid fa-comments text-xl text-white"></i>
                            <span className='mx-3 text-xl text-white'>{t('enquete_agence')}</span>
                            <i className="fa-solid fa-arrow-right text-xl text-white ml-auto"></i>
                        </Link>
                    </li>
                    <li className='mt-4 p-3 bg-brown-500 rounded-md w-4/5'>
                        <Link className='flex items-center w-full h-full' to='/enquete_escale'>
                            <i className="fa-solid fa-user-check text-xl text-white"></i>
                            <span className='mx-3 text-xl text-white'>{t('enquete_escale')}</span>
                            <i className="fa-solid fa-arrow-right text-xl text-white ml-auto"></i>
                        </Link>
                    </li>
                    <li className='mt-4 p-3 bg-brown-500 rounded-md w-4/5'>
                        <Link className='flex items-center w-full h-full' to='/experiencesurvey'>
                            <i className="fa-solid fa-plane text-xl text-white"></i>
                            <span className='mx-3 text-xl text-white'>{t('enquete_envol')}</span>
                            <i className="fa-solid fa-arrow-right text-xl text-white ml-auto"></i>
                        </Link>
                    </li>
                    <li className='mt-4 p-3 bg-brown-500 rounded-md w-4/5'>
                        <Link className='flex items-center w-full h-full' to='/corporatesurvey'>
                            <i className="fa-solid fa-building text-xl text-white"></i>
                            <span className='mx-3 text-xl text-white'>{t('enquete_entreprise')}</span>
                            <i className="fa-solid fa-arrow-right text-xl text-white ml-auto"></i>
                        </Link>
                    </li>
                </ul>
            </section>

        </motion.div>
    )
}

export default bienvenue