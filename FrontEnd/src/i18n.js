import i18n from 'i18next'
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next) // Passer i18n à react-i18next
    .init({
        resources: {
            fr: {
                translation: {
                    select_enquete: "Quelle enquête voulez-vous effectuer aujourd'hui ?",
                    enquete_agence: "Enquête en agence",
                    enquete_escale: "Enquête à l'enregistrement au comptoir",
                    enquete_envol: "Enquête expérience en vol",
                    enquete_entreprise: "Enquête Entreprise"
                }
            },
            en: {
                translation: {
                    select_enquete: "What survey do you want to do today ?",
                    enquete_agence: "In-agency survey",
                    enquete_escale: "Check-in counter survey",
                    enquete_envol: "In-flight experience survey",
                    enquete_entreprise: "Company survey"
                }
            },
            es: {
                translation: {
                    select_enquete: "Qué encuesta quieres realizar hoy ?",
                    enquete_agence: "Investigación de la agencia",
                    enquete_escale: "Consulta al momento del check-in en el mostrador",
                    enquete_envol: "Encuesta de experiencia de vuelo",
                    enquete_entreprise: "Encuesta empresarial"
                }
            }
        },
        lng: "fr", // Langue par défaut initiale
        fallbackLng: "fr",
        interpolation: {
            escapeValue: false
        }
    })