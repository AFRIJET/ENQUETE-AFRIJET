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
import NotesQuestion from '../composants/notesQuestion';
import Notes from '../composants/notes';
import Reponse from '../composants/Reponse';
import Section from '../composants/section';
import BtnValider from '../composants/btnValider';
import Feedback from '../composants/feedback';

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

    const recommandations = [
        { label: t('Aimabilite') },
        { label: t('Bon_acceuil') },
        { label: t('billet_promo') },
        { label: t('couverture_regionale') },
        { label: t('disponibilite_place') },
        { label: t('frequence_vol') },
        { label: t('volume_bagage') },
        { label: t('prix_billet') },
        { label: t('autre') },
    ]

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

    const handleRemove = (key, name) => {
        setSelectedOptions((prev) => prev.filter(option => option.key !== key));
        setData((prev) => {
            const { [name]: _, ...rest } = prev;
            return rest;
        });
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
        entre_5minutes: false,
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
                [value]: checked
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
                .catch();
        }
    }

    /* fonction pour fermer la popup
    const closePopUp = () => {
        setIsPopVisible(false);
        window.location.reload(); // Recharge la page
    }
    */

    /* useEffect(() => {
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
    */

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
                <Section style={"info-generales-info"} section={generateId(t('infos_generales'))} name={t('infos_generales')}>
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.sexe ? 'p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">1. {t('sexe')} ? <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <Reponse
                                    checked={CheckedItems.homme}
                                    disabled={CheckedItems.femme}
                                    value={"homme"}
                                    name={"sexe"}
                                    id={"homme"}
                                    onChange={handleChange}
                                    onClick={handleChangeBox}
                                    option={t('homme')}
                                    ref={fieldRefs.sexe}
                                />
                                <Reponse
                                    checked={CheckedItems.femme}
                                    disabled={CheckedItems.homme}
                                    value={"femme"}
                                    id={"femme"}
                                    name={"sexe"}
                                    onChange={handleChange}
                                    onClick={handleChangeBox}
                                    option={t('femme')}
                                    ref={fieldRefs.sexe}
                                    style={"mx-4"}
                                />
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
                </Section>
                <Section name={t('enquete_agence')} section={generateId(t('enquete_agence'))}>
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
                        <NotesQuestion
                            handleChange={handleChange}
                            num={6}
                            name={"acceuil_agence"}
                            question={t('acceuil_agence')}
                            ref={fieldRefs.acceuil_agence}
                            label={'note_acceuil'}
                        />
                    </div>
                    {errors.acceuil_agence && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.acceuil_agence}{")"}</small>}
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.raison_agence ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">7. {t('raison_agence')} <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <Reponse
                                    ref={fieldRefs.raison_agence}
                                    value={"proche de chez moi"}
                                    id={"proche_de_chez_moi"}
                                    name={"raison_agence"}
                                    onChange={handleChange}
                                    checked={selectedCheckbox === "proche de chez moi"}
                                    onClick={handleCheckboxChange}
                                    option={t('proche_de_chez_moi')}
                                />
                                <Reponse
                                    style={"mx-4"}
                                    ref={fieldRefs.raison_agence}
                                    value={"pour plus de conseils"}
                                    id={"pour_plus_de_conseils"}
                                    name={"raison_agence"}
                                    onChange={handleChange}
                                    checked={selectedCheckbox === "pour plus de conseils"}
                                    onClick={handleCheckboxChange}
                                    option={t('plus_conseils')}
                                />
                            </div>
                            <div className="mt-2 grid grid-cols-2">
                                <Reponse
                                    ref={fieldRefs.raison_agence}
                                    value={"site web"}
                                    id={"site_web"}
                                    name={"raison_agence"}
                                    onChange={handleChange}
                                    onClick={handleCheckboxChange}
                                    checked={selectedCheckbox === "site web"}
                                    option={t('site_web')}
                                />
                                <Reponse
                                    style={"mx-4"}
                                    ref={fieldRefs.raison_agence}
                                    value={"paiement facile"}
                                    id={"paiement_facile"}
                                    name={"raison_agence"}
                                    onChange={handleChange}
                                    onClick={handleCheckboxChange}
                                    checked={selectedCheckbox === "paiement facile"}
                                    option={t('paiement_facile')}
                                />
                            </div>
                        </fieldset>
                    </div>
                    {errors.raison_agence && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.raison_agence}{")"}</small>}
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.satisfaction_agent ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">8. {t('satisfaction_agent')} <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <Reponse
                                    ref={fieldRefs.satisfaction_agent}
                                    checked={CheckedItems.attente_oui}
                                    disabled={CheckedItems.attente_non}
                                    id={"attente_oui"}
                                    value={"Oui"}
                                    name={"satisfaction_agent"}
                                    onChange={handleChange}
                                    onClick={handleChangeBox}
                                    option={t('oui')}
                                />
                                <Reponse
                                    style={"mx-4"}
                                    ref={fieldRefs.satisfaction_agent}
                                    checked={CheckedItems.attente_non}
                                    disabled={CheckedItems.attente_oui}
                                    onChange={handleChange}
                                    onClick={handleChangeBox}
                                    value={"Non"}
                                    id={"attente_non"}
                                    name={"satisfaction_agent"}
                                    option={t('non')}
                                />
                            </div>
                        </fieldset>
                    </div>
                    {errors.satisfaction_agent && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.satisfaction_agent}{")"}</small>}
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.temps_attente ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">9. {t('temps_attente')} ? <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <Reponse
                                    ref={fieldRefs.temps_attente}
                                    checked={CheckedItems.entre_5minutes}
                                    disabled={CheckedItems.plus_15minutes}
                                    value={"entre 5 et 15 minutes"}
                                    id={"entre_5minutes"}
                                    name={"temps_attente"}
                                    onChange={handleChange}
                                    onClick={handleChangeBox}
                                    option={t('entre_5_15_minutes')}
                                />
                                <Reponse
                                    style={"mx-4"}
                                    ref={fieldRefs.temps_attente}
                                    checked={CheckedItems.plus_15minutes}
                                    disabled={CheckedItems.entre_5minutes}
                                    value={"plus de 15 minutes"}
                                    id={"plus_15minutes"}
                                    name={"temps_attente"}
                                    onChange={handleChange}
                                    onClick={handleChangeBox}
                                    option={t('plus_15_minutes')}
                                />
                            </div>
                        </fieldset>
                    </div>
                    {errors.temps_attente && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.temps_attente}{")"}</small>}
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.satisfaction_client ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <NotesQuestion
                            handleChange={handleChange}
                            num={10}
                            name={"satisfaction_client"}
                            question={t('satisfaction_client')}
                            ref={fieldRefs.satisfaction_client}
                            label={'note_satisfaction'}
                        />
                    </div>
                    {errors.satisfaction_client && <small className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.satisfaction_client}{")"}</small>}
                </Section>
                <Section name={t('services_afrijet')} section={generateId(t('services_afrijet'))}>
                    <div className='mx-5'>
                        <p className='mt-6'>{t('note_explication')}</p>
                        <small className='text-xs text-gray-700'>{t('critere_note')}</small>
                    </div>
                    <div className={`mt-4 mx-4 border-b border-gray-900/10 pb-5`}>
                        <legend htmlFor="services" className="text-sm font-semibold leading-6 text-gray-900">
                            11. {t('selection_services')} <span className='text-red-500'>*</span>
                        </legend>
                        <div className="mt-2">
                            <select
                                ref={fieldRefs.selection_services}
                                id="services"
                                name="selection_services"
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
                                        <Notes style={"w-full"} handleChange={handleChange} name={option.name} label={option.name} />
                                        <i
                                            onClick={() => handleRemove(option.key, option.name)}
                                            className="mt-3 p-1 text-red-500 border border-red-500 h-6 rounded-full w-6 fa-solid fa-minus">
                                        </i>
                                    </div>
                                </fieldset>
                            </div>
                        ))}
                    </div>
                </Section>
                <Section name={t('recommandation')} section={generateId(t('recommandation'))}>
                    <div className={`mt-4 mx-5 border-b border-gray-900/10 pb-5 ${errors.recommandation ? 'mt-2 p-2 rounded-lg border-2 border-red-500' : ''}`}>
                        <fieldset>
                            <legend className="text-sm font-semibold leading-6 text-gray-900">12. {t('recommandation_afrijet')} <span className='text-red-500'>*</span></legend>
                            <div className="mt-2 grid grid-cols-2">
                                <Reponse
                                    ref={fieldRefs.recommandation}
                                    checked={CheckedItems.recommandation_oui}
                                    disabled={CheckedItems.recommandation_non}
                                    value={"Oui"}
                                    id={"recommandation_oui"}
                                    name={"recommandation"}
                                    onChange={handleChange}
                                    onClick={handleChangeBox}
                                    option={t('oui')}
                                />
                                <Reponse
                                    style={"mx-4"}
                                    ref={fieldRefs.recommandation}
                                    checked={CheckedItems.recommandation_non}
                                    disabled={CheckedItems.recommandation_oui}
                                    value={"Non"}
                                    id={"recommandation_non"}
                                    name={"recommandation"}
                                    onChange={handleChange}
                                    onClick={handleChangeBox}
                                    option={t('non')}
                                />
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
                                            {recommandations.map((recommandation) =>
                                                <option key={recommandation.label}>{recommandation.label}</option>
                                            )}
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
                                            {recommandations.map((recommandation) =>
                                                <option key={recommandation.label}>{recommandation.label}</option>
                                            )}
                                        </select>
                                    </div>
                                </fieldset>
                            </div>
                            {errors.raison_recommandation && <p className="text-brown-500 text-sm mt-1 mx-5">{"("}{errors.raison_recommandation}{")"}</p>}
                        </div>
                    }
                </Section>
                <BtnValider />
            </form>


            <AnimatePresence>
                {isPopVisible && (
                    <Feedback ref={popupRef} />
                )}
            </AnimatePresence>
        </motion.div >
    )
}

export default AgencySurvey