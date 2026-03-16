import { motion } from 'framer-motion'
import React from 'react'
import { useTranslation } from 'react-i18next'

const btnValider = () => {
    const {t} = useTranslation();
    return (
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
    )
}

export default btnValider