import React, { useRef, useState } from 'react'
import '../styles/styleAdmin.css'
import logoAfrijet from '../assets/images/Logo-SF.png'
import logoFlygabon from '../assets/images/Logo-FG2.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_URL

const login = () => {

    const [values, setValues] = useState({})
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value
        })
    }

    console.log(values)

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${apiUrl}/admin/login`, values, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                if (response.data.success) {
                    // Connexion réussie
                    console.log('Connexion réussie:', response.data);
                    setError('');
                    navigate('/admin/dashboard');
                }
            })
            .catch (error => {
            // Vérifie si c'est une erreur HTTP
            if (error.response) {
                const { message } = error.response.data;
                console.error('Erreur:', message);

                // Afficher un message à l'utilisateur
                setError(message);
            } else {
                console.error('Erreur réseau:', error);
                alert('Erreur de connexion au serveur.');
            }
        })

    }
    return (
        <div className='login h-screen'>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className='bg-white rounded-2xl w-[500px] mx-auto p-8'>
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            alt="Logo Afrijet"
                            src={logoAfrijet}
                            className="mx-auto h-10 w-auto"
                        />
                        <h2 className="mt-7 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                            Bienvenue dans la plateforme d'enquête client
                        </h2>
                        {error &&
                            <p className="mt-3 text-center text-sm text-brown-500">
                                {error}
                            </p>
                        }
                    </div>

                    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                    Utilisateur
                                </label>
                                <div className="mt-2">
                                    <input
                                        onChange={handleChange}
                                        id="utilisateur"
                                        name="utilisateur"
                                        type="text"
                                        required
                                        autoComplete="text"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-500 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                        Mot de passe
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        onChange={handleChange}
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown-500 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-brown-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-brown-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Se connecter
                                </button>
                            </div>
                        </form>

                        <img
                            alt="Logo FlyGabon"
                            src={logoFlygabon}
                            className="mx-auto mt-7 h-10 w-auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default login