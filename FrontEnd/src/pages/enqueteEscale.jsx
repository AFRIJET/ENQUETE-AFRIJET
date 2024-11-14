import React, { useEffect, useRef, useState } from 'react'
import '../styles/style.css'
import Fildariane from '../composants/fildariane'
import logoAfrijet from '../assets/images/logo.png';
import imageEscale from '../assets/images/afrijet-comptoire.jpg'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import country from '../composants/country.json'
import destination from '../composants/destination.json'
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const enqueteEscale = () => {

  const { t } = useTranslation()
  // Déclarations des sections
  const sections = [
    { label: t('infos_generales') },
    { label: t('experience_enregistrement') },
    { label: t('service_commodites') }
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
    escale: '',
    destination: '',
    assistance_comptoire: '',
    experience_comptoire: '',
    courtoisie_personnel: '',
    difficulte: '',
    explication_difficulte: '',
    note_salon_business: '',
    note_bagage: '',
    note_serviceUM: '',
    recommandation: '',
    raison_recommandation: ''
  })
  const fieldRefs = {
    sexe: useRef(null),
    num_billet: useRef(null),
    nationalite: useRef(null),
    escale: useRef(null),
    destination: useRef(null),
    assistance_comptoire: useRef(null),
    experience_comptoire: useRef(null),
    courtoisie_personnel: useRef(null),
    difficulte: useRef(null),
    explication_difficulte: useRef(null),
    recommandation: useRef(null),
    raison_recommandation: useRef(null),
  }
  const [CheckedItems, setCheckedItems] = useState({
    homme: false,
    femme: false,
    assistance_oui: false,
    assistance_non: false,
    difficulte_oui: false,
    difficulte_non: false,
    explication_difficulte: false,
    infos_oui: false,
    infos_non: false,
    recommandation_oui: false,
    recommandation_non: false,
  })

  const handleChange = (event) => {
    const { name, checked } = event.target
    setCheckedItems({
      ...CheckedItems,
      [name]: checked
    })
  }

  const generateId = (label) => {
    return label.toLowerCase();
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

  //Fonction pour fermer la popup
  const closePopup = () => {
    setIsPopVisible(false);
    setData({});
  }

  //Fonction qui permet de fermer la popup lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closePopup()
      }
    };

    if (isPopVisible) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isPopVisible]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(data).forEach((key) => {
      if (!data(key)) {
        newErrors[key] = 'Ce champ est requis';
      }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      fieldRefs[firstErrorField].current.scrollIntoView({ behavior: 'smooth' });
    } else {
      axios.post(`${apiUrl}/enquete_escale`, data, {
        headers: { 'Content-Type': 'application/json' }
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
            background: `url(${imageEscale}) no-repeat center`,
            backgroundSize: 'cover'
          }}
        >
          <div className='w-full h-full bg-red-500/15'>
            <div className='content relative text-center z-10'>
              <div className='float-left w-1/2 p-[30px_2px]'>
                <img src={logoAfrijet} alt='logo Afrijet' />
              </div>
              <div className='customer_survey float-right w-1/2'>
                <h1 className='text-white'>{t('enquete_escale')}</h1>
              </div>
            </div>
          </div>
        </div>
        <Fildariane sections={sections} />
      </div>
      <form onSubmit={handleSubmit}>
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
              {t('escale')}
            </label>
            <div className="w-full mt-2">
              <select
                ref={fieldRefs.escale}
                id="escale"
                name="escale"
                className="p-2 w-full bg-gray-200 block rounded-md font-medium border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:max-w-xl sm:text-sm sm:leading-6"
                onChange={(e) => setData({ ...data, escale: e.target.value })}
              >
                <option selected disabled>{t('selection_escale')}</option>
                {
                  destination.map((item) => (
                    <option key={item.escale}>{item.destination}</option>
                  ))
                }

              </select>
              {errors.escale && <p className="text-red-500 text-sm mt-1">{errors.escale}</p>}
            </div>
          </div>
          <div className="mx-5 mt-5 sm:col-span-3 border-b border-gray-900/10 pb-5">
            <label htmlFor="destination" className="text-sm font-semibold leading-6 text-gray-900">
              {t('destination_escale')}
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
        <section id={generateId(t('experience_enregistrement'))}>
          <div className='space'>
            <br />
          </div>
          <div className='info-generales mx-auto w-[360px] bg-brown-500 rounded-sm text-center'>
            <h2 className='text-white text-xl uppercase'>{t('experience_enregistrement')}</h2>
          </div>
          <div className="mt-4 mx-5 border-b border-gray-900/10 pb-5">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">{t('assistance_comptoire')}</legend>
              <div className="mt-2 grid grid-cols-2">
                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                  <div className="flex h-6 items-center">
                    <input
                      ref={fieldRefs.assistance_comptoire}
                      checked={CheckedItems.assistance_oui}
                      onClick={handleChange}
                      disabled={CheckedItems.assistance_non}
                      id="assistance_oui"
                      value="Oui"
                      name="assistance_oui"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      onChange={(e) => setData({ ...data, assistance_comptoire: e.target.value })}
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
                      onClick={handleChange}
                      disabled={CheckedItems.assistance_oui}
                      id="assistance_non"
                      value="Non"
                      name="assistance_non"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      onChange={(e) => setData({ ...data, assistance_comptoire: e.target.value })}
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="assistance_non" className="font-medium text-gray-900">
                      {t('non')}
                    </label>
                  </div>
                </div>
              </div>
              {errors.assistance_comptoire && <p className="text-red-500 text-sm mt-1">{errors.assistance_comptoire}</p>}
            </fieldset>
          </div>
          <div className="mt-4 mx-4 border-b border-gray-900/10 pb-3">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">{t('experience_comptoire')}</legend>
              <small className='text-xs text-gray-700'>{t('critere_note')}</small>
              <div>
                <div className="mt-4 grid grid-cols-4">
                  <div className="flex items-center mb-4">
                    <input ref={fieldRefs.experience_comptoire} type="radio" id="note_acceuil_1" name="note_acceuil" value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                      onChange={(e) => setData({ ...data, experience_comptoire: e.target.value })}
                    />
                    <label htmlFor="note_acceuil_1" className="text-gray-700">1</label>
                  </div>
                  <div className="flex items-center mb-4">
                    <input type="radio" ref={fieldRefs.experience_comptoire} id="note_acceuil_2" name="note_acceuil" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                      onChange={(e) => setData({ ...data, experience_comptoire: e.target.value })}
                    />
                    <label htmlFor="note_acceuil_2" className="text-gray-700">2</label>
                  </div>
                  <div className="flex items-center mb-4">
                    <input type="radio" ref={fieldRefs.experience_comptoire} id="note_acceuil_3" name="note_acceuil" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                      onChange={(e) => setData({ ...data, experience_comptoire: e.target.value })}
                    />
                    <label htmlFor="note_acceuil_3" className="text-gray-700">3</label>
                  </div>
                  <div className="flex items-center mb-4">
                    <input type="radio" ref={fieldRefs.experience_comptoire} id="note_acceuil_4" name="note_acceuil" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                      onChange={(e) => setData({ ...data, experience_comptoire: e.target.value })}
                    />
                    <label htmlFor="note_acceuil_4" className="text-gray-700">4</label>
                  </div>
                </div>
                {errors.experience_comptoire && <p className="text-red-500 text-sm mt-1">{errors.experience_comptoire}</p>}
              </div>
            </fieldset>
          </div>
          <div className="mt-4 mx-4 border-b border-gray-900/10 pb-3">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">{t('courtoisie_personnel')}</legend>
              <div>
                <div className="mt-4 grid grid-cols-4">
                  <div className="flex items-center mb-4">
                    <input ref={fieldRefs.courtoisie_personnel} type="radio" id="note_courtoisie_1" name="note_courtoisie" value="1" className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                      onChange={(e) => setData({ ...data, courtoisie_personnel: e.target.value })}
                    />
                    <label htmlFor="note_courtoisie_1" className="text-gray-700">1</label>
                  </div>
                  <div className="flex items-center mb-4">
                    <input type="radio" ref={fieldRefs.courtoisie_personnel} id="note_courtoisie_2" name="note_courtoisie" value="2" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                      onChange={(e) => setData({ ...data, courtoisie_personnel: e.target.value })}
                    />
                    <label htmlFor="note_courtoisie_2" className="text-gray-700">2</label>
                  </div>
                  <div className="flex items-center mb-4">
                    <input type="radio" ref={fieldRefs.courtoisie_personnel} id="note_courtoisie_3" name="note_courtoisie" value="3" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                      onChange={(e) => setData({ ...data, courtoisie_personnel: e.target.value })}
                    />
                    <label htmlFor="note_courtoisie_3" className="text-gray-700">3</label>
                  </div>
                  <div className="flex items-center mb-4">
                    <input type="radio" ref={fieldRefs.courtoisie_personnel} id="note_courtoisie_4" name="note_courtoisie" value="4" className="mr-2 w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                      onChange={(e) => setData({ ...data, courtoisie_personnel: e.target.value })}
                    />
                    <label htmlFor="note_courtoisie_4" className="text-gray-700">4</label>
                  </div>
                </div>
                {errors.courtoisie_personnel && <p className="text-red-500 text-sm mt-1">{errors.courtoisie_personnel}</p>}
              </div>
            </fieldset>
          </div>
          <div className="mt-4 mx-5 border-b border-gray-900/10 pb-5">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">{t('difficulte')}</legend>
              <div className="mt-2 grid grid-cols-2">
                <div className="flex gap-x-3 p-3 bg-gray-200 rounded">
                  <div className="flex h-6 items-center">
                    <input
                      ref={fieldRefs.difficulte}
                      checked={CheckedItems.difficulte_oui}
                      onClick={handleChange}
                      disabled={CheckedItems.difficulte_non}
                      id="difficulte_oui"
                      value="Oui"
                      name="difficulte_oui"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      onChange={(e) => setData({ ...data, difficulte: e.target.value })}
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
                      onClick={handleChange}
                      disabled={CheckedItems.difficulte_oui}
                      id="difficulte_non"
                      value="Non"
                      name="difficulte_non"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      onChange={(e) => setData({ ...data, difficulte: e.target.value })}
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="difficulte_non" className="font-medium text-gray-900">
                      {t('non')}
                    </label>
                  </div>
                </div>
              </div>
              {errors.difficulte && <p className="text-red-500 text-sm mt-1">{errors.difficulte}</p>}
            </fieldset>
          </div>
          <div className="mt-4 mx-4 border-b border-gray-900/10 pb-5">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">{t('explication_difficulte')}</legend>
              <div className="mt-2">
                <textarea
                  ref={fieldRefs.explication_difficulte}
                  id="explication_difficulte"
                  name="explication_difficulte"
                  rows="3"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-red-300 focus:ring-1 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6 bg-gray-200"
                  onChange={(e) => setData({ ...data, explication_difficulte: e.target.value })}
                >

                </textarea>
              </div>
              {errors.explication_difficulte && <p className="text-red-500 text-sm mt-1">{errors.explication_difficulte}</p>}
            </fieldset>
          </div>
        </section>
        <section id={generateId(t('service_commodites'))}>
          <div className='space'>
            <br />
          </div>
          <div className='info-generales mx-auto w-[360px] bg-brown-500 rounded-sm text-center'>
            <h2 className='text-white text-xl uppercase'>{t('service_commodites')}</h2>
          </div>
          <div className='mt-4 mx-5'>
            <p className='mt-8'>{t('note_service')}</p>
            <small className='text-xs text-gray-700'>{t('critere_note')}</small>
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

export default enqueteEscale