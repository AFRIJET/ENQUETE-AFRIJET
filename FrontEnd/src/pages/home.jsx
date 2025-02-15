import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/styleAdmin.css';
import axios from 'axios';
import { useAuth } from "../composants/authContext";

const apiUrl = import.meta.env.VITE_API_URL

const Home = () => {
    const { renewSession } = useAuth()
    const { startDate } = useAuth();
    const { endDate } = useAuth();
    const { isHidden } = useAuth();
    const [nbreEnqueteAgence, setNbreEnqueteAgence] = useState(null)
    const [nbreEnqueteSatisfaction, setNbreEnqueteSatisfaction] = useState(null)
    const [nbreEnqueteEntreprise, setNbreEnqueteEntreprise] = useState(null)
    const [isLoadingAgence, setIsLoadingAgence] = useState(true);
    const [isLoadingSatisfaction, setIsLoadingSatisfaction] = useState(true);
    const [isLoadingCorporate, setIsLoadingCorporate] = useState(true);
    const navigate = useNavigate()

    const totalEnqueteAgence = () => {
        setIsLoadingAgence(true)
        if (startDate && endDate) {
            console.log(startDate, endDate)
            const params = { StartDate: startDate, EndDate: endDate };

            axios
                .get(`${apiUrl}/admin/enquete_agence`, { params, withCredentials: true })
                .then((response) => {
                    if (response.status === 200 && response.data) {
                        setNbreEnqueteAgence(response.data.total);
                        setIsLoadingAgence(false);
                    } else {
                        setNbreEnqueteAgence(0);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors du téléchargement:", error);
                });
        } else {
            axios
                .get(`${apiUrl}/admin/enquete_agence_global`, { withCredentials: true })
                .then((response) => {
                    if (response.status === 200 && response.data) {
                        setNbreEnqueteAgence(response.data.total);
                        setIsLoadingAgence(false);
                    } else {
                        setNbreEnqueteAgence(0);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors du téléchargement:", error);
                });
        }
    };

    const totalEnqueteSatisfaction = () => {
        setIsLoadingSatisfaction(true)
        if (startDate && endDate) {
            const params = { StartDate: startDate, EndDate: endDate };
            axios
                .get(`${apiUrl}/admin/enquete_satisfaction`, { params, withCredentials: true })
                .then((response) => {
                    if (response.status === 200 && response.data) {
                        setNbreEnqueteSatisfaction(response.data.total);
                        setIsLoadingSatisfaction(false);
                    } else {
                        setNbreEnqueteSatisfaction(0);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors du téléchargement:", error);
                });
        } else {
            axios
                .get(`${apiUrl}/admin/enquete_satisfaction_global`, { withCredentials: true })
                .then((response) => {
                    if (response.status === 200 && response.data) {
                        setNbreEnqueteSatisfaction(response.data.total);
                        setIsLoadingSatisfaction(false);
                    } else {
                        setNbreEnqueteSatisfaction(0);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors du téléchargement:", error);
                });
        }
    };

    const totalEnqueteEntreprise = () => {
        setIsLoadingCorporate(true)
        if (startDate && endDate) {
            const params = { StartDate: startDate, EndDate: endDate };
            axios
                .get(`${apiUrl}/admin/enquete_entreprise`, { params, withCredentials: true })
                .then((response) => {
                    if (response.status === 200 && response.data) {
                        setNbreEnqueteEntreprise(response.data.total || 0);
                        setIsLoadingCorporate(false);
                    } else {
                        setNbreEnqueteEntreprise(0);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors du téléchargement:", error);
                });
        } else {
            axios
                .get(`${apiUrl}/admin/enquete_entreprise_global`, { withCredentials: true })
                .then((response) => {
                    if (response.status === 200 && response.data) {
                        setNbreEnqueteEntreprise(response.data.total || 0);
                        setIsLoadingCorporate(false);
                    } else {
                        setNbreEnqueteEntreprise(0);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors du téléchargement:", error);
                });
        }
    };

    useEffect(() => {
        totalEnqueteAgence();
        totalEnqueteSatisfaction();
        totalEnqueteEntreprise();
    }, [startDate, endDate]);

    renewSession();

    return (
        <div className={`${isHidden ? "pb-5 sm:ml-[20%] ml-3 mt-10 sm:mt-20 w-100" : "pb-5 sm:ml-[20%] ml-[70px] mt-10 sm:mt-20 w-100"}`}>
            <h3 className="flex items-center mx-8 pt-7 pb-5 text-lg font-semibold">
                <i className="fa-solid fa-gauge text-lg mx-3 text-gray-700" aria-hidden="true"></i>
                Tableau de bord
            </h3>
            <div className="flex w-full flex-wrap">
                {/* Card 1 */}
                <div className="bg-white rounded-lg flex items-center w-80 mx-5 mt-5 p-3 transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                    onClick={() => navigate("/login/dashboard/enqueteagence")}
                >
                    <div className="bg-brown-500 p-4 w-[70px] h-[70px] rounded-full flex justify-center items-center">
                        <i className="text-3xl text-white fa-solid fa-house" aria-hidden="true"></i>
                    </div>
                    <div className="mx-5 w-full mt-3">
                        {isLoadingAgence ? (
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-xl">{nbreEnqueteAgence}</h3>
                                <small className="text-sm text-gray-700">Total d'enquête en agence</small>
                            </div>
                        )}

                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-lg flex items-center w-80 mx-5 mt-5 p-3 transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                    onClick={() => navigate("/login/dashboard/enquetesatisfaction")}
                >
                    <div className="bg-brown-500 p-4 w-[70px] h-[70px] rounded-full flex justify-center items-center">
                        <i className="text-3xl text-white fa-solid fa-plane-departure" aria-hidden="true"></i>
                    </div>
                    <div className="mx-5 w-full mt-3">
                        {isLoadingSatisfaction ? (
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-xl">{nbreEnqueteSatisfaction}</h3>
                                <small className="text-sm text-gray-700">Total d'enquête de satisfaction</small>
                            </div>
                        )}

                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-lg flex items-center w-80 mx-5 mt-5 p-3 transform transition duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                    onClick={() => navigate("/login/dashboard/enquetecorporate")}
                >
                    <div className="bg-brown-500 p-4 w-[80px] h-[65px] rounded-full flex justify-center items-center">
                        <i className="text-3xl text-white fa-solid fa-building" aria-hidden="true"></i>
                    </div>
                    <div className="mx-5 w-full mt-3">
                        {isLoadingCorporate ? (
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-xl">{nbreEnqueteEntreprise}</h3>
                                <small className="text-sm text-gray-700">Total d'enquête entreprise</small>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            {isLoadingAgence && isLoadingSatisfaction && isLoadingCorporate ? (
                <div></div>
            ) : (
                <div className='iframe-container mt-4'>
                    <iframe
                        src="https://charts.mongodb.com/charts-afrijet-enquete-client-sykledh/embed/charts?id=c57b81ab-7d69-48e3-b5e6-1d54b805e145&maxDataAge=3600&theme=light&autoRefresh=true"
                        width="100%"
                        height="665"
                        className='custom-iframe'
                        frameBorder="0"
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default Home;