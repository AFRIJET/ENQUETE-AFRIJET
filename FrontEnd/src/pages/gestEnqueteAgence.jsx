import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_URL

const gestEnqueteAgence = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(null)
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const [user, setUser] = useState(null); // État pour l'utilisateur
  const [isAdmin, setIsAdmin] = useState(false)
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
      return; // Stoppe l'exécution si nameUser est undefined
    }
    axios.get(`${apiUrl}/admin/admin`, {
      params: {
        utilisateur: user.utilisateur // Nom d'utilisateur à vérifier
      }
    })
      .then((response) => {
        console.log('Résultat:', response.data);
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

  const handleDownloadReportExcel = () => {
    // Récupérer et parser l'intervalle de dates depuis sessionStorage
    const selectedDateRange = sessionStorage.getItem('selectedDateRange');
    const apiEndpoint = selectedDateRange
      ? `${apiUrl}/admin/generate_excel_report`
      : `${apiUrl}/admin/generate_excel_report_global`;

    // Définir les paramètres pour la requête
    const params = { enquete: "Enquete_Agence" };
    if (selectedDateRange) {
      const { startDate, endDate } = JSON.parse(selectedDateRange); // Parser la chaîne JSON
      params.StartDate = startDate;
      params.EndDate = endDate;
    }
    // Effectuer la requête pour télécharger le fichier
    axios
      .get(apiEndpoint, {
        params,
        responseType: 'blob', // Traiter la réponse comme un fichier
      })
      .then(response => {
        // Vérifie si la réponse contient des données valides
        if (response.status === 200 && response.data) {
          // Créer un lien pour télécharger le fichier
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'rapport_enquete_agence.xlsx');
          document.body.appendChild(link);
          link.click();
          link.remove();
          setIsModalOpen((prev) => !prev);
        } else {
          console.error('Aucune donnée valide reçue du serveur');
        }
      })
      .catch((error) => {
        console.log("Erreur lors du téléchargement :", error);
      });
  };
  const handleDownloadCsv = () => {
    try {
      // Récupérer et parser l'intervalle de dates depuis sessionStorage
      const selectedDateRange = sessionStorage.getItem('selectedDateRange');
      const apiEndpoint = selectedDateRange
        ? `${apiUrl}/admin/generate_csv_report`
        : `${apiUrl}/admin/generate_csv_report_global`;

      // Définir les paramètres pour la requête
      const params = { enquete: "Enquete_Agence" };
      if (selectedDateRange) {
        const { startDate, endDate } = JSON.parse(selectedDateRange); // Parser la chaîne JSON
        params.StartDate = startDate;
        params.EndDate = endDate;
      }

      // Effectuer la requête pour télécharger le fichier
      axios
        .get(apiEndpoint, {
          params,
          responseType: 'blob', // Traiter la réponse comme un fichier
        })
        .then(response => {
          // Vérifie si la réponse contient des données valides
          if (response.status === 200 && response.data) {
            // Créer un lien pour télécharger le fichier
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'rapport_enquete_agence.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            setIsModalOpen((prev) => !prev);
          } else {
            console.error('Aucune donnée valide reçue du serveur');
          }
        })
        .catch(error => {
          console.error("Erreur lors du téléchargement :", error);
        });
    } catch (error) {
      console.error("Erreur dans handleDownloadCsv :", error);
    }
  };
  return (
    <div className='sm:ml-[20%] ml-20 mt-20'>
      <div className="flex justify-between items-center mx-auto px-5">
        {isAdmin && (
          <div
            onClick={toggleModal}
            className="fixed top-2 sm:top-3 right-[200px] items-center justify-center sm:border rounded-lg sm:px-5 py-2 cursor-pointer z-20"
          >
            <span className='text-sm'><i className="fa-solid fa-download mr-2 text-gray-700 sm:text-black"></i> <span className='hidden sm:inline'>Télécharger un rapport</span></span>
          </div>
        )}

        {/* Popup Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white w-64 p-4 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Choisir le format</h3>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleDownloadReportExcel}
                  className="text-black hover:bg-gray-100 px-4 py-2 rounded-lg border"
                >
                  .xlsx
                </button>
                <button
                  onClick={handleDownloadCsv}
                  className="text-black hover:bg-gray-100 px-4 py-2 rounded-lg border"
                >
                  .csv
                </button>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={toggleModal} // Ferme le modal
                  className="bg-gray-200 border rounded-lg py-1 px-4 hover:bg-white"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Dashboard Enquete Agence */}
      <div className='iframe-container w-100 h-100'>
        <iframe
          src="https://charts.mongodb.com/charts-afrijet-enquete-client-sykledh/public/dashboards/672c69d2-5cd9-4b0d-83d5-5d92bd59e80f"
          width="100%"
          height="755 sm:665"
          className='custom-iframe'
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  )
}

export default gestEnqueteAgence