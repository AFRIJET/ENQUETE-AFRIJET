import React from 'react';
import { motion } from 'framer-motion';

const AnimatedItem = ({ children }) => {
  // Définition des variantes d'animation pour l'apparition
  const variants = {
    hidden: { opacity: 0, x: -100 }, // L'élément est caché en haut
    visible: {
      opacity: 1,
      x: 0, // L'élément descend à sa position d'origine
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className="mb-4"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedItem;