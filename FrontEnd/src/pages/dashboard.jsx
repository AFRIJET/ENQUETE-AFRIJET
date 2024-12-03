import React, { useEffect, useRef, useState } from 'react'
import '../styles/styleAdmin.css'
import logoAfrijet from '../assets/images/Logo-SF.png'
import logoFlygabon from '../assets/images/Logo-FG2.png'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from "../composants/authContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'

const apiUrl = import.meta.env.VITE_API_URL;

const dashboard = () => {
  const { logout } = useAuth(); //Fonction de déconnexion
  const popupRefProfil = useRef(null)
  const popupRef = useRef(null)
  const [user, setUser] = useState(null); // État pour l'utilisateur
  const [isProfilOpen, setIsProfilOpen] = useState(false)
  const [profil, setProfil] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [data, setData] = useState({})
  const [update, setUpdate] = useState("")
  const [isAdmin, setIsAdmin] = useState(false) // Vérification du role de l'utilisateur Admin ou pas
  // Etat pour gérer l'intervalle de temps pour télécharger un rapport
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    // Enregistrer les dates dans sessionStorage
    if (start && end) {
      sessionStorage.setItem(
        "selectedDateRange",
        JSON.stringify({ startDate: start.toISOString().split("T")[0], endDate: end.toISOString().split("T")[0] })
      );
    }
  };
  useEffect(() => {
    // Récupère l'utilisateur sauvegardé dans le localStorage
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      console.warn("Aucun utilisateur connecté.");
    }
  }, []); // Exécuté une seule fois après le montage du composant
  // Fonction qui permet de faire la vérification de l
  useEffect(() => {
    if (!user) {
      console.warn("Le nom d'utilisateur n'est pas défini.");
      return; // Stoppe l'exécution si nameUser est undefined
    }
    axios.get(`${apiUrl}/admin/admin`, {
      params: {
        utilisateur: user.utilisateur // Nom d'utilisateur à vérifier
      }
    })
      .then((response) => {
        if (response.data.isAdmin) {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }

      })
      .catch(error => {
        console.error('Erreur:', error.response?.data?.message || error.message);
      });
  })
  const [activeIndex, setActiveIndex] = useState(null); // Stocke l'index de l'élément actif
  const [expandedIndex, setExpandedIndex] = useState(null); // Stocke l'index des éléments à agrandir

  const menuItems = [
    { to: "", icon: "fa-gauge", label: "Tableau de bord" },
    {
      icon: "fa-square-poll-vertical",
      label: "Gestion des enquêtes",
      subItems: [
        { to: "/admin/dashboard/enqueteagence", label: "Enquête en Agence" },
        { to: "/admin/dashboard/enquetesatisfaction", label: "Enquête de Satisfaction" },
        { to: "/admin/dashboard/enquetecorporate", label: "Enquête Corporate" },
      ],
    },
    ...(isAdmin
      ? [{ to: "/admin/dashboard/users", icon: "fa-users", label: "Utilisateurs" }]
      : []),
  ];

  const handleItemClick = (index) => {
    setActiveIndex(index); // Met à jour l'élément actif
    if (expandedIndex === index) {
      setExpandedIndex(null); // Réduire si déjà agrandi
    } else {
      setExpandedIndex(index); // Agrandir si ce n'était pas déjà le cas
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    })
  }
  // Ferme la popup si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (popupRefProfil.current && !popupRefProfil.current.contains(event.target)) {
          setIsProfilOpen(!isProfilOpen)
        }
    };

    if (isProfilOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    } else {
        document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, [isProfilOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      console.log("Erreur : ID utilisateur introuvable dans sessionStorage");
      return;
    }
    axios.put(`${apiUrl}/admin/update_profil`, {
      id: user.id, // Identifiant utilisateur
      ...data // Nouvelles données à mettre à jour
    })
      .then((response) => {
        setShowPopup(true)
        setProfil(false)
        setUpdate(response.data.message)
      })
      .catch(error => console.log('Erreur:', error))
  }
  // fonction pour fermer la popup
  const closePopUp = () => {
    setShowPopup(false);
    logout();
  }

  const handleLogout = () => {
    logout();
  }

  return (
    <div className='bg-gray-100'>
      <div className='flex row'>
        <div className='bg-white sm:w-[370px] border h-screen nav'>
          {/*Image d'entete */}
          <div className='inline-flex border-b border-b-4 border-brown-500'>
            <img
              src={logoAfrijet}
              alt='Logo afrijet'
              className='pb-8 pt-5 w-40 h-20 logo-flygabon'
            />
            <img
              src={logoFlygabon}
              alt='Logo flygabon'
              className='pb-8 pt-3 w-40 h-20 logo-flygabon'
            />
          </div>

          {/* Nav Bar Section */}
          <ul className="mt-6">
            {menuItems.map((item, index) => (
              <li key={index} className="mx-4 mt-6">
                <Link to={item.to} className={`p-2 w-full block hover:bg-red-100 hover:rounded-lg ${activeIndex === index ? "bg-red-200 rounded-lg" : ""
                  }`}
                  onClick={() => handleItemClick(index)}>
                  <i className={`fa-solid ${item.icon || ""} text-lg text-gray-700`}></i>
                  <span className="text-lg mx-2 nav-text">{item.label}</span>
                  {item.subItems && (
                    <i
                      className={`fa-solid nav-text ${expandedIndex === index ? "fa-caret-up" : "fa-caret-down"
                        } text-lg text-gray-700 mx-2`}
                    ></i>
                  )}
                </Link>

                {/* Affichage des sous-éléments si agrandi */}
                {item.subItems && expandedIndex === index && (
                  <ul className="mt-2 sm:ml-6 space-y-2">
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex} className="p-2 hover:bg-red-100 hover:rounded-lg">
                        <Link to={subItem.to} className="text-gray-700 text-sm">
                          <span className="text-sm sm:mx-2">{subItem.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className='w-screen'>
          <div className='inline-flex bg-white border-b border-b-4 border-brown-500 h-[85px] w-full'>
            <div className='flex justify-between items-center w-full px-5 mb-3'>
              {/* Filtre Section */}
              <div className='flex items-center border rounded px-2 py-2 space-x-3' onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                {startDate && endDate ? (
                  <span className='text-sm space-x-2'>
                    Du {" "}
                    <span className="text-sm">{startDate.toLocaleDateString()}</span> -{" "}
                    <span className="text-sm">{endDate.toLocaleDateString()}</span>
                    <i class="fa-solid fa-angle-down text-sm"></i>
                  </span>
                ) : (
                  <div className='space-x-3'>
                    <i class="fa-solid fa-calendar-days text-sm"></i>
                    <span className='text-sm nav-text'>
                      Sélectionnez un intervalle de temps pour filtrer
                    </span>
                    <i class="fa-solid fa-angle-down text-sm nav-text"></i>
                  </div>
                )}
              </div>
              {/* Calendrier */}
              {isCalendarOpen && (
                <div className="fixed top-[60px] mt-2 bg-white border rounded shadow-lg z-10">
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                  />
                </div>
              )}

              {/* User Section */}
              <div className='flex items-center space-x-3 mb-2'>
                <div className=''>
                  <i class="fa-solid fa-lock mr-3 text-lg text-gray-700 cursor-pointer" onClick={handleLogout}></i>
                  <i class="fa-regular fa-circle-question mx-2 text-lg text-green-700"></i>
                </div>
                <div className='flex cursor-pointer' onClick={() => setIsProfilOpen(!isProfilOpen)}>
                  <p className='text-lg mr-4'>{user?.utilisateur}</p>
                  <i className='fa-solid fa-circle-user text-2xl text-gray-700'></i>
                </div>
              </div>
              {isProfilOpen && (
                <div ref={popupRefProfil} className='fixed top-[50px] right-[25px] p-3 mt-2 bg-white border rounded-lg shadow-lg z-10'>
                  <div className='flex'>
                    <div>
                      <i className='fa-solid fa-circle-user text-3xl mt-2 text-gray-700'></i>
                    </div>
                    <div className='grid-cols-2 mx-2'>
                      <p>{user?.utilisateur}</p>
                      <p className='text-gray-400'>{user?.role}</p>
                    </div>
                  </div>
                  <div className='flex space-x-4'>
                    <motion.div
                      whileHover={{ scale: 1.1, backgroundColor: 'rgb(229, 231, 235)', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}
                      whileTap={{ scale: 0.95, backgroundColor: 'rgb(229, 231, 235)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="btn-valider bg-gray-200 text-sm mx-1 mt-6 flex items-center border rounded text-black py-1 px-4 hover:bg-gray-200 cursor-pointer"
                      onClick={() => { setProfil(!profil), setIsProfilOpen(!isProfilOpen) }}
                    >
                      <span className='text-sm'>Modifier mon profil</span>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
            <AnimatePresence>
              {profil && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}>
                  <motion.div
                    initial={{ y: -30 }}
                    animate={{ y: 0 }}
                    exit={{ y: -30 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white w-[375px] p-4 rounded-lg shadow-lg">
                      <h3 className="text-lg font-semibold mb-4 mx-2 mt-2"><i className="fa-solid fa-circle-user mr-2"></i>Modifier mon profil</h3>
                      <div className='col'>
                        <label htmlFor="inputUser" className='mx-1 font-semibold text-sm'>
                          Nom d'utilisateur <span className='text-red-500'>*</span>
                        </label>
                        <input type='text'
                          id='inputUser'
                          name='utilisateur'
                          defaultValue={user?.utilisateur}
                          required
                          className='border p-1 mt-2.5 w-80 rounded-lg'
                          onChange={handleChange}
                        />
                      </div>

                      <div className='col mt-4'>
                        <label htmlFor="inputPassword" className='mx-1 font-semibold text-sm'>
                          Nouveau mot de passe <span className='text-red-500'>*</span>
                        </label>
                        <div className='flex'>
                          <input type="password"
                            id='inputPassword'
                            name="password"
                            required
                            className='border p-1 mt-2 w-80 rounded-lg'
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className='flex space-x-20 w-full mx-2 mb-3'>
                        <motion.div
                          whileHover={{ scale: 1.1, backgroundColor: 'rgb(229, 231, 235)', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}
                          whileTap={{ scale: 0.95, backgroundColor: 'rgb(229, 231, 235)' }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className="btn-valider bg-gray-200 text-sm mx-1 mt-5 flex items-center border rounded text-black py-1 px-4 hover:bg-gray-200 cursor-pointer"
                          onClick={() => setProfil(!profil)}
                        >
                          Fermer
                        </motion.div>
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: 'rgb(165,42,42)', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}
                          whileTap={{ scale: 0.95, backgroundColor: 'rgb(165,42,42)' }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className="btn-valider text-sm mt-5 flex items-center bg-brown-500 text-white py-1 px-4 rounded hover:bg-brown-600"
                          type='submit'
                        >
                          Mettre à jour
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.form>
              )}
              {showPopup && (
                <motion.div
                  className='popup flex justify-center align-center bg-black/50'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    ref={popupRef}
                    className='bg-white p-[20px] rounded-md h-40 text-center mt-60'
                    initial={{ y: -30 }}
                    animate={{ y: 0 }}
                    exit={{ y: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <i className="fa-solid fa-circle-check text-brown-500 text-lg"></i>
                    <h4 className='mt-1'>{update}</h4>
                    <button
                      onClick={closePopUp}
                      className="btn-valider text-sm mx-1 mt-7 flex items-center bg-brown-500 text-white py-2 px-2 rounded hover:bg-brown-600"
                    >Cliquez ici pour vous reconnecter !</button>
                  </motion.div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Les autres pages */}
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default dashboard