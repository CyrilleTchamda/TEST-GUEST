import React from 'react'
import { formaterMontant } from '../utils/calculations'

// Statuts disponibles selon le cahier des charges
const STATUTS = ['En attente', 'Confirmée', 'Livrée', 'Annulée']

// Composant Dashboard — KPIs et indicateurs
const Dashboard = ({ stats, chargement }) => {

    if (chargement) {
        return (
            <div className="loader-wrap">
                <div className="spinner"></div>
            </div>
        )
    }

    const kpis = [
        {
            label: 'Total commandes',
            value: stats?.total ?? 0,
            couleur: 'blue',
            icon: <i className="fa-solid fa-box"></i>,
        },
        {
            label: 'En attente',
            value: stats?.enAttente ?? 0,
            couleur: 'orange',
            icon: <i className="fa-solid fa-hourglass-half"></i>,
        },
        {
            label: 'Livrées',
            value: stats?.livrees ?? 0,
            couleur: 'green',
            icon: <i className="fa-solid fa-circle-check"></i>,
        },
        {
            label: "Chiffre d'affaires",
            value: formaterMontant(stats?.chiffreAffaires ?? 0),
            couleur: 'red',
            icon: <i className="fa-solid fa-wallet"></i>,
        },
    ]

    return (
        <div>

            {/* Titre de page */}
            <div className="page-header">
                <div className="page-header-text">
                    <h1>Tableau de bord</h1>
                    <p>Vue d'ensemble des commandes en cours</p>
                </div>
            </div>

            {/* Grille KPI */}
            <div className="kpi-grid">
                {kpis.map((kpi, index) => (
                    <div key={index} className={`kpi-card ${kpi.couleur}`}>
                        <div className="kpi-icon">{kpi.icon}</div>
                        <div className="kpi-label">{kpi.label}</div>
                        <div className={`kpi-value ${kpi.couleur}`}>{kpi.value}</div>
                    </div>
                ))}
            </div>

            {/* Résumé par statut */}
            <div className="card">
                <div className="card-header">
                    <span className="card-title">Répartition par statut</span>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                        {STATUTS.map(statut => {
                            const cle = {
                                'En attente': 'enAttente',
                                'Confirmée': 'confirmees',
                                'Livrée': 'livrees',
                                'Annulée': 'annulees',
                            }[statut]

                            const classe = {
                                'En attente': 'en-attente',
                                'Confirmée': 'confirmee',
                                'Livrée': 'livree',
                                'Annulée': 'annulee',
                            }[statut]

                            return (
                                <div key={statut} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    background: 'var(--bg)',
                                }}>
                                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{statut}</span>
                                    <span className={`badge ${classe}`}>{stats?.[cle] ?? 0}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Dashboard
