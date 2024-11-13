import React, { useEffect, useRef, useState } from 'react'
import '../styles/style.css'
import Header from '../composants/header'
import Fildariane from '../composants/fildariane'
import logoAfrijet from '../assets/images/logo.png';
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'


const enqueteCorporate = () => {
    const { t } = useTranslation()
    // Déclarations des sections
    const sections = [
        { label: t('experience_collaboration') },
        { label: "" },
        { label: "" }
    ]
    const [isPopVisible, setIsPopVisible] = useState(false)
    const [errors, setErrors] = useState({})
    const [selectedCheckbox, setSelectedCheckbox] = useState(false)
    const popupRef = useRef(null)
    const date = new Date().toISOString
    const [data, setData] = useState({
        date: date,
        anciennete: '',
        experience_globale: '',
        localisation: '',
        service: '',
        communication: '',
        note_service_client: '',
        note_ponctualite: '',
        note_confort: '',
        note_reservation: '',
        note_prix: '',
        suggestion: '',
        ajout_service: '',
        recommandation: '',
        raison_recommandation: ''
    })
    const fieldRefs = {
        anciennete: useRef(null),
        experience_globale: useRef(null),
        localisation: useRef(null),
        service: useRef(null),
        communication: useRef(null),
        note_service_client: useRef(null),
        note_ponctualite: useRef(null),
        note_confort: useRef(null),
        note_reservation: useRef(null),
        note_prix: useRef(null),
        suggestion: useRef(null),
        ajout_service: useRef(null),
        recommandation: useRef(null),
        raison_recommandation: useRef(null),
    }
    const [CheckedItems, setCheckedItems] = useState({
        transport_passagers: false,
        transport_fret: false,
        com_oui: false,
        com_non: false,
    })

    const handleChange = (e) => {
        const { name, checked } = e.target
        setCheckedItems({
            ...CheckedItems,
            [name]: checked
        })
    }

    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        if(selectedCheckbox === value) {
            setSelectedCheckbox(null)
        } else {
            setSelectedCheckbox(value)
        }
    }

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

    const generateId = (label) => {
        return label.toLowerCase()
    }

    const closePopUp = () => {
        setIsPopVisible(false)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closePopUp()
            }
        }

        if (isPopVisible) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
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
                <Header image={logoAfrijet} type={t('enquete_entreprise')} />
                <Fildariane sections={sections} />
            </div>
            <form>
                <section id={generateId(t('experience_collaboration'))}>
                    <div className='space'>
                        <br />
                    </div>
                    <div className='info-generales-info mx-auto w-[360px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('experience_collaboration')}</h2>
                    </div>
                    <div className="mt-4 mx-5 border-b border-gray-900/10 pb-5">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">{t('annee_colloboration')}</legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-2 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.anciennete}
                                            id="moins_1_an"
                                            value="moins de 1 an"
                                            name="moins_1_an"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, anciennete: e.target.value })}
                                            checked={selectedCheckbox === "moins_1_an"}
                                            onClick={handleCheckboxChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="moins de 1 ans" className="font-medium text-gray-900">
                                            {t('moins_1_an')}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-x-3 mx-4 p-2 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.anciennete}
                                            id="1_a_3_ans"
                                            value="1 à 3 ans"
                                            name="1_a_3_ans"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, anciennete: e.target.value })}
                                            checked={selectedCheckbox === "1_a_3_ans"}
                                            onClick={handleCheckboxChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="1_a_3_ans" className="font-medium text-gray-900">
                                            {t('entre_1_3_ans')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-2 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.anciennete}
                                            id="plus_3_ans"
                                            value="plus 3 ans"
                                            name="plus_3_ans"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, anciennete: e.target.value })}
                                            checked={selectedCheckbox === "plus_3_ans"}
                                            onClick={handleCheckboxChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="plus 3 ans" className="font-medium text-gray-900">
                                            {t('plus_3_ans')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        {errors.anciennete && <p className="text-red-500 text-sm mt-1">{errors.anciennete}</p>}
                    </div>
                </section>
            </form>
        </motion.div>
    )
}

export default enqueteCorporate