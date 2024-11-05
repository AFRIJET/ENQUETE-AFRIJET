import React, { useEffect, useRef, useState } from 'react'
import '../styles/style.css'
import Header from '../composants/header';
import logoAfrijet from '../assets/images/logo.png';
import axios from 'axios'
import country from '../composants/country.json';
import destination from '../composants/destination.json'
import agence from '../composants/agence.json'
import Fildariane from '../composants/fildariane';
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next';

const apiUrl = import.meta.env.VITE_API_URL;

const AgencySurvey = () => {

    const [isPopVisible, setIsPopVisible] = useState(false); // Declaration de la variable pour la popUp
    const popupRef = useRef(null)
    const { t } = useTranslation()
    const sections = [
        { label: t('infos_generales') },
        { label: t('agence') },
        { label: t('services_afrijet') },
    ];
    const [errors, setErrors] = useState({})
    const date = new Date().toISOString() // Definition de la variable date
    const [selectedCheckbox, setSelectedCheckbox] = useState(null); // État pour la sélection de la checkbox

    // Initialisation de l'etat de ma variable data grace au hook UseState pour recuperer les donnees entrees par les utilisateurs
    const [data, setData] = useState({
        date: date,
        sexe: '',
        num_billet: '',
        nationalite: '',
        destination: '',
        agence: '',
        acceuil_agence: '',
        raison_agence: '',
        satisfaction_agent: '',
        temps_attente: '',
        satisfaction_client: '',
        note_programme_fidelite: '',
        note_salon_business: '',
        note_bagage: '',
        note_serviceUM: '',
        note_animal_cabine: '',
        note_animal_soute: '',
        recommandation: '',
        raison_recommandation: ''
    })

    // Références pour chaque champ
    const fieldRefs = {
        sexe: useRef(null),
        nationalite: useRef(null),
        destination: useRef(null),
        agence: useRef(null),
        acceuil_agence: useRef(null),
        raison_agence: useRef(null),
        satisfaction_agent: useRef(null),
        temps_attente: useRef(null),
        satisfaction_client: useRef(null),
        note_programme_fidelite: useRef(null),
        note_salon_business: useRef(null),
        note_bagage: useRef(null),
        note_serviceUM: useRef(null),
        note_animal_cabine: useRef(null),
        note_animal_soute: useRef(null),
        recommandation: useRef(null),
        raison_recommandation: useRef(null)
    };

    // Definiton des checkboxs
    const [CheckedItems, setCheckedItems] = useState({
        homme: false,
        femme: false,
        chaleureux: false,
        pas_chaleureux: false,
        proche_de_chez_moi: false,
        pour_plus_conseils: false,
        site_web: false,
        paiement_facile: false,
        attente_oui: false,
        attente_non: false,
        Entre_5minutes: false,
        plus_15minutes: false,
        tarification_oui: false,
        tarification_non: false,
        recommandation_oui: false,
        recommandation_non: false,
    })

    // pour permettre d'afficher la fil d'ariane de maniere dynamique en fonction de la langue choisie
    const generateId = (label) => {
        // Transformation du label pour un id valide : tout en minuscule et espaces en tirets
        return label.toLowerCase();
    };

    // fonction qui permet de rendre les checkboxs à plusieurs valeurs en radio 
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

    // fonction qui permet de changer l'etat des checkboxs
    const handleChange = (event) => {
        const { name, checked } = event.target;
        setCheckedItems({
            ...CheckedItems,
            [name]: checked
        })
    }

    // Fonction qui permet d'envoyer les donnees stocker dans la variable data pour stocker les informations grace a axios
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validation des champs (sauf num_billet)
        Object.keys(data).forEach((key) => {
            if (key !== 'num_billet' && !data[key]) {
                newErrors[key] = 'Ce champ est requis';
            }
        });
        setErrors(newErrors);

        // Si des erreurs sont présentes, on défile vers le premier champ vide
        if (Object.keys(newErrors).length > 0) {
            const firstErrorField = Object.keys(newErrors)[0];
            fieldRefs[firstErrorField].current.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Envoi des données s'il n'y a pas d'erreurs
            axios.post(`${apiUrl}/enqueteagence`, data, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    console.log(response.data);
                    setIsPopVisible(true);
                    setData({}); // Remet les valeurs initiales
                    setErrors({});
                })
                .catch(err => console.log("Erreur lors de l'envoi des données :", err));
        }
    }

    // fonction pour fermer la popup
    const closePopUp = () => {
        setIsPopVisible(false);
        setData(''); // Réinitialise le champ de données
    }

    // Ferme la popup si on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closePopUp();
            }
        };

        if (isPopVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPopVisible]);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            style={{ willChange: 'auto' }}
            variants={variants}
        >
            <div>
                <Header image={logoAfrijet} type={t('enquete_agence')} />
                <Fildariane sections={sections} />
            </div>
            <form onSubmit={handleSubmit}>
                <section id={generateId(t('infos_generales'))}>
                    <div className='space'>
                        <br />
                    </div>
                    <div className='info-generales-info mx-auto w-[330px] bg-brown-500 rounded-sm text-center'>
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
                                    id="ajout_service"
                                    name="ajout_service"
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
                        <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
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
                        <label htmlFor="destination" className="block text-sm font-medium leading-6 text-gray-900">
                            {t('destination')}
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
                                        <option key={item.destiantion}>{item.destiantion}</option>
                                    ))
                                }
                            </select>
                            {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
                        </div>
                    </div>
                </section>
                <section id={generateId(t('agence'))}>
                    <div className='bg-white'>
                        <br />
                    </div>
                    <div className='mx-auto w-[330px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('agence')}</h2>
                    </div>
                    <div className="mx-5 mt-5 sm:col-span-3 border-b border-gray-900/10 pb-5">
                        <label htmlFor="agence" className=" mt-4 block text-sm font-medium leading-6 text-gray-900">
                            {t('agence_afrijet')}
                        </label>
                        <div className="w-full mt-2">
                            <select
                                ref={fieldRefs.agence}
                                id="agence"
                                name="agence"
                                className="p-2 bg-gray-200 block w-full rounded-md font-medium border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xl sm:text-sm sm:leading-6"
                                onChange={(e) => setData({ ...data, agence: e.target.value })}
                            >
                                <option selected disabled>{t('selection_agence')}</option>
                                {
                                    agence.map((item) => (
                                        <option key={item.agence}>{item.agence}</option>
                                    ))
                                }
                            </select>
                            {errors.agence && <p className="text-red-500 text-sm mt-1">{errors.agence}</p>}
                        </div>
                    </div>
                    <div className="mt-4 mx-4 border-b border-gray-900/10 pb-3">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">{t('acceuil_agence')}</legend>
                            <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                            <div>
                                <div className="mt-4 grid grid-cols-4">
                                    <div className="flex items-center mb-4">
                                        <input ref={fieldRefs.acceuil_agence} type="radio" id="note_acceuil_1" name="note_acceuil" value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={(e) => setData({ ...data, acceuil_agence: e.target.value })}
                                        />
                                        <label htmlFor="note_acceuil_1" className="text-gray-700">1</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.acceuil_agence} id="note_acceuil_2" name="note_acceuil" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={(e) => setData({ ...data, acceuil_agence: e.target.value })}
                                        />
                                        <label htmlFor="note_acceuil_2" className="text-gray-700">2</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.acceuil_agence} id="note_acceuil_3" name="note_acceuil" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={(e) => setData({ ...data, acceuil_agence: e.target.value })}
                                        />
                                        <label htmlFor="note_acceuil_3" className="text-gray-700">3</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.acceuil_agence} id="note_acceuil_4" name="note_acceuil" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={(e) => setData({ ...data, acceuil_agence: e.target.value })}
                                        />
                                        <label htmlFor="note_acceuil_4" className="text-gray-700">4</label>
                                    </div>
                                </div>
                                {errors.acceuil_agence && <p className="text-red-500 text-sm mt-1">{errors.acceuil_agence}</p>}
                            </div>
                        </fieldset>
                    </div>
                    <div className="mt-4 mx-5 border-b border-gray-900/10 pb-5">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">{t('raison_agence')}</legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-2 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.raison_agence}
                                            id="proche_de_chez_moi"
                                            value="proche de chez moi"
                                            name="proche_de_chez_moi"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, raison_agence: e.target.value })}
                                            checked={selectedCheckbox === "proche de chez moi"}
                                            onClick={handleCheckboxChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="proche_de_chez_moi" className="font-medium text-gray-900">
                                            {t('proche_de_chez_moi')}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-x-3 mx-4 p-2 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.raison_agence}
                                            id="pour_plus_conseils"
                                            value="pour plus de conseils"
                                            name="pour_plus_conseils"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, raison_agence: e.target.value })}
                                            checked={selectedCheckbox === "pour plus de conseils"}
                                            onClick={handleCheckboxChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="pour_plus_conseils" className="font-medium text-gray-900">
                                            {t('plus_conseils')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-2 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.raison_agence}
                                            id="site_web"
                                            value="effectuer le paiement"
                                            name="site_web"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, raison_agence: e.target.value })}
                                            checked={selectedCheckbox === "effectuer le paiement"}
                                            onClick={handleCheckboxChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="site_web" className="font-medium text-gray-900">
                                            {t('site_web')}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-x-3 mx-4 p-2 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.raison_agence}
                                            id="paiement_facile"
                                            value="paiement facile"
                                            name="paiement_facile"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, raison_agence: e.target.value })}
                                            checked={selectedCheckbox === "paiement facile"}
                                            onClick={handleCheckboxChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="paiement_facile" className="font-medium text-gray-900">
                                            {t('paiement_facile')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        {errors.raison_agence && <p className="text-red-500 text-sm mt-1">{errors.raison_agence}</p>}
                    </div>
                    <div className="mt-4 mx-5 border-b border-gray-900/10 pb-5">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">{t('satisfaction_agent')}</legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.satisfaction_agent}
                                            checked={CheckedItems.attente_oui}
                                            onClick={handleChange}
                                            disabled={CheckedItems.attente_non}
                                            id="attente_oui"
                                            value="attente satisfait"
                                            name="attente_oui"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, satisfaction_agent: e.target.value })}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="attente_oui" className="font-medium text-gray-900">
                                            {t('oui')}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-x-3 mx-4 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.satisfaction_agent}
                                            checked={CheckedItems.attente_non}
                                            onClick={handleChange}
                                            disabled={CheckedItems.attente_oui}
                                            id="attente_non"
                                            value="attente non satisfait"
                                            name="attente_non"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, satisfaction_agent: e.target.value })}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="attente_non" className="font-medium text-gray-900">
                                            {t('non')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {errors.satisfaction_agent && <p className="text-red-500 text-sm mt-1">{errors.satisfaction_agent}</p>}
                        </fieldset>
                    </div>
                    <div className="mt-4 mx-5 border-b border-gray-900/10 pb-5">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">{t('temps_attente')}</legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.temps_attente}
                                            checked={CheckedItems.Entre_5minutes}
                                            onClick={handleChange}
                                            disabled={CheckedItems.plus_15minutes}
                                            id="Entre_5minutes"
                                            value="entre 5 et 15 minutes"
                                            name="Entre_5minutes"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, temps_attente: e.target.value })}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="Entre_5minutes" className="font-medium text-gray-900">
                                            {t('entre_5_15_minutes')}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-x-3 mx-4 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.temps_attente}
                                            checked={CheckedItems.plus_15minutes}
                                            onClick={handleChange}
                                            disabled={CheckedItems.Entre_5minutes}
                                            id="plus_15minutes"
                                            value="plus de 15 minutes"
                                            name="plus_15minutes"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={(e) => setData({ ...data, temps_attente: e.target.value })}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="plus_15minutes" className="font-medium text-gray-900">
                                            {t('plus_15_minutes')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {errors.temps_attente && <p className="text-red-500 text-sm mt-1">{errors.temps_attente}</p>}
                        </fieldset>
                    </div>
                    <div className="mt-4 mx-5 border-b border-gray-900/10 pb-5">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">
                                {t('satisfaction_client')}
                            </legend>
                            <small className='text-xs text-gray-700'>{t('type_satisfaction')}</small>
                            <div>
                                <div className="mt-4 grid grid-cols-4">
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.satisfaction_client} id="note_satisfaction_1" name="note_satisfaction" value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={(e) => setData({ ...data, satisfaction_client: e.target.value })}
                                        />
                                        <label htmlFor="note_satisfaction_1" className="text-gray-700">1</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.satisfaction_client} id="note_satisfaction_2" name="note_satisfaction" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={(e) => setData({ ...data, satisfaction_client: e.target.value })}
                                        />
                                        <label htmlFor="note_satisfaction_2" className="text-gray-700">2</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.satisfaction_client} id="note_satisfaction_3" name="note_satisfaction" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={(e) => setData({ ...data, satisfaction_client: e.target.value })}
                                        />
                                        <label htmlFor="note_satisfaction_3" className="text-gray-700">3</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.satisfaction_client} id="note_satisfaction_4" name="note_satisfaction" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={(e) => setData({ ...data, satisfaction_client: e.target.value })}
                                        />
                                        <label htmlFor="note_satisfaction_4" className="text-gray-700">4</label>
                                    </div>
                                </div>
                            </div>
                            {errors.satisfaction_client && <p className="text-red-500 text-sm mt-1">{errors.satisfaction_client}</p>}
                        </fieldset>
                    </div>
                </section>
                <section id={generateId(t('services_afrijet'))}>
                    <div className='space'>
                        <br />
                    </div>
                    <div className='mx-auto w-[330px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('services_afrijet')}</h2>
                    </div>
                    <div className='mt-4 mx-5'>
                        <p className='mt-8'>{t('note_service')}</p>
                        <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                    </div>
                    <div className="bg-white mt-4 px-6 border-b border-gray-900/10 pb-3">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">{t('programme_fidelite')}</legend>
                            <div className="mt-4 grid grid-cols-4">
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note_programme_1" name="note_programme" value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_programme_fidelite: e.target.value })}
                                    />
                                    <label htmlFor="note_programme_1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note_programme_2" name="note_programme" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_programme_fidelite: e.target.value })}
                                    />
                                    <label htmlFor="note_programme_2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note_programme_3" name="note_programme" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_programme_fidelite: e.target.value })}
                                    />
                                    <label htmlFor="note_programme_3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note_programme_4" name="note_programme" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_programme_fidelite: e.target.value })}
                                    />
                                    <label htmlFor="note_programme_4" className="text-gray-700">4</label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="bg-white px-6 border-b border-gray-900/10 pb-3">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">{t('salon_business')}</legend>
                            <div className="mt-4 grid grid-cols-4">
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note1" name="note_salon" value="1" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_salon_business: e.target.value })}
                                    />
                                    <label htmlFor="note1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note2" name="note_salon" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_salon_business: e.target.value })}
                                    />
                                    <label htmlFor="note2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note3" name="note_salon" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_salon_business: e.target.value })}
                                    />
                                    <label htmlFor="note3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note4" name="note_salon" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_salon_business: e.target.value })}
                                    />
                                    <label htmlFor="note4" className="text-gray-700">4</label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="bg-white px-6 border-b border-gray-900/10 pb-3">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">{t('bagage_supplementaire')}</legend>
                            <div className="mt-4 grid grid-cols-4">
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note1" name="note_bagage" value="1" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_bagage: e.target.value })}
                                    />
                                    <label htmlFor="note1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note2" name="note_bagage" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_bagage: e.target.value })}
                                    />
                                    <label htmlFor="note2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note3" name="note_bagage" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_bagage: e.target.value })}
                                    />
                                    <label htmlFor="note3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note4" name="note_bagage" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_bagage: e.target.value })}
                                    />
                                    <label htmlFor="note4" className="text-gray-700">4</label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="bg-white px-6 border-b border-gray-900/10 pb-3">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">{t('service_um')}</legend>
                            <div className="mt-4 grid grid-cols-4">
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note1" name="note_service" value="1" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_serviceUM: e.target.value })}
                                    />
                                    <label htmlFor="note1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note2" name="note_service" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_serviceUM: e.target.value })}
                                    />
                                    <label htmlFor="note2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note3" name="note_service" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_serviceUM: e.target.value })}
                                    />
                                    <label htmlFor="note3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note4" name="note_service" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_serviceUM: e.target.value })}
                                    />
                                    <label htmlFor="note4" className="text-gray-700">4</label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="bg-white px-6 border-b border-gray-900/10 pb-3">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">{t('animal_cabine')}</legend>
                            <div className="mt-4 grid grid-cols-4">
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note1" name="note_animal_cabine" value="1" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_animal_cabine: e.target.value })}
                                    />
                                    <label htmlFor="note1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note2" name="note_animal_cabine" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_animal_cabine: e.target.value })}
                                    />
                                    <label htmlFor="note2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note3" name="note_animal_cabine" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_animal_cabine: e.target.value })}
                                    />
                                    <label htmlFor="note3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note4" name="note_animal_cabine" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_animal_cabine: e.target.value })}
                                    />
                                    <label htmlFor="note4" className="text-gray-700">4</label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="bg-white px-6 border-b border-gray-900/10 pb-3">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">{t('animal_soute')}</legend>
                            <div className="mt-4 grid grid-cols-4">
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note1" name="note_animal_soute" value="1" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_animal_soute: e.target.value })}
                                    />
                                    <label htmlFor="note1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note2" name="note_animal_soute" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_animal_soute: e.target.value })}
                                    />
                                    <label htmlFor="note2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note3" name="note_animal_soute" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_animal_soute: e.target.value })}
                                    />
                                    <label htmlFor="note3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note4" name="note_animal_soute" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={(e) => setData({ ...data, note_animal_soute: e.target.value })}
                                    />
                                    <label htmlFor="note4" className="text-gray-700">4</label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="mt-4 mx-5 border-b border-gray-900/10 pb-5">
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">{t('recommandation')}</legend>
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

export default AgencySurvey