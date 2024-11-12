import React, { useEffect, useRef, useState } from 'react'
import '../styles/style.css'
import Header from '../composants/header'
import Fildariane from '../composants/fildariane'
import logoAfrijet from '../assets/images/logo.png';
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next'

const enqueteEscale = () => {

  // Déclarations des sections
  const sections = [
    { label: "" },
    { label: "" },
    { label: "" }
  ]
  const [isPopVisible, setIsPopVisible] = useState(false)
  const popupRef = useRef(null)
  const { t } = useTranslation()

  // Définition des variantes d'animation pour l'apparition
  const variants = {
    hidden: { opacity: 0, x: -100 }, // L'élément est caché en haut
    visible: {
      opacity: 1,
      x: 0, // L'élément descend à sa position d'origine
      transition: {
        duration: 0.5,
        ease: 'easeIn',
      },
    },
  }

  //Fonction pour fermer la popup
  const closePopup = () => {
    setIsPopVisible(false);
  }

  //Fonction qui permet de fermer la popup lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closePopup()
      }
    };

    if(isPopVisible) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isPopVisible])

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      style={{ willChange: 'auto' }}
      variants={variants}
    >
      <div>
        <Header image={logoAfrijet} type={t('enquete_escale')} />
        <Fildariane sections={sections} />
      </div>
      <form>
        <div className=''>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgb(165,42,42)', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}
            whileTap={{ scale: 0.95, backgroundColor: 'rgb(165,42,42)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="btn-valider text-lg mx-auto my-[15px] flex items-center bg-brown-500 text-white py-2 px-4 rounded hover:bg-brown-600"
            type='submit'
          >
            {t('valider')}
            <i className="fa-solid fa-check mx-2"></i>
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {isPopVisible && (
          <motion.div
            className='popup flex justify-center align-center bg-black/50'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={popupRef}
              className='bg-white p-[20px] rounded-md h-20 text-center mt-60'
              initial={{ y: -30 }}
              animate={{ y: 0 }}
              exit={{ y: -30 }}
              transition={{ duration: 0.3 }}
            >
              <i className="fa-solid fa-circle-check text-brown-500 text-lg"></i>
              <h4 className='mt-1'>{t('feedback')}</h4>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default enqueteEscale