import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion';
import logoAfrijet from '../assets/images/Logo-SF.png'
import '../styles/style.css'

const PopupBienvenue = () => {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        // Vérifie si la popup a déjà été affichée
        const hasPopupBeenShown = sessionStorage.getItem('popupShown');

        if (!hasPopupBeenShown) {
            setShowPopup(true); // Affiche la popup si elle n'a pas encore été affichée

            // Ferme la popup après 500 ms (0,5 seconde)
            const timer = setTimeout(() => {
                setShowPopup(false);
                sessionStorage.setItem('popupShown', 'true'); // Enregistre que la popup a été vue
            }, 2000);

            return () => clearTimeout(timer); // Nettoyage du timer lors du démontage
        }
    }, []);

    return (
        <>
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        className='popup h-screen'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className='popup-content'
                            initial={{ y: -30 }}
                            animate={{ y: 0 }}
                            exit={{ y: -30 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img src={logoAfrijet} alt='logo Afrijet' className='w-40 mx-auto' />
                            <h4 className=''>Bienvenue dans la plateforme d'enquête client AFRIJET !</h4>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PopupBienvenue;