import React from 'react'

// Filtres de statut disponibles
const FILTRES = [
    { label: 'Toutes',     value: 'Toutes',     classe: '' },
    { label: 'En attente', value: 'En attente',  classe: 'en-attente' },
    { label: 'Confirmée',  value: 'Confirmée',   classe: 'confirmee' },
    { label: 'Livrée',     value: 'Livrée',      classe: 'livree' },
    { label: 'Annulée',    value: 'Annulée',     classe: 'annulee' },
]

// Composant StatusFilter — boutons de filtre par statut
const StatusFilter = ({ filtreActif, setFiltreActif }) => {
    return (
        <div className="status-filters">
            {FILTRES.map(filtre => (
                <button
                    key={filtre.value}
                    id={`filtre-${filtre.value.toLowerCase().replace(' ', '-')}`}
                    className={`filter-btn ${filtre.classe} ${filtreActif === filtre.value ? 'active' : ''}`}
                    onClick={() => setFiltreActif(filtre.value)}
                >
                    {filtre.label}
                </button>
            ))}
        </div>
    )
}

export default StatusFilter
