import React, { useEffect, useState } from 'react';

const FildAriane = ({ sections }) => {

    const [visibleSections, setVisibleSections] = useState([]);
    const [allSectionsVisited, setAllSectionsVisited] = useState(false);

    useEffect(() => {
        // Fonction pour l'IntersectionObserver
        const handleIntersection = (entries) => {
            entries.forEach((entry) => {
                const sectionId = entry.target.id;
                if (entry.isIntersecting) {
                    // Ajoute la section au tableau des sections visibles si elle ne s'y trouve pas
                    setVisibleSections((prev) => {
                        if (!prev.includes(sectionId)) {
                            const updatedSections = [...prev, sectionId];
                            // Marquer toutes les sections comme visitées si elles sont toutes visibles une fois
                            if (updatedSections.length === sections.length) {
                                setAllSectionsVisited(true);
                            }
                            return updatedSections;
                        }
                        return prev;
                    });
                } else if (allSectionsVisited) {
                    // Retirer la section de la fin seulement si elle n'est plus visible
                    setVisibleSections((prev) => {
                        if (prev[prev.length - 1] === sectionId) {
                            return prev.slice(0, -1);
                        }
                        return prev;
                    });
                }
            });
        };

        // Initialisation de l'IntersectionObserver
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.2,
        });

        // Observe chaque section
        sections.forEach((section) => {
            const sectionElement = document.getElementById(section.label.toLowerCase());
            if (sectionElement) {
                observer.observe(sectionElement);
            }
        });

        // Cleanup de l'observateur lors de la destruction du composant
        return () => {
            sections.forEach((section) => {
                const sectionElement = document.getElementById(section.label.toLowerCase());
                if (sectionElement) {
                    observer.unobserve(sectionElement);
                }
            });
        };
    }, [sections, allSectionsVisited]);

    return (
        <div className='fil_ariane bg-brown-500'>
            <ol className="list-none flex p-0 space-x-2">
                {visibleSections.map((sectionId, index) => {
                    const section = sections.find((sec) => sec.label.toLowerCase() === sectionId);
                    return (
                        <li key={index} className="flex items-center">
                            {index > 0 && <span className="text-gray-100 span-fil"> &gt; </span>}
                            <a
                                href={`#${section.label.toLowerCase()}`}
                                className="text-blue-600 hover:text-blue-800 focus:text-brown-600 focus:outline-none focus:ring-2 focus:ring-brown-300"
                            >
                                <p className='p-[10px] text-xs text-white'>{section.label}</p>
                            </a>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}

export default FildAriane;
