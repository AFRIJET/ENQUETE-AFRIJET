import React, { useEffect, useRef, useState } from 'react';
import '../styles/style.css'
import Fildariane from '../composants/fildariane'
import logoAfrijet from '../assets/images/logo.png';
import logoFlygabon from '../assets/images/Logo-FG1.png'
import imageEntreprise from '../assets/images/Afrijet-entreprise.jpg'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next'
import country from '../composants/country.json'
import LanguageSelector from '../composants/languageSelector';
import axios from 'axios';

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
    const [selectedCheckbox, setSelectedCheckbox] = useState(null)
    const popupRef = useRef(null)
    const date = new Date().toISOString().split("T")[0];
    const [data, setData] = useState({
        date: date,
    })
    const initialErrors = {
        anciennete: '',
        localisation: '',
        service: '',
        communication: '',
        experience_globale: '',
        service_client: '',
        ponctualite: '',
        confort: '',
        reservation: '',
        prix: '',
        amelioration_service: '',
        service_ameliorer: '',
        recommandation: '',
        raison_recommandation: ''
    }
    const [errors, setErrors] = useState(initialErrors)
    const [dataErrors, setDataErrors] = useState(initialErrors)
    const fieldRefs =
        Object.keys(initialErrors).reduce((acc, key) => {
            acc[key] = useRef(null);
            return acc;
        }, {});
    const [CheckedItems, setCheckedItems] = useState({
        transport_passagers: false,
        transport_fret: false,
        com_oui: false,
        com_non: false,
        amelioration_oui: false,
        amelioration_non: false,
    })

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

    const handleChangeBox = (e) => {
        const { id, checked } = e.target
        setCheckedItems({
            ...CheckedItems,
            [id]: checked
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

    const generateId = (label) => {
        return label.toLowerCase()
    }

    const closePopUp = () => {
        setIsPopVisible(false);
        window.location.reload()
    }

    const updatedErrors = (name, value) => {
        // Annuler l'erreur pour le champ sexe
        setDataErrors((prevErrors) => ({
            ...prevErrors,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    }

    // Fonction pour récuperer les données entrées par l'utilisateur
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Pour les cases à cocher
        if (type === 'checkbox') {
            setCheckedItems((prev) => ({
                ...prev,
                [value]: checked // Met à jour l'état pour le sexe
            }));

            // Mettre à jour l'état des données
            setData({
                ...data,
                [name]: value
            });
            updatedErrors(name, value);
        } else {
            // Mettre à jour l'état des données
            setData({
                ...data,
                [name]: value
            });

            // Vérifier si le champ est rempli et annuler l'erreur
            if (value.trim() !== '') {
                updatedErrors(name, value);
            }
        }
    };

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
        const newErrors =
            Object.keys(dataErrors).reduce((acc, key) => {
                if (!dataErrors[key].trim()) acc[key] = 'Ce champ est requis';
                return acc;
            }, {});
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstErrorField = Object.keys(newErrors)[0];
            fieldRefs[firstErrorField].current.scrollIntoView({ behavior: 'smooth' });
        } else {
            axios.post(`${apiUrl}/api/enquete_entreprise`, data, {
                headers: { 'Content-Type': 'Application/json' }
            })
                .then(response => {
                    setIsPopVisible(true);
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
                    <div className='w-full h-full bg-white-500/15'>
                        <div className='content relative text-center z-10'>
                            <div className='float-left w-1/2 p-[4vh_2px]'>
                                <img src={logoAfrijet} alt='logo Afrijet' />
                            </div>
                            <div className='float-right w-1/2 p-[2vh_2px]'>
                                <img src={logoFlygabon} alt='logo Afrijet' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <LanguageSelector />
            <form onSubmit={handleSubmit}>
                <section id={generateId(t('experience_collaboration'))}>
                    <div className='space'>
                        <br />
                    </div>
                    <div className='info-generales-info mx-auto w-[360px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('experience_collaboration')}</h2>
                    </div>
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.anciennete ? 'p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">1. {t('annee_colloboration')} <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-2 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.anciennete}
                                            id="moins_1_an"
                                            value="moins de 1 an"
                                            name="anciennete"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
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
                                            name="anciennete"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
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
                                            name="anciennete"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
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
                    </div>
                    {errors.anciennete && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.anciennete}{")"}</small>}
                    <div className={`mx-5 mt-4 border-b border-gray-900/10 pb-5 ${errors.localisation ? 'p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <legend htmlFor="country" className="text-sm font-semibold leading-6 text-gray-900">
                           2. {t('localisation')} <span className='text-red-500'>*</span>
                        </legend>
                        <div className="w-full mt-2">
                            <select
                                ref={fieldRefs.localisation}
                                id="localisation"
                                name="localisation"
                                className="p-2 w-full bg-gray-200 block rounded-md font-medium border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xl sm:text-sm sm:leading-6"
                                onChange={handleChange}
                            >
                                <option selected disabled>{t('selection_pays')}</option>
                                {
                                    country.map((item) => (
                                        <option key={item.country}>{item.country}</option>
                                    ))
                                }

                            </select>
                        </div>
                    </div>
                    {errors.localisation && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.localisation}{")"}</small>}
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.service ? 'p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">3. {t('service_afrijet')} <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.service}
                                            checked={CheckedItems.transport_fret}
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.transport_passagers}
                                            id="transport_fret"
                                            value="transport fret"
                                            name="service"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
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
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.transport_fret}
                                            id="transport_passagers"
                                            value="transport passagers"
                                            name="service"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="transport_passagers" className="font-medium text-gray-900">
                                            {t('transport_passagers')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.service && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.service}{")"}</small>}
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.communication ? 'p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">4. {t('communication')} <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.communication}
                                            checked={CheckedItems.com_oui}
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.com_non}
                                            id="com_oui"
                                            value="Oui"
                                            name="communication"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
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
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.com_oui}
                                            id="com_non"
                                            value="Non"
                                            name="communication"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="com_non" className="font-medium text-gray-900">
                                            {t('non')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.communication && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.communication}{")"}</small>}
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.experience_globale ? 'p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">5. {t('experience_entreprise')} <span className='text-red-500'>*</span></legend>
                            <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                            <div>
                                <div className="mt-4 grid grid-cols-5">
                                    <div className="flex items-center mb-4">
                                        <input ref={fieldRefs.experience_globale} type="radio" id="note_experience_globale_1" name="experience_globale" value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_experience_globale_1" className="text-gray-700">1</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.experience_globale} id="note_experience_globale_2" name="experience_globale" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_experience_globale_2" className="text-gray-700">2</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.experience_globale} id="noteexperience_globale_3" name="experience_globale" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="noteexperience_globale_3" className="text-gray-700">3</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.experience_globale} id="noteexperience_globale_4" name="experience_globale" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="noteexperience_globale_4" className="text-gray-700">4</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.experience_globale} id="noteexperience_globale_5" name="experience_globale" value="5" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="noteexperience_globale_5" className="text-gray-700">5</label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.experience_globale && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.experience_globale}{")"}</small>}
                </section>
                <section id={generateId(t('satisfaction_services'))}>
                    <div className='space'>
                        <br />
                    </div>
                    <div className='mx-auto w-[330px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('satisfaction_services')}</h2>
                    </div>
                    <div className='mt-4 mx-5'>
                        <p className='mt-5'>{t('note_service_afrijet')}</p>
                        <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                    </div>
                    <div className={`bg-white mt-4 px-6 border-b border-gray-900/10 pb-3 ${errors.service_client ? 'p-2 mx-5 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">6. {t('qualite_service')} : <span className='text-red-500'>*</span></legend>
                            <div className="mt-4 grid grid-cols-5">
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.service_client} id="noteservice_client_1" name="service_client" value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteservice_client_1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.service_client} id="noteservice_client_2" name="service_client" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteservice_client_2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.service_client} id="noteservice_client_3" name="service_client" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteservice_client_3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.service_client} id="note_service_client_4" name="service_client" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="note_service_client_4" className="text-gray-700">4</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.service_client} id="noteservice_client5" name="service_client" value="5" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteservice_client5" className="text-gray-700">5</label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.service_client && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.service_client}{")"}</small>}
                    <div className={`bg-white mt-4 px-6 border-b border-gray-900/10 pb-3 ${errors.ponctualite ? 'p-2 mx-5 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">7. {t('ponctualite')} : <span className='text-red-500'>*</span></legend>
                            <div className="mt-4 grid grid-cols-5">
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.ponctualite} id="noteponctualite1" name="ponctualite" value="1" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteponctualite1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.ponctualite} id="noteponctualite2" name="ponctualite" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteponctualite2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.ponctualite} id="noteponctualite3" name="ponctualite" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteponctualite3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.ponctualite} id="noteponctualite4" name="ponctualite" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteponctualite4" className="text-gray-700">4</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.ponctualite} id="noteponctualite5" name="ponctualite" value="5" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteponctualite5" className="text-gray-700">5</label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.ponctualite && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.ponctualite}{")"}</small>}
                    <div className={`bg-white mt-4 px-6 border-b border-gray-900/10 pb-3 ${errors.confort ? 'p-2 mx-5 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">8. {t('confort')} : <span className='text-red-500'>*</span></legend>
                            <div className="mt-4 grid grid-cols-5">
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.confort} id="noteconfort1" name="confort" value="1" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteconfort1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.confort} id="noteconfort2" name="confort" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteconfort2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.confort} id="noteconfort3" name="confort" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteconfort3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.confort} id="noteconfort4" name="confort" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteconfort4" className="text-gray-700">4</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.confort} id="noteconfort5" name="confort" value="5" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteconfort5" className="text-gray-700">5</label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.confort && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.confort}{")"}</small>}
                    <div className={`bg-white mt-4 px-6 border-b border-gray-900/10 pb-3 ${errors.reservation ? 'p-2 mx-5 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">9. {t('reservation')} : <span className='text-red-500'>*</span></legend>
                            <div className="mt-4 grid grid-cols-5">
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.reservation} id="notereservation1" name="reservation" value="1" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="notereservation1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.reservation} id="notereservation2" name="reservation" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="notereservation2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.reservation} id="notereservation3" name="reservation" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="notereservation3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.reservation} id="notereservation4" name="reservation" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="notereservation4" className="text-gray-700">4</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.reservation} id="notereservation5" name="reservation" value="5" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="notereservation5" className="text-gray-700">5</label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.reservation && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.reservation}{")"}</small>}
                    <div className={`bg-white mt-4 px-6 border-b border-gray-900/10 pb-3 ${errors.prix ? 'p-2 mx-5 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">10. {t('qualite_prix')} : <span className='text-red-500'>*</span></legend>
                            <div className="mt-4 grid grid-cols-5">
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.prix} id="noteprix1" name="prix" value="1" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteprix1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.prix} id="noteprix2" name="prix" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteprix2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.prix} id="noteprix3" name="prix" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteprix3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.prix} id="noteprix4" name="prix" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteprix4" className="text-gray-700">4</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" ref={fieldRefs.prix} id="noteprix5" name="prix" value="5" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="noteprix5" className="text-gray-700">5</label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.prix && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.prix}{")"}</small>}
                </section>
                <section id={generateId(t('suggestion'))}>
                    <div className='space'>
                        <br />
                    </div>
                    <div className='mx-auto w-[330px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('suggestion')}</h2>
                    </div>
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.amelioration_service ? 'p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">11. {t('amelioration_service')} <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.amelioration_service}
                                            checked={CheckedItems.amelioration_oui}
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.amelioration_non}
                                            id="amelioration_oui"
                                            value="Oui"
                                            name="amelioration_service"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="amelioration_oui" className="font-medium text-gray-900">
                                            {t('oui')}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-x-3 mx-4 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.amelioration_service}
                                            checked={CheckedItems.amelioration_non}
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.amelioration_oui}
                                            id="amelioration_non"
                                            value="Non"
                                            name="amelioration_service"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="amelioration_non" className="font-medium text-gray-900">
                                            {t('non')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.amelioration_service && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.amelioration_service}{")"}</small>}
                    {CheckedItems.amelioration_oui &&
                        <div>
                            <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.service_ameliorer ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                                <fieldset>
                                    <legend className="text-sm font-semibold leading-6 text-gray-900">{t('service_corporate')} <span className='text-red-500'>*</span></legend>
                                    <div className="w-full mt-2">
                                        <select
                                            ref={fieldRefs.service_ameliorer}
                                            id="service_ameliorer"
                                            name="service_ameliorer"
                                            className="p-2 bg-gray-200 block w-full rounded-md font-medium border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xl sm:text-sm sm:leading-6"
                                            onChange={handleChange}
                                        >
                                            <option selected disabled>{t('selection')}</option>
                                            <option>{t('reservation')}</option>
                                            <option>{t('qualite_service')}</option>
                                            <option>{t('confort')}</option>
                                            <option>{t('ponctualite')}</option>
                                            <option>{t('qualite_prix')}</option>
                                            <option>{t('autre')}</option>
                                        </select>
                                    </div>
                                </fieldset>
                            </div>
                            {errors.service_ameliorer && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.service_ameliorer}{")"}</small>}
                        </div>
                    }
                </section>
                <section id={generateId(t('recommandation'))}>
                    <div className='space'>
                        <br />
                    </div>
                    <div className='mx-auto w-[330px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('recommandation')}</h2>
                    </div>
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.recommandation ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">12. {t('recommandation_entreprise')} <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.recommandation}
                                            checked={CheckedItems.recommandation_oui}
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.recommandation_non}
                                            id="recommandation_oui"
                                            value="Oui"
                                            name="recommandation"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
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
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.recommandation_oui}
                                            id="recommandation_non"
                                            value="Non"
                                            name="recommandation"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="recommandation_non" className="font-medium text-gray-900">
                                            {t('non')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.recommandation && <p className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.recommandation}{")"}</p>}
                    {CheckedItems.recommandation_oui &&
                        <div>
                            <div className={`mt-4 mx-4 pb-5 ${errors.raison_recommandation ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                                <fieldset>
                                    <legend className="text-sm font-semibold leading-6 text-gray-900">13. {t('recommandation_entreprise1')} <span className='text-red-500'>*</span></legend>
                                    <div className="w-full mt-2">
                                        <select
                                            ref={fieldRefs.raison_recommandation}
                                            id="raison_recommandation"
                                            name="raison_recommandation"
                                            className="p-2 bg-gray-200 block w-full rounded-md font-medium border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xl sm:text-sm sm:leading-6"
                                            onChange={handleChange}
                                        >
                                            <option selected disabled>{t('selection')}</option>
                                            <option>{t('Aimabilite')}</option>
                                            <option>{t('Bon_acceuil')}</option>
                                            <option>{t('couverture_regionale')}</option>
                                            <option>{t('frequence_vol')}</option>
                                            <option>{t('prix_billet')}</option>
                                            <option>{t('autre')}</option>
                                        </select>
                                    </div>
                                </fieldset>
                            </div>
                            {errors.raison_recommandation && <p className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.raison_recommandation}{")"}</p>}
                        </div>
                    }
                    {CheckedItems.recommandation_non &&
                        <div>
                            <div className={`mt-4 mx-4 pb-5 ${errors.raison_recommandation ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                                <fieldset>
                                    <legend className="text-sm font-semibold leading-6 text-gray-900">13. {t('recommandation_entreprise2')} <span className='text-red-500'>*</span></legend>
                                    <div className="w-full mt-2">
                                        <select
                                            ref={fieldRefs.raison_recommandation}
                                            id="raison_recommandation"
                                            name="raison_recommandation"
                                            className="p-2 bg-gray-200 block w-full rounded-md font-medium border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xl sm:text-sm sm:leading-6"
                                            onChange={handleChange}
                                        >
                                            <option selected disabled>{t('selection')}</option>
                                            <option>{t('Aimabilite')}</option>
                                            <option>{t('Bon_acceuil')}</option>
                                            <option>{t('couverture_regionale')}</option>
                                            <option>{t('frequence_vol')}</option>
                                            <option>{t('prix_billet')}</option>
                                            <option>{t('autre')}</option>
                                        </select>
                                    </div>
                                </fieldset>
                            </div>
                            {errors.raison_recommandation && <p className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.raison_recommandation}{")"}</p>}
                        </div>
                    }
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