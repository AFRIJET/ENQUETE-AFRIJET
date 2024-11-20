import React, { useEffect, useRef, useState } from 'react'
import '../styles/style.css'
import Fildariane from '../composants/fildariane'
import logoAfrijet from '../assets/images/logo.png';
import imageEnvol from '../assets/images/Afrijet-envol2.jpg'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import country from '../composants/country.json';
import destination from '../composants/destination.json';
import LanguageSelector from '../composants/languageSelector';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const enqueteSatisfaction = () => {

    const { t, i18n } = useTranslation()
    // Déclarations des sections
    const sections = [
        { label: t('infos_generales') },
        { label: t('experience_enregistrement') },
        { label: t('experience_vol') },
        { label: t('services_afrijet') },
    ]
    const [isPopVisible, setIsPopVisible] = useState(false)
    const popupRef = useRef(null)
    const date = new Date().toISOString()
    const [data, setData] = useState({
        date: date,
    })
    const initialErrors = {
        sexe: '',
        num_billet: '',
        nationalite: '',
        depart: '',
        destination: '',
        assistance_comptoire: '',
        experience_comptoire: '',
        courtoisie_personnel_escale: '',
        difficulte: '',
        explication_difficulte: '',
        ponctualite: '',
        courtoisie_personel_envol: '',
        confort_siege: '',
        proprete: '',
        experience_vol: '',        
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
        homme: false,
        femme: false,
        assistance_oui: false,
        assistance_non: false,
        difficulte_oui: false,
        difficulte_non: false,
        infos_oui: false,
        infos_non: false,
        horaire_oui: false,
        horaire_non: false,
        confortable: false,
        inconfortable: false,
        satisfaisante: false,
        insatisfaisante: false,
        divertissement_oui: false,
        divertissement_non: false,
        recommandation_oui: false,
        recommandation_non: false,
    })

    const [options, setOptions] = useState([
        { key: "salon_business", label: t("salon_business"), name: "salon_business" },
        { key: "bagage_supplementaire", label: t("bagage_supplementaire"), name: "bagage_supplementaire" },
        { key: "service_um", label: t("service_um"), name: "service_um" },
        { key: "animal_cabine", label: t("animal_cabine"), name: "animal_cabine" },
        { key: "animal_soute", label: t("animal_soute"), name: "animal_soute" },
        { key: "repas", label: t("repas"), name: "repas" },
        { key: "programme_divertissement", label: t("programme_divertissement"), name: "programme_divertissement" },
    ]);

    // Mise à jour des labels à chaque changement de langue
    useEffect(() => {
        const updatedOptions = options.map(option => ({
            ...option,
            label: t(option.key), // Recalcule le label pour la langue actuelle
        }));
        setOptions(updatedOptions);
    }, [i18n.language]); // Déclenche une mise à jour à chaque changement de langue

    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleSelect = (event) => {
        const selectedKey = event.target.value;
        if (selectedKey && !selectedOptions.find(option => option.key === selectedKey)) {
            const selectedOption = options.find(option => option.key === selectedKey);
            setSelectedOptions((prev) => [...prev, selectedOption]);
        }
    };

    const handleRemove = (key) => {
        setSelectedOptions((prev) => prev.filter(option => option.key !== key));
    };

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
    const handleChangeBox = (event) => {
        const { id, checked } = event.target;
        setCheckedItems({
            ...CheckedItems,
            [id]: checked
        })
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

    // Fonction qui permet d'envoyer les donnees stocker dans la variable data pour stocker les informations grace a axios
    const handleSubmit = (e) => {
        e.preventDefault();
        // Vérification des champs vide dans le formulaire
        const newErrors =
            Object.keys(dataErrors).reduce((acc, key) => {
                if (!dataErrors[key].trim()) acc[key] = 'Ce champ est requis';
                return acc;
            }, {});
        setErrors(newErrors);

        // Si des erreurs sont présentes, on défile vers le premier champ vide
        if (Object.keys(newErrors).length > 0) {
            const firstErrorField = Object.keys(newErrors)[0];
            fieldRefs[firstErrorField].current.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Envoi des données s'il n'y a pas d'erreurs
            axios.post(`${apiUrl}/api/enquete_satisfaction`, data, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    setIsPopVisible(true);
                    console.log(response);
                })
                .catch(err => console.log("Erreur lors de la sauvegarde des données:", err));
        }
    }

    // fonction pour fermer la popup
    const closePopUp = () => {
        setIsPopVisible(false);
        window.location.reload(); // Recharge la page
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
                <div className='header'
                    style={{
                        background: `url(${imageEnvol}) no-repeat center`,
                        backgroundSize: 'cover'
                    }}
                >
                    <div className='w-full h-full bg-red-500/15'>
                        <div className='content relative text-center z-10'>
                            <div className='float-left w-1/2 p-[30px_2px]'>
                                <img src={logoAfrijet} alt='logo Afrijet' />
                            </div>
                            <div className='customer_survey float-right w-1/2'>
                                <h1 className='text-white'>{t('enquete_satisfaction')}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <Fildariane sections={sections} />
            </div>
            <LanguageSelector />
            <form onSubmit={handleSubmit}>
                <section id={generateId(t('infos_generales'))}>
                    <div className='space'>
                        <br />
                    </div>
                    <div className='info-generales-info mx-auto w-[360px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('infos_generales')}</h2>
                    </div>
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.sexe ? 'p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">1. {t('sexe')} <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-2 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.sexe}
                                            checked={CheckedItems.homme}
                                            onClick={handleChangeBox}
                                            onChange={handleChange}
                                            disabled={CheckedItems.femme}
                                            id="homme"
                                            value="homme"
                                            name="sexe"
                                            type="checkbox"
                                            className={"h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-red-600"}
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
                                            onClick={handleChangeBox}
                                            onChange={handleChange}
                                            disabled={CheckedItems.homme}
                                            id="femme"
                                            value="femme"
                                            name="sexe"
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

                        </fieldset>
                    </div>
                    {errors.sexe && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.sexe}{")"}</small>}
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.num_billet ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">2. {t('numero_billet')} <span className='text-red-500'>*</span></legend>
                            <div class="mt-2">
                                <input
                                    ref={fieldRefs.num_billet}
                                    id="num_billet"
                                    name="num_billet"
                                    rows="3"
                                    placeholder='EX : PNR 269C54DA'
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-red-300 focus:ring-1 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6 bg-gray-200"
                                    onChange={handleChange}
                                >
                                </input>
                            </div>
                        </fieldset>
                    </div>
                    {errors.num_billet && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.num_billet}{")"}</small>}
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.nationalite ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <legend htmlFor="country" className="text-sm font-semibold leading-6 text-gray-900">
                            3. {t('nationalite')} <span className='text-red-500'>*</span>
                        </legend>
                        <div className="w-full mt-2">
                            <select
                                ref={fieldRefs.nationalite}
                                id="nationalite"
                                name="nationalite"
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
                    {errors.nationalite && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.nationalite}{")"}</small>}
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.depart ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <legend htmlFor="country" className="text-sm font-semibold leading-6 text-gray-900">
                            4. {t('ville_depart')} <span className='text-red-500'>*</span>
                        </legend>
                        <div className="w-full mt-2">
                            <select
                                ref={fieldRefs.depart}
                                id="depart"
                                name="depart"
                                className="p-2 w-full bg-gray-200 block rounded-md font-medium border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xl sm:text-sm sm:leading-6"
                                onChange={handleChange}
                            >
                                <option selected disabled>{t('selection_depart')}</option>
                                {
                                    destination.map((item) => (
                                        <option key={item.destination}>{item.destination}</option>
                                    ))
                                }

                            </select>
                        </div>
                    </div>
                    {errors.depart && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.depart}{")"}</small>}
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.destination ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <legend htmlFor="destination" className="text-sm font-semibold leading-6 text-gray-900">
                            5. {t('destination_envol')} <span className='text-red-500'>*</span>
                        </legend>
                        <div className="w-full mt-2">
                            <select
                                ref={fieldRefs.destination}
                                id="destination"
                                name="destination"
                                className="p-2 bg-gray-200 block w-full rounded-md font-medium border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xl sm:text-sm sm:leading-6"
                                onChange={handleChange}
                            >
                                <option selected disabled>{t('selection_destination')}</option>
                                {
                                    destination.map((item) => (
                                        <option key={item.destination}>{item.destination}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    {errors.destination && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.destination}{")"}</small>}
                </section>
                <section id={generateId(t('experience_enregistrement'))}>
                    <div className='space'>
                        <br />
                    </div>
                    <div className='info-generales mx-auto w-[360px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('experience_enregistrement')}</h2>
                    </div>
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.assistance_comptoire ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">6. {t('assistance_comptoire')} <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.assistance_comptoire}
                                            checked={CheckedItems.assistance_oui}
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.assistance_non}
                                            id="assistance_oui"
                                            value="Oui"
                                            name="assistance_comptoire"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="assistance_oui" className="font-medium text-gray-900">
                                            {t('oui')}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-x-3 mx-4 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.assistance_comptoire}
                                            checked={CheckedItems.assistance_non}
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.assistance_oui}
                                            id="assistance_non"
                                            value="Non"
                                            name="assistance_comptoire"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="assistance_non" className="font-medium text-gray-900">
                                            {t('non')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.assistance_comptoire && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.assistance_comptoire}{")"}</small>}
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.experience_comptoire ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">7. {t('experience_comptoire')} <span className='text-red-500'>*</span></legend>
                            <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                            <div>
                                <div className="mt-4 grid grid-cols-4">
                                    <div className="flex items-center mb-4">
                                        <input ref={fieldRefs.experience_comptoire} type="radio" id="note_acceuil_1" name="experience_comptoire" value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_acceuil_1" className="text-gray-700">1</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.experience_comptoire} id="note_acceuil_2" name="experience_comptoire" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_acceuil_2" className="text-gray-700">2</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.experience_comptoire} id="note_acceuil_3" name="experience_comptoire" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_acceuil_3" className="text-gray-700">3</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.experience_comptoire} id="note_acceuil_4" name="experience_comptoire" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_acceuil_4" className="text-gray-700">4</label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.experience_comptoire && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.experience_comptoire}{")"}</small>}
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.courtoisie_personnel_escale ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">8. {t('courtoisie_personnel')} <span className='text-red-500'>*</span></legend>
                            <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                            <div>
                                <div className="mt-4 grid grid-cols-4">
                                    <div className="flex items-center mb-4">
                                        <input ref={fieldRefs.courtoisie_personnel_escale} type="radio" id="note_courtoisie_1" name="courtoisie_personnel_escale" value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_courtoisie_1" className="text-gray-700">1</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.courtoisie_personnel_escale} id="note_courtoisie_2" name="courtoisie_personnel_escale" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_courtoisie_2" className="text-gray-700">2</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.courtoisie_personnel_escale} id="note_courtoisie_3" name="courtoisie_personnel_escale" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_courtoisie_3" className="text-gray-700">3</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.courtoisie_personnel_escale} id="note_courtoisie_4" name="courtoisie_personnel_escale" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_courtoisie_4" className="text-gray-700">4</label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.courtoisie_personnel_escale && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.courtoisie_personnel_escale}{")"}</small>}
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.difficulte ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">9. {t('difficulte')} <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.difficulte}
                                            checked={CheckedItems.difficulte_oui}
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.difficulte_non}
                                            id="difficulte_oui"
                                            value="Oui"
                                            name="difficulte"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="difficulte_oui" className="font-medium text-gray-900">
                                            {t('oui')}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-x-3 mx-4 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.difficulte}
                                            checked={CheckedItems.difficulte_non}
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.difficulte_oui}
                                            id="difficulte_non"
                                            value="Non"
                                            name="difficulte"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="difficulte_non" className="font-medium text-gray-900">
                                            {t('non')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.difficulte && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.difficulte}{")"}</small>}
                    {CheckedItems.difficulte_oui &&
                        <div>
                            <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.explication_difficulte ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                                <fieldset>
                                    <legend className="text-sm font-semibold leading-6 text-gray-900">{t('explication_difficulte')} <span className='text-red-500'>*</span></legend>
                                    <div className="w-full mt-2">
                                        <select
                                            ref={fieldRefs.explication_difficulte}
                                            id="explication_difficulte"
                                            name="explication_difficulte"
                                            className="p-2 bg-gray-200 block w-full rounded-md font-medium border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xl sm:text-sm sm:leading-6"
                                            onChange={handleChange}
                                        >
                                            <option selected disabled>{t('selection')}</option>
                                            <option>{t('Aimabilite')}</option>
                                            <option>{t('file_attente')}</option>
                                            <option>{t('documentation')}</option>
                                            <option>{t('probleme_technique')}</option>
                                            <option>{t('bagage_non_conforme')}</option>
                                            <option>{t('incomprehension')}</option>
                                            <option>{t('volume_bagage')}</option>
                                            <option>{t('langue')}</option>
                                            <option>{t('probleme_mobilite')}</option>
                                            <option>{t('manque_informations')}</option>
                                            <option>{t('autre')}</option>
                                        </select>
                                    </div>
                                </fieldset>
                            </div>
                            {errors.explication_difficulte && <p className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.explication_difficulte}{")"}</p>}
                        </div>
                    }
                </section>
                <section id={generateId(t('experience_vol'))}>
                    <div className='space'>
                        <br />
                    </div>
                    <div className='info-generales mx-auto w-[360px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('experience_vol')}</h2>
                    </div>
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.ponctualite ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">10. {t('horaire')} <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.ponctualite}
                                            checked={CheckedItems.horaire_oui}
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.horaire_non}
                                            id="horaire_oui"
                                            value="Oui"
                                            name="ponctualite"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="horaire_oui" className="font-medium text-gray-900">
                                            {t('oui')}
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-x-3 mx-4 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.ponctualite}
                                            checked={CheckedItems.horaire_non}
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.horaire_oui}
                                            id="horaire_non"
                                            value="Non"
                                            name="ponctualite"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="horaire_non" className="font-medium text-gray-900">
                                            {t('non')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.ponctualite && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.ponctualite}{")"}</small>}
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.courtoisie_personel_envol ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">11. {t('courtoisie_personnel_envol')} <span className='text-red-500'>*</span></legend>
                            <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                            <div className="mt-4 grid grid-cols-4">
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note1" name="courtoisie_personel_envol" value="1" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="note1" className="text-gray-700">1</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note2" name="courtoisie_personel_envol" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="note2" className="text-gray-700">2</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note3" name="courtoisie_personel_envol" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="note3" className="text-gray-700">3</label>
                                </div>
                                <div className="flex items-center mb-4">
                                    <input type="radio" id="note4" name="courtoisie_personel_envol" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="note4" className="text-gray-700">4</label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.courtoisie_personel_envol && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.courtoisie_personel_envol}{")"}</small>}
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.confort_siege ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">12. {t('confort_siege')} <span className='text-red-500'>*</span></legend>
                            <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                            <div>
                                <div className="mt-4 grid grid-cols-4">
                                    <div className="flex items-center mb-4">
                                        <input ref={fieldRefs.confort_siege} type="radio" id="note_confort_1" name="confort_siege" value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_confort_1" className="text-gray-700">1</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.confort_siege} id="note_confort_2" name="confort_siege" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_confort_2" className="text-gray-700">2</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.confort_siege} id="note_confort_3" name="confort_siege" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_confort_3" className="text-gray-700">3</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.confort_siege} id="note_confort_4" name="confort_siege" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_confort_4" className="text-gray-700">4</label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.confort_siege && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.confort_siege}{")"}</small>}
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.proprete ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">13. {t('proprete_envol')} <span className='text-red-500'>*</span></legend>
                            <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                            <div>
                                <div className="mt-4 grid grid-cols-4">
                                    <div className="flex items-center mb-4">
                                        <input ref={fieldRefs.proprete} type="radio" id="note_proprete_1" name="proprete" value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_proprete_1" className="text-gray-700">1</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.proprete} id="note_proprete_2" name="proprete" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_proprete_2" className="text-gray-700">2</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.proprete} id="note_proprete_3" name="proprete" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_proprete_3" className="text-gray-700">3</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.proprete} id="note_proprete_4" name="proprete" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_proprete_4" className="text-gray-700">4</label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.proprete && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.proprete}{")"}</small>}
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.experience_vol ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">14. {t('experience_globale')} <span className='text-red-500'>*</span></legend>
                            <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                            <div>
                                <div className="mt-4 grid grid-cols-4">
                                    <div className="flex items-center mb-4">
                                        <input ref={fieldRefs.experience_vol} type="radio" id="note_experience_1" name="experience_vol" value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_experience_1" className="text-gray-700">1</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.experience_vol} id="note_experience_2" name="experience_vol" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_experience_2" className="text-gray-700">2</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.experience_vol} id="note_experience_3" name="experience_vol" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_experience_3" className="text-gray-700">3</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.experience_vol} id="note_experience_4" name="experience_vol" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_experience_4" className="text-gray-700">4</label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.experience_vol && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.experience_vol}{")"}</small>}
                </section>
                <section id={generateId(t('services_afrijet'))}>
                    <div className='space'>
                        <br />
                    </div>
                    <div className='mx-auto w-[330px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('services_afrijet')}</h2>
                    </div>
                    <div className="mt-4 mx-4 border-b border-gray-900/10 pb-5">
                        <legend htmlFor="services" className="text-sm font-semibold leading-6 text-gray-900">
                            15. {t('note_service_afrijet')} <span className='text-red-500'>*</span>
                        </legend>
                        <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                        <div className="mt-2">
                            <select
                                ref={fieldRefs.selection_services}
                                id="services"
                                name="services"
                                className="p-2 bg-gray-200 block w-full rounded-md font-medium border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xl sm:text-sm sm:leading-6"
                                onChange={handleSelect}
                            >
                                <option value="" selected disabled>{t("selection")}</option>
                                {options.map(option => (
                                    <option
                                        key={option.key}
                                        value={option.key}
                                        disabled={selectedOptions.find(sel => sel.key === option.key)}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Div pour les options sélectionnées */}
                    <div className="">
                        {selectedOptions.map(option => (
                            <div
                                key={option.key}
                                className="mx-5 bg-white px-6 border-b border-gray-900/10 pb-2"
                            >
                                <fieldset>
                                    <legend className="text-sm font-semibold leading-6 text-gray-900 pt-4">{option.label} :</legend>
                                    <div className='flex'>
                                        <div className="w-full mt-4 grid grid-cols-4">
                                            <div className="flex items-center mb-4">
                                                <input type="radio" id={`${option.name}_1`} name={option.name} value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                                    onChange={handleChange}
                                                />
                                                <label htmlFor={`${option.name}_1`} className="text-gray-700">1</label>
                                            </div>
                                            <div className="flex items-center mb-4">
                                                <input type="radio" id={`${option.name}_2`} name={option.name} value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                                    onChange={handleChange}
                                                />
                                                <label htmlFor={`${option.name}_2`} className="text-gray-700">2</label>
                                            </div>
                                            <div className="flex items-center mb-4">
                                                <input type="radio" id={`${option.name}_3`} name={option.name} value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                                    onChange={handleChange}
                                                />
                                                <label htmlFor={`${option.name}_3`} className="text-gray-700">3</label>
                                            </div>
                                            <div className="flex items-center mb-4">
                                                <input type="radio" id={`${option.name}_4`} name={option.name} value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                                    onChange={handleChange}
                                                />
                                                <label htmlFor={`${option.name}_4`} className="text-gray-700">4</label>
                                            </div>
                                        </div>
                                        <i
                                            onClick={() => handleRemove(option.key)}
                                            className="mt-3 p-1 text-red-500 border border-red-500 h-6 rounded-full w-6 fa-solid fa-minus">
                                        </i>
                                    </div>
                                </fieldset>
                            </div>
                        ))}
                    </div>
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
                            <legend className="text-sm font-semibold leading-6 text-gray-900">16. {t('recommandation_afrijet')} <span className='text-red-500'>*</span></legend>
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
                                    <legend className="text-sm font-semibold leading-6 text-gray-900">13. {t('raison_recommandation1')} <span className='text-red-500'>*</span></legend>
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
                                            <option>{t('confort_envol')}</option>
                                            <option>{t('proprete')}</option>
                                            <option>{t('services_additionnels')}</option>
                                            <option>{t('gestion_probleme')}</option>
                                            <option>{t('experience_positive')}</option>
                                            <option>{t('experience_negative')}</option>
                                            <option>{t('qualite_prix')}</option>
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
                                    <legend className="text-sm font-semibold leading-6 text-gray-900">13. {t('raison_recommandation2')} <span className='text-red-500'>*</span></legend>
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
                                            <option>{t('billet_promo')}</option>
                                            <option>{t('couverture_regionale')}</option>
                                            <option>{t('disponibilite_place')}</option>
                                            <option>{t('frequence_vol')}</option>
                                            <option>{t('volume_bagage')}</option>
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

export default enqueteSatisfaction