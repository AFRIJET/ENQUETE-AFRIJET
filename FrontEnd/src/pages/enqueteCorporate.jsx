import React, { useEffect, useRef, useState } from 'react'
import '../styles/style.css'
import Fildariane from '../composants/fildariane'
import logoAfrijet from '../assets/images/logo.png';
import imageEntreprise from '../assets/images/Afrijet-entreprise.jpg'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next'
import country from '../composants/country.json'

const apiUrl = import.meta.env.VITE_API_URL;

const enqueteCorporate = () => {
    const { t } = useTranslation()
    // Déclarations des sections
    const sections = [
        { label: t('experience_collaboration') },
        { label: t('satisfaction_services') },
        { label: t('suggestions') }
    ]
    const [isPopVisible, setIsPopVisible] = useState(false)
    const [errors, setErrors] = useState({})
    const [selectedCheckbox, setSelectedCheckbox] = useState(null)
    const popupRef = useRef(null)
    const date = new Date().toISOString
    const [data, setData] = useState({
        date: date,
        anciennete: '',
        localisation: '',
        service: '',
        communication: '',
        experience_globale: '',
        note_service_client: '',
        note_ponctualite: '',
        note_confort: '',
        note_reservation: '',
        note_prix: '',
        ajout_service: '',
        recommandation: '',
        raison_recommandation: ''
    })
    const fieldRefs = {
        anciennete: useRef(null),
        localisation: useRef(null),
        service: useRef(null),
        communication: useRef(null),
        experience_globale: useRef(null),
        note_service_client: useRef(null),
        note_ponctualite: useRef(null),
        note_confort: useRef(null),
        note_reservation: useRef(null),
        note_prix: useRef(null),
        ajout_service: useRef(null),
        recommandation: useRef(null),
        raison_recommandation: useRef(null),
    }
    const [CheckedItems, setCheckedItems] = useState({
        transport_passagers: false,
        transport_fret: false,
        com_oui: false,
        com_non: false,
        ajout_oui: false,
        ajout_non: false,
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
        if (selectedCheckbox === value) {
            setSelectedCheckbox(null); // Si on clique sur la checkbox déjà cochée, elle se désactive
        } else {
            setSelectedCheckbox(value); // Sélectionne une nouvelle checkbox
        }
    };

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
        setIsPopVisible(false);
        setData({})
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
    }, [isPopVisible]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        Object.keys(data).forEach((key) => {
        if (!data[key]) {
                newErrors[key] = 'Ce champ est requis'
            }
        })
        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            const firstErrorField = Object.keys(newErrors)[0];
            fieldRefs[firstErrorField].current.scrollIntoView({ behavior: 'smooth' });
        } else {
            axios.post(`${apiUrl}/enquete_entreprise`, data, {
                headers: { 'Content-Type': 'Application/json' }
            })
                .then(response => {
                    setIsPopVisible(true);
                    setErrors({});
                    setData({});
                })
                .catch(err => console.log("Erreur lors de la sauvegarde des données: ", err))
        }
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            style={{ willChange: 'auto' }}
            variants={variants}
        >
            <div>
                <div className='header'
                    style={{
                        background: `url(${imageEntreprise}) no-repeat center`,
                        backgroundSize: 'cover'
                    }}
                >
                    <div className='w-full h-full bg-red-500/15'>
                        <div className='content relative text-center z-10'>
                            <div className='float-left w-1/2 p-[30px_2px]'>
                                <img src={logoAfrijet} alt='logo Afrijet' />
                            </div>
                            <div className='customer_survey float-right w-1/2'>
                                <h1 className='text-white'>{t('enquete_entreprise')}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <Fildariane sections={sections} />
            </div>
            <form onSubmit={handleSubmit}>
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
                                            checked={selectedCheckbox === "moins de 1 an"}
                                            onClick={handleCheckboxChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="moins_1_an" className="font-medium text-gray-900">
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
                                            checked={selectedCheckbox === "1 à 3 ans"}
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
                                            checked={selectedCheckbox === "plus 3 ans"}
                                            onClick={handleCheckboxChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="plus_3_ans" className="font-medium text-gray-900">
                                            {t('plus_3_ans')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        {errors.anciennete && <p className="text-red-500 text-sm mt-1">{errors.anciennete}</p>}
                    </div>
                    <div className="mx-5 mt-5 sm:col-span-3 border-b border-gray-900/10 pb-5">
                        <label htmlFor="country" className="text-sm font-semibold leading-6 text-gray-900">
                            {t('localisation')}
                        </label>
                        <div className="w-full mt-2">
                            <select
                                ref={fieldRefs.localisation}
                                id="localisation"
                                name="localisation"
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
                            {errors.localisation && <p className="text-red-500 text-sm mt-1">{errors.localisation}</p>}
                        </div>
                    </div>
                    <div className="mt-4 mx-5 border-b border-gray-900/10 pb-5">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">{t('service_afrijet')}</legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.service}
                                            checked={CheckedItems.transport_fret}
                                            onClick={handleChange}
                                            disabled={CheckedItems.transport_passagers}
                                            id="transport_fret"
                                            value="transport fret"
                                            name="transport_fret"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, service: e.target.value })}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="transport_fret" className="font-medium text-gray-900">
                                            {t('transport_fret')}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-x-3 mx-4 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.service}
                                            checked={CheckedItems.transport_passagers}
                                            onClick={handleChange}
                                            disabled={CheckedItems.transport_fret}
                                            id="transport_passagers"
                                            value="transport passagers"
                                            name="transport_passagers"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, service: e.target.value })}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="transport_passagers" className="font-medium text-gray-900">
                                            {t('transport_passagers')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
                        </fieldset>
                    </div>
                    <div className="mt-4 mx-5 border-b border-gray-900/10 pb-5">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">{t('communication')}</legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.communication}
                                            checked={CheckedItems.com_oui}
                                            onClick={handleChange}
                                            disabled={CheckedItems.com_non}
                                            id="com_oui"
                                            value="Oui"
                                            name="com_oui"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, communication: e.target.value })}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="com_oui" className="font-medium text-gray-900">
                                            {t('oui')}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-x-3 mx-4 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.communication}
                                            checked={CheckedItems.com_non}
                                            onClick={handleChange}
                                            disabled={CheckedItems.com_oui}
                                            id="com_non"
                                            value="Non"
                                            name="com_non"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, communication: e.target.value })}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="com_non" className="font-medium text-gray-900">
                                            {t('non')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {errors.communication && <p className="text-red-500 text-sm mt-1">{errors.communication}</p>}
                        </fieldset>
                    </div>
                    <div className="mt-4 mx-4 border-b border-gray-900/10 pb-3">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">{t('experience_entreprise')}</legend>
                            <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                            <div>
                                <div className="mt-4 grid grid-cols-4">
                                    <div className="flex items-center mb-4">
                                        <input ref={fieldRefs.experience_globale} type="radio" id="note1" name="note_collaboration" value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={(e) => setData({ ...data, experience_globale: e.target.value })}
                                        />
                                        <label htmlFor="note1" className="text-gray-700">1</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.experience_globale} id="note2" name="note_collaboration" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={(e) => setData({ ...data, experience_globale: e.target.value })}
                                        />
                                        <label htmlFor="note2" className="text-gray-700">2</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.experience_globale} id="note3" name="note_collaboration" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={(e) => setData({ ...data, experience_globale: e.target.value })}
                                        />
                                        <label htmlFor="note3" className="text-gray-700">3</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.experience_globale} id="note4" name="note_collaboration" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={(e) => setData({ ...data, experience_globale: e.target.value })}
                                        />
                                        <label htmlFor="note4" className="text-gray-700">4</label>
                                    </div>
                                </div>
                                {errors.experience_globale && <p className="text-red-500 text-sm mt-1">{errors.experience_globale}</p>}
                            </div>
                        </fieldset>
                    </div>
                </section>
                <section id={generateId(t('satisfaction_services'))}>
                    <div className='space'>
                        <br />
                    </div>
                    <div className='mx-auto w-[330px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('satisfaction_services')}</h2>
                    </div>
                    <div className='mt-4 mx-5'>
                        <p className='mt-8'>{t('note_service_afrijet')}</p>
                        <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                    </div>
                    <div className="bg-white mt-4 px-6 border-b border-gray-900/10 pb-3">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">{t('qualite_service')}</legend>
                            <div className="mt-4 grid grid-cols-4">
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_service_client} id="note1" name="note_service_client" value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_service_client: e.target.value })}
                                    />
                                    <label htmlFor="note1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_service_client} id="note2" name="note_service_client" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_service_client: e.target.value })}
                                    />
                                    <label htmlFor="note2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_service_client} id="note3" name="note_service_client" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_service_client: e.target.value })}
                                    />
                                    <label htmlFor="note3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_service_client} id="note4" name="note_service_client" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_service_client: e.target.value })}
                                    />
                                    <label htmlFor="note4" className="text-gray-700">4</label>
                                </div>
                            </div>
                            {errors.note_service_client && <p className="text-red-500 text-sm mt-1">{errors.note_service_client}</p>}
                        </fieldset>
                    </div>
                    <div className="bg-white px-6 border-b border-gray-900/10 pb-3">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">{t('ponctualite')}</legend>
                            <div className="mt-4 grid grid-cols-4">
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_ponctualite} id="note1" name="note_ponctualite" value="1" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_ponctualite: e.target.value })}
                                    />
                                    <label htmlFor="note1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_ponctualite} id="note2" name="note_ponctualite" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_ponctualite: e.target.value })}
                                    />
                                    <label htmlFor="note2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_ponctualite} id="note3" name="note_ponctualite" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_ponctualite: e.target.value })}
                                    />
                                    <label htmlFor="note3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_ponctualite} id="note4" name="note_ponctualite" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_ponctualite: e.target.value })}
                                    />
                                    <label htmlFor="note4" className="text-gray-700">4</label>
                                </div>
                            </div>
                            {errors.note_ponctualite && <p className="text-red-500 text-sm mt-1">{errors.note_ponctualite}</p>}
                        </fieldset>
                    </div>
                    <div className="bg-white px-6 border-b border-gray-900/10 pb-3">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">{t('confort')}</legend>
                            <div className="mt-4 grid grid-cols-4">
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_confort} id="note1" name="note_confort" value="1" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_confort: e.target.value })}
                                    />
                                    <label htmlFor="note1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_confort} id="note2" name="note_confort" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_confort: e.target.value })}
                                    />
                                    <label htmlFor="note2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_confort} id="note3" name="note_confort" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_confort: e.target.value })}
                                    />
                                    <label htmlFor="note3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_confort} id="note4" name="note_confort" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_confort: e.target.value })}
                                    />
                                    <label htmlFor="note4" className="text-gray-700">4</label>
                                </div>
                            </div>
                            {errors.note_confort && <p className="text-red-500 text-sm mt-1">{errors.note_confort}</p>}
                        </fieldset>
                    </div>
                    <div className="bg-white px-6 border-b border-gray-900/10 pb-3">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">{t('reservation')}</legend>
                            <div className="mt-4 grid grid-cols-4">
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_reservation} id="note1" name="note_reservation" value="1" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_reservation: e.target.value })}
                                    />
                                    <label htmlFor="note1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_reservation} id="note2" name="note_reservation" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_reservation: e.target.value })}
                                    />
                                    <label htmlFor="note2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_reservation} id="note3" name="note_reservation" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_reservation: e.target.value })}
                                    />
                                    <label htmlFor="note3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_reservation} id="note4" name="note_reservation" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_reservation: e.target.value })}
                                    />
                                    <label htmlFor="note4" className="text-gray-700">4</label>
                                </div>
                            </div>
                            {errors.note_reservation && <p className="text-red-500 text-sm mt-1">{errors.note_reservation}</p>}
                        </fieldset>
                    </div>
                    <div className="bg-white px-6 border-b border-gray-900/10 pb-3">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">{t('qualite_prix')}</legend>
                            <div className="mt-4 grid grid-cols-4">
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_prix} id="note1" name="note_prix" value="1" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_prix: e.target.value })}
                                    />
                                    <label htmlFor="note1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_prix} id="note2" name="note_prix" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_prix: e.target.value })}
                                    />
                                    <label htmlFor="note2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_prix} id="note3" name="note_prix" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_prix: e.target.value })}
                                    />
                                    <label htmlFor="note3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.note_prix} id="note4" name="note_prix" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_prix: e.target.value })}
                                    />
                                    <label htmlFor="note4" className="text-gray-700">4</label>
                                </div>
                            </div>
                            {errors.note_prix && <p className="text-red-500 text-sm mt-1">{errors.note_prix}</p>}
                        </fieldset>
                    </div>
                </section>
                <section id={generateId(t('suggestion'))}>
                    <div className='space'>
                        <br />
                    </div>
                    <div className='mx-auto w-[330px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('suggestion')}</h2>
                    </div>
                    <div className="mt-4 mx-5 border-b border-gray-900/10 pb-5">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">{t('ajout_service')}</legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.ajout_service}
                                            checked={CheckedItems.ajout_oui}
                                            onClick={handleChange}
                                            disabled={CheckedItems.ajout_non}
                                            id="ajout_oui"
                                            value="Oui"
                                            name="ajout_oui"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, ajout_service: e.target.value })}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="ajout_oui" className="font-medium text-gray-900">
                                            {t('oui')}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-x-3 mx-4 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.ajout_service}
                                            checked={CheckedItems.ajout_non}
                                            onClick={handleChange}
                                            disabled={CheckedItems.ajout_oui}
                                            id="ajout_non"
                                            value="Non"
                                            name="ajout_non"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, ajout_service: e.target.value })}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="ajout_non" className="font-medium text-gray-900">
                                            {t('non')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {errors.ajout_service && <p className="text-red-500 text-sm mt-1">{errors.ajout_service}</p>}
                        </fieldset>
                    </div>
                    <div className="mt-4 mx-5 border-b border-gray-900/10 pb-5">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">{t('recommandation_entreprise')}</legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.recommandation}
                                            checked={CheckedItems.recommandation_oui}
                                            onClick={handleChange}
                                            disabled={CheckedItems.recommandation_non}
                                            id="recommandation_oui"
                                            value="Oui"
                                            name="recommandation_oui"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, recommandation: e.target.value })}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="recommandation_oui" className="font-medium text-gray-900">
                                            {t('oui')}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-x-3 mx-4 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.recommandation}
                                            checked={CheckedItems.recommandation_non}
                                            onClick={handleChange}
                                            disabled={CheckedItems.recommandation_oui}
                                            id="recommandation_non"
                                            value="Non"
                                            name="recommandation_non"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, recommandation: e.target.value })}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="recommandation_non" className="font-medium text-gray-900">
                                            {t('non')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {errors.recommandation && <p className="text-red-500 text-sm mt-1">{errors.recommandation}</p>}
                        </fieldset>
                    </div>
                    <div className="mt-4 mx-4 pb-5">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">{t('raison_recommandation')}</legend>
                            <div className="mt-2">
                                <textarea
                                    ref={fieldRefs.raison_recommandation}
                                    id="recommandation"
                                    name="recommandation"
                                    rows="3"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-red-300 focus:ring-1 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6 bg-gray-200"
                                    onChange={(e) => setData({ ...data, raison_recommandation: e.target.value })}
                                >

                                </textarea>
                            </div>
                            {errors.raison_recommandation && <p className="text-red-500 text-sm mt-1">{errors.raison_recommandation}</p>}
                        </fieldset>
                    </div>
                </section>
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

export default enqueteCorporate