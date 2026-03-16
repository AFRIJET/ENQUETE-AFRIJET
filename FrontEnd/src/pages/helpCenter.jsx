import React from 'react'
import '../styles/styleAdmin.css'

const helpCenter = () => {
  return (
    <div className="help-center bg-gray-100 h-100 w-100 ml-[20%] mt-20 p-4">
      <h1 className='text-2xl text-brown-500 ml-3 p-3'>Centre d'Aide - Application d'Enquête Client</h1>
      <p className='text-lg ml-3 p-3'>Bienvenue dans le centre d'aide de notre application d'enquête client. Ici, vous trouverez des instructions détaillées sur les fonctionnalités disponibles et comment les utiliser pour optimiser votre expérience.</p>

      <div id="telecharger-un-rapport">
        <h3 className='text-xl text-brown-500 p-3 ml-3'>1. Télécharger un Rapport</h3>
        <ol>
          <li className='text-lg p-1 ml-5'>- Accédez à la section "Gestion des enquêtes" dans le menu principal.</li>
          <li className='text-lg p-1 ml-5'>- Sélectionnez l'enquête que vous souhaitez télécharger.</li>
          <li className='text-lg p-1 ml-5'>- Cliquez sur le bouton "Télécharger un rapport".</li>
          <li className='text-lg p-1 ml-5'>- Choisissez le format de fichier souhaité (CSV, Excel, etc.).</li>
          <li className='text-lg p-1 ml-5'>- Le rapport sera téléchargé sur votre appareil.</li>
        </ol>
      </div>

      <div id="creer-un-utilisateur">
        <h3 className='text-xl text-brown-500 p-3 ml-3'>2. Créer un Utilisateur</h3>
        <ol>
          <li className='text-lg p-1 ml-5'>- Allez dans la section "Utilisateurs".</li>
          <li className='text-lg p-1 ml-5'>- Cliquez sur le bouton "Ajouter un Utilisateur".</li>
          <li className='text-lg p-1 ml-5'>- Remplissez les informations requises (nom, adresse e-mail, rôle).</li>
          <li className='text-lg p-1 ml-5'>- Cliquez sur "Enregistrer" pour finaliser la création de l'utilisateur.</li>
        </ol>
      </div>

      <div id="modifier-un-utilisateur">
        <h3 className='text-xl text-brown-500 p-3 ml-3'>3. Modifier un Utilisateur</h3>
        <ol>
          <li className='text-lg p-1 ml-5'>- Accédez à la section "Utilisateurs".</li>
          <li className='text-lg p-1 ml-5'>- Trouvez l'utilisateur que vous souhaitez modifier et cliquez sur "Modifier" à côté de son nom.</li>
          <li className='text-lg p-1 ml-5'>- Apportez les modifications nécessaires.</li>
          <li className='text-lg p-1 ml-5'>- Cliquez sur "Enregistrer" pour sauvegarder les changements.</li>
        </ol>
      </div>

      <p className='text-sm p-3 mt-5 ml-5'>Nous espérons que ce centre d'aide vous sera utile. Si vous avez d'autres questions, n'hésitez pas à contacter notre support technique. <br />Merci d'utiliser notre application d'enquête client !</p>
    </div>
  );
};

export default helpCenter