import React from 'react'

// Composant Badge — Affiche le statut d'une commande avec la couleur correspondante
const Badge = ({ statut }) => {

    // Mapping statut → classe CSS
    const classeStatut = {
        'En attente': 'en-attente',
        'Confirmée':  'confirmee',
        'Livrée':     'livree',
        'Annulée':    'annulee',
    }

    const classe = classeStatut[statut] || 'en-attente'

    return (
        <span className={`badge ${classe}`}>
            {statut}
        </span>
    )
}

export default Badge
