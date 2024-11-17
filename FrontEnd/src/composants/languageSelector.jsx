import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
    const { i18n } = useTranslation(); // Gestion de la traduction
    const [isOpen, setIsOpen] = useState(false); // Gère l'ouverture de la fenêtre
    
    const languages = [
        { code: "fr", label: "Français" , flag: "FR" },
        { code: "en", label: "Anglais", flag: "EN" },
        { code: "es", label: "Espagnol", flag: "ES" },
        { code: "pt", label: "Portugais", flag: "PT" },
    ];

    // Langue actuelle
    const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

    const handleLanguageChange = (code) => {
        i18n.changeLanguage(code); // Change la langue dans i18n
        setIsOpen(false); // Ferme la fenêtre
    };

    return (
        <div className="fixed bottom-10 right-4">
            {/* Bouton principal */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="bg-brown-500 h-[40px] w-[65px] text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none"
                aria-label="Changer de langue"
            >
                <span className="mr-1">{currentLanguage.flag}</span> <i class="fa-solid fa-angle-down"></i>
            </button>

            {/* Fenêtre déroulante */}
            {isOpen && (
                <div className="fixed bottom-40 right-4">
                    {/* Bouton principal */}
                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="bg-brown-500 h-[40px] w-[65px] text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none"
                        aria-label="Changer de langue"
                    >
                        <span className="mr-1">{currentLanguage.flag}</span> <i class="fa-solid fa-angle-up"></i>
                    </button>
                    <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-40">
                        <ul className="p-2">
                            {languages.map((lang) => (
                                <li
                                    key={lang.code}
                                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleLanguageChange(lang.code)}
                                >
                                    <span>{lang.flag}</span>
                                    <span className="text-sm text-gray-800">{lang.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;