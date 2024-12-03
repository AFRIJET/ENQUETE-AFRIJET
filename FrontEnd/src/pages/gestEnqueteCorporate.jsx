import axios from 'axios';
import React, { useState, useEffect } from 'react'

const apiUrl = import.meta.env.VITE_API_URL

const gestEnqueteCorporate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      console.warn("Le nom d'utilisateur n'est pas défini.");
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
          console.log("L'utilisateur est administrateur.");
          setIsAdmin(true)
        } else {
          console.log("L'utilisateur n'est pas administrateur.");
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
    if (!selectedDateRange) {
      console.error("Aucun intervalle de dates sélectionné");
      return;
    }
    const parsedDateRange = JSON.parse(selectedDateRange); // Parser la chaîne JSON
    const { startDate, endDate } = parsedDateRange; // Extraire les dates
    axios.get(`${apiUrl}/admin/generate_excel_report`, {
      params: { enquete: "Enquete_Entreprise", StartDate: startDate, EndDate: endDate },
      responseType: 'blob', // Traite la réponse comme un fichier
    })
      .then((response) => {
        // Vérifie si la réponse contient des données valides
        if (response.status === 200 && response.data) {
          // Créer un lien pour télécharger le fichier
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'rapport_enquete_corporate.xlsx');
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
    // Récupérer et parser l'intervalle de dates depuis sessionStorage
    const selectedDateRange = sessionStorage.getItem('selectedDateRange');
    if (!selectedDateRange) {
      console.error("Aucun intervalle de dates sélectionné");
      return;
    }
    const parsedDateRange = JSON.parse(selectedDateRange); // Parser la chaîne JSON
    const { startDate, endDate } = parsedDateRange; // Extraire les dates
    axios.get(`${apiUrl}/admin/generate_csv_report`, {
      params: { enquete: "Enquete_Entreprise", StartDate: startDate, EndDate: endDate },
      responseType: 'blob', // Important pour traiter la réponse comme un fichier
    })
      .then(response => {
        // Vérifie si la réponse contient des données valides
        if (response.status === 200 && response.data) {
          // Créer un lien pour télécharger le fichier
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'rapport_enquete_corporate.csv');
          document.body.appendChild(link);
          link.click();
          link.remove();
          setIsModalOpen((prev) => !prev);
        } else {
          console.error('Aucune donnée valide reçue du serveur');
        }
      })
      .catch(error => {
        console.error("Erreur lors du téléchargement:", error);
      });
  };
  return (
    <div>
      <div className="flex justify-between items-center mx-auto px-5">
        {isAdmin && (
          <div
            onClick={toggleModal}
            className="fixed top-3 right-[200px] items-center justify-center border rounded-lg px-5 py-2 cursor-pointer"
          >
            <span className='text-sm'><i className="fa-solid fa-download mr-2"></i> Télécharger un rapport</span>
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
                  className="bg-brown-500 text-white rounded-full py-1 px-4 hover:bg-red-700"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className=''>
        <p className='text-xl pt-60 mx-[40%] text-black'>No data found</p>
      </div>
    </div>
  )
}

export default gestEnqueteCorporate