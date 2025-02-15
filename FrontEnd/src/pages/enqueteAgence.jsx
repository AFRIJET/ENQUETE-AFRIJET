import React, { useEffect, useRef, useState } from 'react'
import '../styles/style.css'
import logoAfrijet from '../assets/images/logo.png';
import logoFlygabon from '../assets/images/Logo-FG1.png'
import imageAgence from '../assets/images/afrijet-agence.jpg'
import axios from 'axios'
import country from '../composants/country.json';
import destination from '../composants/destination.json'
import agence from '../composants/agence.json'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../composants/languageSelector';

const apiUrl = import.meta.env.VITE_API_URL;

const AgencySurvey = () => {

    const { t, i18n } = useTranslation()
    const sections = [
        { label: t('infos_generales') },
        { label: t('enquete_agence') },
        { label: t('services_afrijet') },
    ];
    const [isPopVisible, setIsPopVisible] = useState(false); // Declaration de la variable pour la popUp
    const popupRef = useRef(null)
    const date = new Date();
    const [selectedCheckbox, setSelectedCheckbox] = useState(null); // État pour la sélection de la checkbox

    // Initialisation de l'etat de ma variable data grace au hook UseState pour recuperer les donnees entrees par les utilisateurs
    const [data, setData] = useState({
        date: date,
        pays: "",
    })
    const initialErrors = {
        sexe: "",
        nationalite: "",
        destination: "",
        agence: "",
        acceuil_agence: "",
        raison_agence: "",
        satisfaction_agent: "",
        temps_attente: "",
        satisfaction_client: "",
        recommandation: "",
        raison_recommandation: ""
    };
    const [errors, setErrors] = useState(initialErrors)
    const [dataErrors, setDataErrors] = useState(initialErrors)

    // Références pour chaque champ
    const fieldRefs =
        Object.keys(initialErrors).reduce((acc, key) => {
            acc[key] = useRef(null);
            return acc;
        }, {});

    const [options, setOptions] = useState([
        { key: "programme_fidelite", label: t("programme_fidelite"), name: "programme_fidelite" },
        { key: "salon_business", label: t("salon_business"), name: "salon_business" },
        { key: "bagage_supplementaire", label: t("bagage_supplementaire"), name: "bagage_supplementaire" },
        { key: "service_um", label: t("service_um"), name: "service_um" },
        { key: "animal_cabine", label: t("animal_cabine"), name: "animal_cabine" },
        { key: "animal_soute", label: t("animal_soute"), name: "animal_soute" },
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
            if (name === 'agence') {
                const agenceTrouvee = agence.find((item) => item.agence === value);
                const paysTrouvee = agenceTrouvee ? agenceTrouvee.country : '';  // Récupère le pays associé
                data.pays = paysTrouvee
            }
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
            axios.post(`${apiUrl}/api/enquete_agence`, data, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    setIsPopVisible(true);
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

    console.log(data)

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
                        background: `url(${imageAgence}) no-repeat`,
                        backgroundSize: 'cover'
                    }}
                >
                    <div className='w-full h-full bg-white-500/10'>
                        <div className='content relative text-center z-10'>
                            <div className='float-left w-1/2 p-[5vh_2px]'>
                                <img src={logoAfrijet} alt='logo Afrijet' />
                            </div>
                            <div className='float-right w-1/2 p-[3vh_2px]'>
                                <img src={logoFlygabon} alt='logo Afrijet' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <LanguageSelector />
            <form onSubmit={handleSubmit}>
                <section id={generateId(t('infos_generales'))}>
                    <div className='space'>
                        <br />
                    </div>
                    <div className='info-generales-info mx-auto w-[330px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('infos_generales')}</h2>
                    </div>
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.sexe ? 'p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">1. {t('sexe')} ? <span className='text-red-500'>*</span></legend>
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
                    <div className='mt-4 mx-4 border-b border-gray-900/10 pb-5'>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">2. {t('numero_billet')}</legend>
                            <div class="mt-2">
                                <input
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
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.destination ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <legend htmlFor="destination" className="text-sm font-semibold leading-6 text-gray-900">
                            4. {t('destination')} <span className='text-red-500'>*</span>
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
                <section id={generateId(t('enquete_agence'))}>
                    <div className='bg-white'>
                        <br />
                    </div>
                    <div className='mx-auto w-[330px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('enquete_agence')}</h2>
                    </div>
                    <div className={`mx-5 mt-5 sm:col-span-3 border-b border-gray-900/10 pb-5 ${errors.agence ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <legend htmlFor="agence" className="text-sm font-semibold leading-6 text-gray-900">
                            5. {t('agence_afrijet')} <span className='text-red-500'>*</span>
                        </legend>
                        <div className="w-full mt-2">
                            <select
                                ref={fieldRefs.agence}
                                id="agence"
                                name="agence"
                                className="p-2 bg-gray-200 block w-full rounded-md font-medium border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xl sm:text-sm sm:leading-6"
                                onChange={handleChange}
                            >
                                <option selected disabled>{t('selection_agence')}</option>
                                {
                                    agence.map((item) => (
                                        <option key={item.agence}>{item.agence}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    {errors.agence && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.agence}{")"}</small>}
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.acceuil_agence ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">6. {t('acceuil_agence')} <span className='text-red-500'>*</span></legend>
                            <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                            <div>
                                <div className="mt-4 grid grid-cols-5">
                                    <div className="flex items-center mb-4">
                                        <input ref={fieldRefs.acceuil_agence} type="radio" id="note_acceuil_1" name="acceuil_agence" value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_acceuil_1" className="text-gray-700">1</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.acceuil_agence} id="note_acceuil_2" name="acceuil_agence" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_acceuil_2" className="text-gray-700">2</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.acceuil_agence} id="note_acceuil_3" name="acceuil_agence" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_acceuil_3" className="text-gray-700">3</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.acceuil_agence} id="note_acceuil_4" name="acceuil_agence" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_acceuil_4" className="text-gray-700">4</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.acceuil_agence} id="note_acceuil_5" name="acceuil_agence" value="5" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_acceuil_5" className="text-gray-700">5</label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.acceuil_agence && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.acceuil_agence}{")"}</small>}
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.raison_agence ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">7. {t('raison_agence')} <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-2 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.raison_agence}
                                            id="proche_de_chez_moi"
                                            value="proche de chez moi"
                                            name="raison_agence"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
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
                                            name="raison_agence"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
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
                                            name="raison_agence"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
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
                                            name="raison_agence"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
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
                    </div>
                    {errors.raison_agence && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.raison_agence}{")"}</small>}
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.satisfaction_agent ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">8. {t('satisfaction_agent')} <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.satisfaction_agent}
                                            checked={CheckedItems.attente_oui}
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.attente_non}
                                            id="attente_oui"
                                            value="attente satisfait"
                                            name="satisfaction_agent"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
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
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.attente_oui}
                                            id="attente_non"
                                            value="attente non satisfait"
                                            name="satisfaction_agent"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="attente_non" className="font-medium text-gray-900">
                                            {t('non')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.satisfaction_agent && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.satisfaction_agent}{")"}</small>}
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.temps_attente ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">9. {t('temps_attente')} ? <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                                    <div className="flex h-6 items-center">
                                        <input
                                            ref={fieldRefs.temps_attente}
                                            checked={CheckedItems.Entre_5minutes}
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.plus_15minutes}
                                            id="Entre_5minutes"
                                            value="entre 5 et 15 minutes"
                                            name="temps_attente"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
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
                                            onClick={handleChangeBox}
                                            disabled={CheckedItems.Entre_5minutes}
                                            id="plus_15minutes"
                                            value="plus de 15 minutes"
                                            name="temps_attente"
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="text-sm leading-6">
                                        <label htmlFor="plus_15minutes" className="font-medium text-gray-900">
                                            {t('plus_15_minutes')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.temps_attente && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.temps_attente}{")"}</small>}
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.satisfaction_client ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">
                                10. {t('satisfaction_client')} <span className='text-red-500'>*</span>
                            </legend>
                            <small className='text-xs text-gray-700'>{t('type_satisfaction')}</small><br />
                            <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                            <div>
                                <div className="mt-4 grid grid-cols-5">
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.satisfaction_client} id="note_satisfaction_1" name="satisfaction_client" value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_satisfaction_1" className="text-gray-700">1</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.satisfaction_client} id="note_satisfaction_2" name="satisfaction_client" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_satisfaction_2" className="text-gray-700">2</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.satisfaction_client} id="note_satisfaction_3" name="satisfaction_client" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_satisfaction_3" className="text-gray-700">3</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.satisfaction_client} id="note_satisfaction_4" name="satisfaction_client" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_satisfaction_4" className="text-gray-700">4</label>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <input type="radio" ref={fieldRefs.satisfaction_client} id="note_satisfaction_5" name="satisfaction_client" value="5" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="note_satisfaction_5" className="text-gray-700">5</label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {errors.satisfaction_client && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.satisfaction_client}{")"}</small>}
                </section>
                <section id={generateId(t('services_afrijet'))}>
                    <div className='space'>
                        <br />
                    </div>
                    <div className='mx-auto w-[330px] bg-brown-500 rounded-sm text-center'>
                        <h2 className='text-white text-xl uppercase'>{t('services_afrijet')}</h2>
                    </div>
                    <div className='mx-5'>
                        <p className='mt-6'>{t('note_explication')}</p>
                        <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                    </div>
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5 ${errors.selection_services ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <legend htmlFor="services" className="text-sm font-semibold leading-6 text-gray-900">
                            11. {t('selection_services')} <span className='text-red-500'>*</span>
                        </legend>
                        <div className="mt-2">
                            <select
                                ref={fieldRefs.selection_services}
                                id="services"
                                name="services"
                                className="p-2 bg-gray-200 block w-full rounded-md font-medium border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xl sm:text-sm sm:leading-6"
                                onChange={handleSelect}
                            >
                                <option value="" selected disabled>{t("selection_plus")}</option>
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
                    {errors.selection_services && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.selection_services}{")"}</small>}
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
                                        <div className="w-full mt-4 grid grid-cols-5">
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
                                            <div className="flex items-center mb-4">
                                                <input type="radio" id={`${option.name}_5`} name={option.name} value="5" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                                                    onChange={handleChange}
                                                />
                                                <label htmlFor={`${option.name}_5`} className="text-gray-700">5</label>
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
                            <legend className="text-sm font-semibold leading-6 text-gray-900">12. {t('recommandation_afrijet')} <span className='text-red-500'>*</span></legend>
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
        </motion.div >
    )
}

export default AgencySurvey