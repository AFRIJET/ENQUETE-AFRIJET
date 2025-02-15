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
  const { renewSession } = useAuth()
  const { changeDate } = useAuth()
  const { logout } = useAuth(); //Fonction de déconnexion
  const popupRefProfil = useRef(null)
  const popupRef = useRef(null)
  const popupDate = useRef(null)
  const navRef = useRef(null)
  const navBar = useRef(null)
  const [utilisateur, setUtilisateur] = useState(null); // État pour l'utilisateur
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
    console.log(dates)  
    const [start, end] = dates;
    changeDate(start, end)
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
  // Fonction qui permet de faire la vérification de l
  useEffect(() => {
    axios.get(`${apiUrl}/admin/admin`, { withCredentials: true })
      .then((response) => {
        setUtilisateur(response.data.utilisateur)
        if (response.data.isAdmin) {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }
      })
      .catch(error => {
        console.error('Erreur:', error.response?.data?.message || error.message);
      });
  }, [])
  const [activeIndex, setActiveIndex] = useState(null); // Stocke l'index de l'élément actif
  const [expandedIndex, setExpandedIndex] = useState(null); // Stocke l'index des éléments à agrandir

  const menuItems = [
    { to: "", icon: "fa-gauge", label: "Tableau de bord" },
    {
      icon: "fa-square-poll-vertical",
      label: "Gestion des enquêtes",
      subItems: [
        { to: "/login/dashboard/enqueteagence", icon: "fa-house", label: "Enquête en Agence" },
        { to: "/login/dashboard/enquetesatisfaction", icon: "fa-plane-departure", label: "Enquête de Satisfaction" },
        { to: "/login/dashboard/enquetecorporate", icon: "fa-building", label: "Enquête Corporate" },
      ],
    },
    ...(isAdmin
      ? [{ to: "/login/dashboard/users", icon: "fa-users", label: "Utilisateurs" }]
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
    const handleClickOutsidePopup = (event) => {
      if (popupRefProfil.current && !popupRefProfil.current.contains(event.target)) {
        setIsProfilOpen(!isProfilOpen)
      }
    };

    const handleClickOutsidePopupDate = (event) => {
      if (popupDate.current && !popupDate.current.contains(event.target)) {
        setIsCalendarOpen(!isCalendarOpen)
      }
    };

    if (isProfilOpen) {
      document.addEventListener('mousedown', handleClickOutsidePopup);
    } else {
      document.removeEventListener('mousedown', handleClickOutsidePopup);
    }
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutsidePopupDate);
    } else {
      document.removeEventListener('mousedown', handleClickOutsidePopupDate);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsidePopup, handleClickOutsidePopupDate);
    };
  }, [isProfilOpen, isCalendarOpen]);

  const initializeDate = () => {
    setStartDate(null)
    setEndDate(null)
    changeDate(null, null)
    sessionStorage.removeItem("selectedDateRange")
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${apiUrl}/admin/update_profil`, {
      id: utilisateur.id, // Identifiant utilisateur
      ...data, // Nouvelles données à mettre à jour
      withCredentials: true
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
  const { isHidden, setIsHidden } = useAuth();

  useEffect(() => {
    const handleClick = (event) => {
      if (!navRef.current || !navRef.current.contains(event.target)) {
        if (navBar.current && !navBar.current.contains(event.target)) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
        
      } else {
        // Si on clique à l'intérieur de navRef
        setIsHidden((prev) => !prev);
        console.log("Bon")
      }
    };

    document.addEventListener("mousedown", handleClick);

   
  }, []);

  renewSession();

  return (
    <div className='bg-gray-100'>
      <div className='flex row'>
        <div className={`${isHidden ? 'bg-white sm:w-[20%] border h-screen nav fixed z-10 hidden sm:block' : 'bg-white sm:w-[20%] border h-screen nav fixed z-10'}`}>
          {/*Image d'entete */}
          <div className='inline-flex border-b border-b-4 border-brown-500 sm:w-full'>
            <img
              src={logoAfrijet}
              alt='Logo afrijet'
              className='pb-8 pt-5 w-[150px] h-20 logo-flygabon hidden sm:flex'
            />
            <img
              src={logoFlygabon}
              alt='Logo flygabon'
              className='pb-8 pt-4 pr-3 w-60 h-20 logo-flygabon hidden xl:flex'
            />
          </div>

          {/* Nav Bar Section */}
          <ul className="mt-6 nav" ref={navBar}>
            {menuItems.map((item, index) => (
              <li key={index} className="mx-4 mt-6">
                <Link to={item.to} className={`p-2 w-full block hover:bg-red-100 hover:rounded-lg ${activeIndex === index ? "bg-red-200 rounded-lg" : ""
                  }`}
                  onClick={() => handleItemClick(index)}>
                  <i className={`fa-solid ${item.icon || ""} px-1 sm:px-0 text-lg text-gray-700`}></i>
                  <span className="text-lg mx-2 hidden sm:inline">{item.label}</span>
                  {item.subItems && (
                    <i
                      className={`fa-solid hidden sm:inline ${expandedIndex === index ? "fa-caret-up" : "fa-caret-down"
                        } text-lg text-gray-700 mx-2`}
                    ></i>
                  )}
                </Link>

                {/* Affichage des sous-éléments si agrandi */}
                {item.subItems && expandedIndex === index && (
                  <ul className="mt-2 sm:ml-6 space-y-2">
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex} className="">
                        <Link to={subItem.to} className='p-2 w-full block hover:bg-red-100 hover:rounded-lg'>
                          <span className="text-sm hidden sm:inline">{subItem.label}</span>
                          <i className={`fa-solid ${subItem.icon || ""} sm:hidden px-1 sm:px-0 text-lg text-gray-700`}></i>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className='w-screen h-screen'>
          <div className={`${isHidden ? "inline-flex items-center bg-gray-100 pt-8 sm:pt-0 sm:bg-white sm:border-b sm:border-b-4 sm:border-brown-500 h-[50px] sm:h-[84px] w-[100%] sm:w-[80%] right-0 fixed z-10" : "inline-flex items-center bg-gray-100 pt-8 sm:pt-0 sm:bg-white sm:border-b sm:border-b-4 sm:border-brown-500 h-[50px] sm:h-[85px] w-[80%] sm:w-[80%] right-0 fixed z-10"}`}>
            <div className='flex justify-end sm:justify-between items-center w-full px-5 mb-3'>
              <i className="text-xl fa-solid fa-bars fixed top-4 left-8 z-10 sm:hidden" ref={navRef} onClick={() => setIsHidden((prev) => !prev)}></i>
              {/* Filtre Section */}
              <div className="cursor-pointer mb-2" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                {startDate && endDate ? (
                  <div className='flex sm:mt-4'>
                    <div className='flex items-center sm:border rounded px-3 py-1 sm:py-2 sm:space-x-3'>
                      <i class="fa-solid fa-calendar-days text-gray-700 sm:text-black text-lg sm:text-sm sm:hidden"></i>
                      <span className='flex text-sm space-x-2'>
                        <span className='hidden sm:flex'>Du {" "}</span>
                        <span className="text-sm hidden sm:flex">{startDate.toLocaleDateString()}</span> <span className='hidden sm:flex'>-{" "}</span>
                        <span className="text-sm hidden sm:flex">{endDate.toLocaleDateString()}</span>
                        <i className="fa-solid fa-angle-down hidden sm:flex text-sm"></i>
                      </span>
                    </div>
                    <span className='pt-2 sm:pt-0 mr-4 sm:m-4 text-brown-500' onClick={initializeDate}><i class="fa-regular fa-circle-xmark"></i></span>
                  </div>
                ) : (
                  <div className='flex items-center rounded mr-4 sm:mt-3 px-2 py-2 space-x-3'>
                    <i class="fa-solid fa-calendar-days text-gray-700 sm:text-black text-lg sm:text-sm"></i>
                    <span className='text-sm hidden sm:flex'>
                      Sélectionnez un intervalle de temps pour filtrer
                    </span>
                    <i className="fa-solid fa-angle-down hidden sm:flex text-sm"></i>
                  </div>
                )}
              </div>
              {/* Calendrier */}
              {isCalendarOpen && (
                <div className="fixed top-[60px] mt-2 bg-white border rounded shadow-lg z-10" ref={popupDate}>
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
              <div className='flex align-items-center space-x-3 mb-2'>
                <div className='mt-1'>
                  <i className="fa-solid fa-lock mr-3 text-lg text-gray-700 cursor-pointer" onClick={handleLogout}></i>
                  <i className="fa-regular fa-circle-question mx-2 text-lg text-green-700"></i>
                </div>
                <div className='flex items-center cursor-pointer' onClick={() => setIsProfilOpen(true)}>
                  <span className='text-lg mr-4'>{utilisateur?.name}</span>
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
                      <p>{utilisateur?.name}</p>
                      <p className='text-gray-400'>{utilisateur?.role}</p>
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
                  onSubmit={handleSubmit}
                  className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'
                >
                  <motion.div
                    initial={{ y: -30 }}
                    animate={{ y: 0 }}
                    exit={{ y: -30 }}
                    transition={{ duration: 0.3 }}
                    className="">
                    <div className="bg-white w-[375px] p-4 rounded-lg shadow-lg">
                      <h3 className="text-lg font-semibold mb-4 mx-2 mt-2"><i className="fa-solid fa-circle-user mr-2"></i>Modifier mon profil</h3>
                      <div className='col'>
                        <label htmlFor="inputUser" className='mx-1 font-semibold text-sm'>
                          Nom d'utilisateur <span className='text-red-500'>*</span>
                        </label>
                        <input type='text'
                          id='inputUser'
                          name='utilisateur'
                          defaultValue={utilisateur?.name}
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