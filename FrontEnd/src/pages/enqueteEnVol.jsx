import React, { useEffect, useRef, useState } from 'react'
import '../styles/style.css'
import Header from '../composants/header'
import Fildariane from '../composants/fildariane'
import logoAfrijet from '../assets/images/logo.png';
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next';
import country from '../composants/country.json';
import destination from '../composants/destination.json';

const enqueteEnVol = () => {

    const { t } = useTranslation()
    // Déclarations des sections
    const sections = [
        { label: t('infos_generales') },
        { label: "" },
        { label: "" }
    ]
    const [isPopVisible, setIsPopVisible] = useState(false)
    const [errors, setErrors] = useState({})
    const popupRef = useRef(null)
    const date = new Date().toISOString
    const [data, setData] = useState({
        date: date,
        sexe: '',
        num_billet: '',
        nationalite: '',
        depart: '',
        destination: '',
        experience_vol: '',
        horaire_vol: '',
        confort_siege: '',
        proprete: '',
        note_serviceUM: '',
        note_animal_cabine: '',
        note_animal_soute: '',
        qualite_repas: '',
        divertissement: '',
        courtoisie: '',
        recommandation: '',
        raison_recommandation: ''
    })
    const fieldRefs = {
        sexe: useRef(null),
        num_billet: useRef(null),
        nationalite: useRef(null),
        depart: useRef(null),
        destination: useRef(null),
        experience_vol: useRef(null),
        horaire_vol: useRef(null),
        confort_siege: useRef(null),
        proprete: useRef(null),
        qualite_repas: useRef(null),
        divertissement: useRef(null),
        courtoisie: useRef(null),
        recommandation: useRef(null),
        raison_recommandation: useRef(null)
    }
    const [CheckedItems, setCheckedItems] = useState({
        homme: false,
        femme: false,
        horaire_oui: false,
        horaire_non: false,
        confortable: false,
        inconfortable: false,
        satisfaisante: false,
        insatisfaisante: false,
        divertissement_oui: false,
        divertissement_non: false,
    })

    const handleChange = (event) => {
        const { name, checked } = event.target
        setCheckedItems({
            ...CheckedItems,
            [name]: checked
        })
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
        return label.toLowerCase();
    }

    const closePopUp = () => {
        setIsPopVisible(false)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef && !popupRef.current.contains(event.target)) {
                closePopUp()
            }
        };

        if (isPopVisible) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.addEventListener('mousedown', handleClickOutside)
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
                <Header image={logoAfrijet} type={t('enquete_envol')} />
                <Fildariane sections={sections} />
            </div>
            <form>
                <section id={generateId(t('infos_generales'))}>
                    <div className='space'>
                        <br />
                    </div>
                    <div className='info-generales-info mx-auto w-[360px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('infos_generales')}</h2>
                    </div>
                    <div className="mt-4 mx-5 border-b border-gray-900/10 pb-5">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">{t('sexe')}</legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-2 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <motion.input
                                            ref={fieldRefs.sexe}
                                            checked={CheckedItems.homme}
                                            onClick={handleChange}
                                            onChange={(e) => setData({ ...data, sexe: e.target.value })}
                                            disabled={CheckedItems.femme}
                                            id="homme"
                                            value="homme"
                                            name="homme"
                                            type="checkbox"
                                            className={errors.sexe ? "border border-red-500" : "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-red-600"}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="homme" className="font-medium text-gray-900">
                                            {t('homme')}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-x-3 mx-4 p-2 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.sexe}
                                            checked={CheckedItems.femme}
                                            onClick={handleChange}
                                            onChange={(e) => setData({ ...data, sexe: e.target.value })}
                                            disabled={CheckedItems.homme}
                                            id="femme"
                                            value="femme"
                                            name="femme"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-red-600"
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="femme" className="font-medium text-gray-900">
                                            {t('femme')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {errors.sexe && <p className="text-red-500 text-sm mt-1">{errors.sexe}</p>}
                        </fieldset>
                    </div>
                    <div className="mt-4 mx-4 border-b border-gray-900/10 pb-5">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">{t('numero_billet')}</legend>
                            <div class="mt-2">
                                <input
                                    ref={fieldRefs.num_billet}
                                    id="num_billet"
                                    name="num_billet"
                                    rows="3"
                                    placeholder='EX : PNR 269C54DA'
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-red-300 focus:ring-1 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6 bg-gray-200"
                                    onChange={(e) => setData({ ...data, num_billet: e.target.value })}
                                >
                                </input>
                            </div>
                        </fieldset>
                    </div>
                    <div className="mx-5 mt-5 sm:col-span-3 border-b border-gray-900/10 pb-5">
                        <label htmlFor="country" className="text-sm font-semibold leading-6 text-gray-900">
                            {t('nationalite')}
                        </label>
                        <div className="w-full mt-2">
                            <select
                                ref={fieldRefs.nationalite}
                                id="nationalite"
                                name="nationalite"
                                className="p-2 w-full bg-gray-200 block rounded-md font-medium border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xl sm:text-sm sm:leading-6"
                                onChange={(e) => setData({ ...data, nationalite: e.target.value })}
                            >
                                <option selected disabled>{t('selection_pays')}</option>
                                {
                                    country.map((item) => (
                                        <option key={item.country}>{item.country}</option>
                                    ))
                                }

                            </select>
                            {errors.nationalite && <p className="text-red-500 text-sm mt-1">{errors.nationalite}</p>}
                        </div>
                    </div>
                    <div className="mx-5 mt-5 sm:col-span-3 border-b border-gray-900/10 pb-5">
                        <label htmlFor="country" className="text-sm font-semibold leading-6 text-gray-900">
                            {t('ville_depart')}
                        </label>
                        <div className="w-full mt-2">
                            <select
                                ref={fieldRefs.depart}
                                id="depart"
                                name="depart"
                                className="p-2 w-full bg-gray-200 block rounded-md font-medium border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xl sm:text-sm sm:leading-6"
                                onChange={(e) => setData({ ...data, depart: e.target.value })}
                            >
                                <option selected disabled>{t('selection_depart')}</option>
                                {
                                    destination.map((item) => (
                                        <option key={item.destination}>{item.destination}</option>
                                    ))
                                }

                            </select>
                            {errors.depart && <p className="text-red-500 text-sm mt-1">{errors.depart}</p>}
                        </div>
                    </div>
                    <div className="mx-5 mt-5 sm:col-span-3 border-b border-gray-900/10 pb-5">
                        <label htmlFor="destination" className="text-sm font-semibold leading-6 text-gray-900">
                            {t('destination_envol')}
                        </label>
                        <div className="w-full mt-2">
                            <select
                                ref={fieldRefs.destination}
                                id="destination"
                                name="destination"
                                className="p-2 bg-gray-200 block w-full rounded-md font-medium border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xl sm:text-sm sm:leading-6"
                                onChange={(e) => setData({ ...data, destination: e.target.value })}
                            >
                                <option selected disabled>{t('selection_destination')}</option>
                                {
                                    destination.map((item) => (
                                        <option key={item.destination}>{item.destination}</option>
                                    ))
                                }
                            </select>
                            {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
                        </div>
                    </div>
                </section>
            </form>
        </motion.div>
    )
}

export default enqueteEnVol