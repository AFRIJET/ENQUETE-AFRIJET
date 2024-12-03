import axios from 'axios'
import { motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_URL

const profil = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null)
    const [password, setPassword] = useState('')
    const popupRef = useRef(null)
    const [showPopup, setShowPopup] = useState(false)
    const [update, SetUpdate] = useState("")
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [data, setData] = useState({})
    const navigate = useNavigate()
    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
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
                setPassword(response.data.password)
                setIsLoading(false)
            })
            .catch(error => {
                console.error('Erreur:', error.response?.data?.message || error.message);
                setIsLoading(false)
            });
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        })
    }
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
                SetUpdate(response.data.message)
            })
            .catch(error => console.log('Erreur:', error))
    }
    // fonction pour fermer la popup
    const closePopUp = () => {
        setShowPopup(false);
        navigate('/admin')
    }

    return (
        <div>
            <div className="flex justify-between items-center mx-auto sm:px-5 mt-5">
                <h3 className="flex items-center mx-3 text-lg font-semibold">
                    <i className={`fa-solid fa-address-card text-lg mx-3 text-gray-700`}></i> Profil
                </h3>
            </div>
            <form className='col mt-3 sm:mx-6 p-4 w-80 rounded-lg profil' onSubmit={handleSubmit}>
                <div className='col'>
                    <label htmlFor="inputUser" className='mx-1'>
                        Nom d'utilisateur
                    </label>
                    {isLoading ? (
                        <div className="animate-pulse mt-2">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                    ) : (
                        <input
                            type="text"
                            id="inputUser"
                            name="utilisateur"
                            className="border p-1 mt-2 sm:w-80 rounded-lg input-user"
                            defaultValue={user.utilisateur}
                            readOnly
                            onChange={handleChange}
                        />
                    )}
                </div>

                <div className='col mt-4'>
                    <label htmlFor="inputPassword" className='mx-1'>
                        Mot de passe
                    </label>
                    {isLoading ? (
                    <div className="animate-pulse mt-2 flex">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 w-8 bg-gray-200 rounded ml-2"></div>
                    </div>
                ) : (
                    <div className="flex">
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            id="inputPassword"
                            name="password"
                            required
                            defaultValue={password}
                            className="border p-1 mt-2 w-80 rounded-lg"
                            readOnly
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="right-2 top-2 text-gray-500 hover:text-gray-700"
                        >
                            {isPasswordVisible ? (
                                <i className="fa-solid fa-eye-slash mx-3 mt-2"></i>
                            ) : (
                                <i className="fa-solid fa-eye mx-3 mt-2"></i>
                            )}
                        </button>
                    </div>
                )}
                </div>
                <div className=''>
                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: 'rgb(165,42,42)', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}
                        whileTap={{ scale: 0.95, backgroundColor: 'rgb(165,42,42)' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="btn-valider text-sm mx-1 mt-6 flex items-center bg-brown-500 text-white py-2 px-4 rounded hover:bg-brown-600"
                        type='submit'
                    >
                        {isLoading ? "Chargement..." : "Mettre à jour"}
                    </motion.button>
                </div>
            </form>
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
        </div>
    )
}

export default profil