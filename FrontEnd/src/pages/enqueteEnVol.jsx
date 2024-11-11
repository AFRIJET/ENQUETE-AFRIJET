import React from 'react'
import '../styles/style.css'
import Header from '../composants/header'
import Fildariane from '../composants/fildariane'
import logoAfrijet from '../assets/images/logo.png';
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const enqueteEnVol = () => {

    // Déclarations des sections
    const sections = [
        { label: "" },
        { label: "" },
        { label: "" }
    ]

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

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            style={{ willChange: 'auto' }}
            variants={variants}
        >
            <div>
                <Header image={logoAfrijet} type={t('enquete_envol')} />
                <Fildariane sections={sections} />
            </div>
        </motion.div>
    )
}

export default enqueteEnVol