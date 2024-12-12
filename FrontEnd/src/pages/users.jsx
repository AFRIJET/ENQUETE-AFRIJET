import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_URL

const users = () => {
    const popupRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true); // État de chargement
    const [users, setUsers] = useState([])
    const [user, setUser] = useState([])
    const [data, setData] = useState()
    const [selectUser, setSelectUser] = useState(null)
    const [checkedItems, setCheckedItems] = useState({
        admin: false,
        user: false
    })
    const [showPopup, setShowPopup] = useState(false)
    const [update, SetUpdate] = useState("")
    const [createUserPopup, setCreateUserPopup] = useState(false)
    const [deleteUserPopup, setDeleteUserPopup] = useState(false)
    const [updateUserPopup, setUpdateUserPopup] = useState(false)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };
    const PopupCreateUser = () => {
        setCreateUserPopup((prev) => (!prev))
    }
    const PopupDeleteUser = (userId) => {
        setDeleteUserPopup((prev) => (!prev))
        setSelectUser(userId)
    }
    const PopupUpdateUser = (userId) => {
        setUpdateUserPopup(true)
        setSelectUser(userId)
        axios.get(`${apiUrl}/admin/user_update`, {
            params: { id: userId },
        })
            .then((response) => {
                console.log(response)
                if (response.data.user) {
                    setUser(response.data.user)
                    const role = response.data.user.role; // Supposons que le rôle soit défini dans `user.role`
                    setCheckedItems({
                        admin: role === 'admin',
                        user: role === 'user',
                    });
                } else {
                    setUser([])
                }
            })
            .catch(err => console.log("Erreur :", err))
    }
    const ClosePopupUpdateUser = () => {
        setUpdateUserPopup((prev) => (!prev))
    }
    // Timer pour fermer la popup après 2 secondes
    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
                setShowPopup(false); // Fermer la popup après 2 secondes
            }, 2000);

            return () => clearTimeout(timer); // Nettoie le timer si le composant est démonté ou si l'état change
        }
    }, [showPopup, setShowPopup]);
    useEffect(() => {
        axios.get(`${apiUrl}/admin/users`)
            .then((response) => {
                setUsers(response.data.users || []);
                setIsLoading(false); // Désactiver le chargement
            })
            .catch(error => console.log("Erreur:", error))
    })
    const handleChangeBox = (event) => {
        const { id, checked } = event.target;
        setCheckedItems({
            ...checkedItems,
            [id]: checked
        })
    }
    const handleChange = (e) => {
        const { id, name, type, value, checked } = e.target
        if (type === 'checkbox') {
            setCheckedItems((prev) => ({
                ...prev,
                [value]: checked
            }))
            if (id === 'admin') {
                setCheckedItems((prev) => ({
                    ...prev,
                    [value]: checked
                }))
            } else {
                setCheckedItems((prev) => ({
                    ...prev,
                    [value]: checked
                }))
            }
            // Mettre à jour l'état des données
            setData({
                ...data,
                [name]: value
            });
        } else {
            setData({
                ...data,
                [name]: value
            })
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        // Envoi des données s'il n'y a pas d'erreurs
        axios.post(`${apiUrl}/admin/add_users`, data, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                console.log(response);
                setCreateUserPopup(false)
            })
            .catch(err => console.log("Erreur lors de la sauvegarde des données:", err));
    }
    const handleDelete = () => {

        axios.delete(`${apiUrl}/admin/delete_user`, {
            data: { id: selectUser },
        })
            .then((response) => {
                console.log(response)
                setDeleteUserPopup(false)
            })
            .catch(err => console.log("Erreur d'éxécution:", err))
    }
    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put(`${apiUrl}/admin/update_profil`, {
            id: selectUser, // Identifiant utilisateur
            ...data // Nouvelles données à mettre à jour
        })
            .then((response) => {
                setUpdateUserPopup(false)
                setShowPopup(true)
                SetUpdate("Utilisateur modifié avec succès !")
            })
            .catch(error => console.log('Erreur:', error))

    }
    return (
        <div className='sm:ml-[20%] ml-20 mt-[30%] sm:mt-[8%] md:mt-[15%] lg:mt-[12%] h-[83vh] users'>
            <div className="flex justify-between items-center mx-auto sm:px-5 mt-5">
                <h3 className="flex items-center mx-3 text-lg font-semibold">
                    <i className={`fa-solid fa-user-group text-lg mx-3 text-gray-700`}></i> Gérer les utilisateurs
                </h3>
                <button
                    onClick={PopupCreateUser}
                    className="flex items-center justify-center bg-brown-500 hover:bg-red-700 text-white font-medium rounded-lg px-5 py-2 shadow-md transition duration-200 add-user"
                >
                    <i className="fa-solid fa-plus mr-2"></i> <span className='nav-text'>Nouveau utilisateur</span>
                </button>
            </div>

            <div className="mt-5 sm:mx-5 users-table">
                <table className="shadow-md rounded-lg overflow-hidden w-full">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <tr>
                            <th className="py-3 sm:px-6 text-center"><span>Nom d'utilisateur</span></th>
                            <th className="py-3 sm:px-6 text-center"><span>Rôle</span></th>
                            <th className="py-3 sm:px-6 text-center"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-gray-700 text-sm font-light">
                        {isLoading ? (
                            // Skeleton loaders pour 5 lignes
                            Array(5).fill(null).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                    <td className="py-3 sm:px-6 text-center">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                                    </td>
                                    <td className="py-3 sm:px-6 text-center">
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                                    </td>
                                    <td className="py-3 sm:px-6 text-center">
                                        <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            // Affichage des utilisateurs si chargement terminé
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td className="py-3 sm:px-6 text-center">{user.utilisateur}</td>
                                    <td className="py-3 sm:px-6 text-center">{user.role}</td>
                                    <td className="py-3 sm:px-6 flex justify-center sm:space-x-3">
                                        <Link
                                            onClick={() => PopupUpdateUser(user._id)}
                                            className='mt-1'
                                        >
                                            <span className='text-sm text-blue-500 edit-user-big mt-1'><i class="fa-regular fa-pen-to-square"></i></span>
                                            <span className='text-sm text-blue-500 edit-user'>Modifier</span>
                                        </Link>
                                        <button
                                            type="button"
                                            className="px-3 text-brown-500 hover:text-red-700 transition duration-200"
                                            onClick={() => PopupDeleteUser(user._id)}
                                        >
                                            <i className="fa-solid fa-trash text-lg"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <AnimatePresence>
                {createUserPopup && (
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
                            className=""
                        >
                            <div className="bg-white w-[360px] p-4 rounded-lg shadow-lg">
                                <h3 className="text-lg font-semibold mb-4 mx-2 mt-2"><i className="fa-solid fa-circle-user mr-2"></i>Créer un utilisateur</h3>
                                <div className='col'>
                                    <label htmlFor="inputUser" className='mx-1 font-semibold text-sm'>
                                        Nom d'utilisateur <span className='text-red-500'>*</span>
                                    </label>
                                    <input type='text'
                                        id='inputUser'
                                        name='utilisateur'
                                        required
                                        className='border p-1 mt-2.5 w-80 rounded-lg'
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className='col mt-4'>
                                    <label htmlFor="inputPassword" className='mx-1 font-semibold text-sm'>
                                        Mot de passe <span className='text-red-500'>*</span>
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
                                <div className='col mt-4'>
                                    <label htmlFor="inputPassword" className='mx-1 font-semibold text-sm'>
                                        Rôle <span className='text-red-500'>*</span>
                                    </label>
                                    <div className="mt-2 grid grid-cols-2">
                                        <div className="flex gap-x-3 p-2 rounded">
                                            <div className="flex h-6 items-center">
                                                <input
                                                    checked={checkedItems.admin}
                                                    onClick={handleChangeBox}
                                                    onChange={handleChange}
                                                    disabled={checkedItems.user}
                                                    id="admin"
                                                    value="admin"
                                                    name="role"
                                                    type="checkbox"
                                                    className={"h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-red-600"}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                />
                                            </div>
                                            <div className="text-sm leading-6">
                                                <label htmlFor="admin" className="font-medium text-gray-900">
                                                    Admin
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex gap-x-3 mx-4 p-2 rounded">
                                            <div className="flex h-6 items-center">
                                                <input
                                                    checked={checkedItems.user}
                                                    onClick={handleChangeBox}
                                                    onChange={handleChange}
                                                    disabled={checkedItems.admin}
                                                    id="user"
                                                    value="user"
                                                    name="role"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-red-600"
                                                />
                                            </div>
                                            <div className="text-sm leading-6">
                                                <label htmlFor="user" className="font-medium text-gray-900">
                                                    Utilisateur
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex space-x-20 mx-8 mb-3'>
                                    <motion.div
                                        whileHover={{ scale: 1.1, backgroundColor: 'rgb(229, 231, 235)', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}
                                        whileTap={{ scale: 0.95, backgroundColor: 'rgb(229, 231, 235)' }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className="btn-valider bg-gray-200 text-sm mx-1 mt-6 flex items-center border rounded text-black py-2 px-4 hover:bg-gray-200 cursor-pointer"
                                        onClick={PopupCreateUser}
                                    >
                                        Fermer
                                    </motion.div>
                                    <motion.button
                                        whileHover={{ scale: 1.1, backgroundColor: 'rgb(165,42,42)', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}
                                        whileTap={{ scale: 0.95, backgroundColor: 'rgb(165,42,42)' }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className="btn-valider text-sm mt-6 flex items-center bg-brown-500 text-white py-2 px-4 rounded hover:bg-brown-600"
                                        type='submit'
                                    >
                                        Valider
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.form>
                )}
                {updateUserPopup && (
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleUpdate}
                        className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'
                        >
                        <motion.div
                            initial={{ y: -30 }}
                            animate={{ y: 0 }}
                            exit={{ y: -30 }}
                            transition={{ duration: 0.3 }}
                            >
                            <div className="bg-white w-[375px] p-4 rounded-lg shadow-lg">
                                <h3 className="text-lg font-semibold mb-4 mx-2 mt-2"><i className="fa-solid fa-circle-user mr-2"></i>Modifier un utilisateur</h3>
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
                                        Mot de passe <span className='text-red-500'>*</span>
                                    </label>
                                    <div className='flex'>
                                        <input type={isPasswordVisible ? "text" : "password"}
                                            id='inputPassword'
                                            name="password"
                                            defaultValue={user?.password}
                                            required
                                            className='border p-1 mt-2 w-80 rounded-lg'
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
                                </div>
                                <div className='col mt-4'>
                                    <label htmlFor="inputPassword" className='mx-1 font-semibold text-sm'>
                                        Rôle <span className='text-red-500'>*</span>
                                    </label>
                                    <div className="mt-2 grid grid-cols-2">
                                        <div className="flex gap-x-3 p-2 rounded">
                                            <div className="flex h-6 items-center">
                                                <input
                                                    checked={checkedItems.admin}
                                                    onClick={handleChangeBox}
                                                    onChange={handleChange}
                                                    disabled={checkedItems.user}
                                                    id="admin"
                                                    value="admin"
                                                    name="role"
                                                    type="checkbox"
                                                    defaultChecked={checkedItems.admin} // Par défaut, coche la case si admin
                                                    className={"h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-red-600"}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                />
                                            </div>
                                            <div className="text-sm leading-6">
                                                <label htmlFor="admin" className="font-medium text-gray-900">
                                                    Admin
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex gap-x-3 mx-4 p-2 rounded">
                                            <div className="flex h-6 items-center">
                                                <input
                                                    checked={checkedItems.user}
                                                    onClick={handleChangeBox}
                                                    onChange={handleChange}
                                                    disabled={checkedItems.admin}
                                                    id="user"
                                                    value="user"
                                                    name="role"
                                                    type="checkbox"
                                                    defaultChecked={checkedItems.user} // Par défaut, coche la case si c'est user
                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-red-600"
                                                />
                                            </div>
                                            <div className="text-sm leading-6">
                                                <label htmlFor="user" className="font-medium text-gray-900">
                                                    Utilisateur
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex space-x-20 mx-8 mb-3'>
                                    <motion.div
                                        whileHover={{ scale: 1.1, backgroundColor: 'rgb(229, 231, 235)', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}
                                        whileTap={{ scale: 0.95, backgroundColor: 'rgb(229, 231, 235)' }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className="btn-valider bg-gray-200 text-sm mx-1 mt-6 flex items-center border rounded text-black py-2 px-4 hover:bg-gray-200 cursor-pointer"
                                        onClick={ClosePopupUpdateUser}
                                    >
                                        Fermer
                                    </motion.div>
                                    <motion.button
                                        whileHover={{ scale: 1.1, backgroundColor: 'rgb(165,42,42)', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}
                                        whileTap={{ scale: 0.95, backgroundColor: 'rgb(165,42,42)' }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        className="btn-valider text-sm mt-6 flex items-center bg-brown-500 text-white py-2 px-4 rounded hover:bg-brown-600"
                                        type='submit'
                                    >
                                        Valider
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
                            className='bg-white p-[20px] rounded-md h-[130px] text-center mt-60'
                            initial={{ y: -30 }}
                            animate={{ y: 0 }}
                            exit={{ y: -30 }}
                            transition={{ duration: 0.3 }}
                        >
                            <i className="fa-solid fa-circle-check text-brown-500 text-lg"></i>
                            <h4 className='mt-3'>{update}</h4>
                        </motion.div>

                    </motion.div>
                )}
                {deleteUserPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <motion.div
                            initial={{ y: -30 }}
                            animate={{ y: 0 }}
                            exit={{ y: -30 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white w-[360px] p-4 rounded-lg shadow-lg">
                            <h3 className="text-lg font-semibold mb-4 mx-2 mt-2">Voulez-vous vraiment supprimer cet utilisateur ?</h3>
                            <div className='flex space-x-20 mx-8 mb-3'>
                                <motion.button
                                    whileHover={{ scale: 1.1, backgroundColor: 'rgb(229, 231, 235)', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}
                                    whileTap={{ scale: 0.95, backgroundColor: 'rgb(229, 231, 235)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="btn-valider bg-gray-200 text-sm mx-1 mt-6 flex items-center border rounded text-black py-2 px-4 hover:bg-gray-200"
                                    onClick={PopupDeleteUser}
                                >
                                    Non
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1, backgroundColor: 'rgb(165,42,42)', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}
                                    whileTap={{ scale: 0.95, backgroundColor: 'rgb(165,42,42)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="btn-valider text-sm mt-6 flex items-center bg-brown-500 text-white py-2 px-4 rounded hover:bg-brown-600"
                                    onClick={handleDelete}
                                >
                                    Oui
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default users