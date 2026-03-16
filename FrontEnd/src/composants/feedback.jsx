import { motion } from 'framer-motion'
import React, { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

const feedback = forwardRef((ref) => {
    const { t } = useTranslation();
    return (
        <motion.div
            className='popup flex justify-center align-center bg-black/50'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                ref={ref}
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
    )
})

export default feedback