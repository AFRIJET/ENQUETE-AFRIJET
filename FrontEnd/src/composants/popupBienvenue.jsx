import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import logoAfrijet from '../assets/images/Logo-SF.png'
import '../styles/style.css'

const PopupBienvenue = () => {

    const [showPopup, setShowPopup] = useState(false);
    const { i18n } = useTranslation();

    useEffect(() => {
        // Vérifie si la popup a déjà été affichée
        const hasPopupBeenShown = sessionStorage.getItem('popupShown');

        if (!hasPopupBeenShown) {
            setShowPopup(true); // Affiche la popup si elle n'a pas encore été affichée
            sessionStorage.setItem('popupShown', 'true'); // Enregistre que la popup a été vue
        }
    }, []);

    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.value;
        console.log(i18n)
        i18n.changeLanguage(selectedLanguage); // Change la langue
        //Ferme la popupp immédiatement après la sélection de la langue
        if (showPopup) {
            setShowPopup(false)
        }
        
    };

    return (
        <>
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        className='popup flex justify-center align-center bg-black/50 h-screen p-10'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className='bg-white p-[20px] rounded-md h-60 text-center  mt-40'
                            initial={{ y: -30 }}
                            animate={{ y: 0 }}
                            exit={{ y: -30 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img src={logoAfrijet} alt='logo Afrijet' className='w-40 mx-auto' />
                            <h4 className='mt-5 text-lg'>Bienvenue dans la plateforme d'enquête client AFRIJET !</h4>
                            <select
                                className='mt-8'
                                onChange={handleLanguageChange}
                            >
                                <option disabled selected>Veuillez sélectionner votre langue</option>
                                <option value="fr">Français</option>
                                <option value="en">English</option>
                                <option value="es">Espagnol</option>
                            </select>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PopupBienvenue;