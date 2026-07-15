import React, { useState } from 'react'
import Badge from './Badge'
import { formaterMontant, formaterDate } from '../utils/calculations'

// Statuts disponibles
const STATUTS = ['En attente', 'Confirmée', 'Livrée', 'Annulée']

// Mapping statut → classe CSS pour le select coloré
const classeStatut = {
    'En attente': 'en-attente',
    'Confirmée':  'confirmee',
    'Livrée':     'livree',
    'Annulée':    'annulee',
}

// Composant OrderList — Tableau des commandes avec recherche, filtres et actions
const OrderList = ({ commandes, chargement, onModifierStatut, onSupprimer, onEditer }) => {

    const [recherche, setRecherche] = useState('')
    const [filtreStatut, setFiltreStatut] = useState('Toutes')
    const [commandeAConfirmer, setCommandeAConfirmer] = useState(null)
    
    // États pour le tri et la pagination
    const [tri, setTri] = useState('date-desc')
    const [page, setPage] = useState(1)
    const elementsParPage = 5

    // Filtrage par statut ET recherche (nom client, produit, référence)
    const commandesFiltrees = commandes.filter(cmd => {
        const correspondStatut = filtreStatut === 'Toutes' || cmd.statut === filtreStatut

        const terme = recherche.toLowerCase()
        const correspondRecherche = !terme || (
            cmd.client?.toLowerCase().includes(terme) ||
            cmd.produit?.toLowerCase().includes(terme) ||
            cmd.reference?.toLowerCase().includes(terme)
        )

        return correspondStatut && correspondRecherche
    })

    // Application du tri
    const commandesTriees = [...commandesFiltrees].sort((a, b) => {
        if (tri === 'date-desc') return new Date(b.createdAt) - new Date(a.createdAt)
        if (tri === 'date-asc') return new Date(a.createdAt) - new Date(b.createdAt)
        if (tri === 'montant-desc') return b.montantTotal - a.montantTotal
        if (tri === 'montant-asc') return a.montantTotal - b.montantTotal
        return 0
    })

    // Application de la pagination
    const indexDernierElement = page * elementsParPage
    const indexPremierElement = indexDernierElement - elementsParPage
    const commandesPaginees = commandesTriees.slice(indexPremierElement, indexDernierElement)
    const totalPages = Math.ceil(commandesTriees.length / elementsParPage)

    // Remettre à la page 1 si les filtres changent
    React.useEffect(() => {
        setPage(1)
    }, [recherche, filtreStatut, tri])

    // Demander confirmation avant suppression
    const demanderConfirmation = (commande) => {
        setCommandeAConfirmer(commande)
    }

    // Confirmer la suppression
    const confirmerSuppression = () => {
        if (commandeAConfirmer) {
            onSupprimer(commandeAConfirmer.id)
            setCommandeAConfirmer(null)
        }
    }

    // Exporter en CSV
    const exporterCSV = () => {
        // En-têtes avec BOM pour forcer UTF-8 dans Excel
        let csvContent = 'Référence;Client;Produit;Quantité;Prix Unitaire (FCFA);Montant Total (FCFA);Statut;Date de création\n'
        
        commandesTriees.forEach(cmd => {
            const dateStr = cmd.createdAt ? cmd.createdAt.slice(0, 10) : ''
            csvContent += `${cmd.reference};${cmd.client};${cmd.produit};${cmd.quantite};${cmd.prixUnitaire};${cmd.montantTotal};${cmd.statut};${dateStr}\n`
        })

        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `commandes_guest_markets_${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (chargement) {
        return (
            <div className="loader-wrap">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div>
            {/* Barre de recherche + filtres statut */}
            <div className="search-filter-bar">

                {/* Recherche */}
                <div className="search-input-wrap">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        id="search-commandes"
                        type="text"
                        className="search-input"
                        placeholder="Rechercher par client, produit ou référence..."
                        value={recherche}
                        onChange={e => setRecherche(e.target.value)}
                    />
                </div>

                {/* Tri */}
                <div className="tri-select-wrap">
                    <select
                        className="form-control"
                        style={{ padding: '8px 12px', fontSize: '13px', width: 'auto', border: '1.5px solid var(--border)', borderRadius: '6px' }}
                        value={tri}
                        onChange={e => setTri(e.target.value)}
                    >
                        <option value="date-desc">Plus récentes d'abord</option>
                        <option value="date-asc">Plus anciennes d'abord</option>
                        <option value="montant-desc">Montant le plus élevé</option>
                        <option value="montant-asc">Montant le moins élevé</option>
                    </select>
                </div>

                {/* Bouton Exporter CSV */}
                <button
                    className="btn btn-outline"
                    onClick={exporterCSV}
                    style={{ padding: '8px 14px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                    <i className="fa-solid fa-file-csv"></i> Exporter CSV
                </button>

                {/* Filtres par statut */}
                <div className="status-filters">
                    {['Toutes', 'En attente', 'Confirmée', 'Livrée', 'Annulée'].map(statut => (
                        <button
                            key={statut}
                            id={`filtre-${statut.toLowerCase().replace(' ', '-')}`}
                            className={`filter-btn ${classeStatut[statut] || ''} ${filtreStatut === statut ? 'active' : ''}`}
                            onClick={() => setFiltreStatut(statut)}
                        >
                            {statut}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tableau des commandes */}
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Référence</th>
                            <th>Client</th>
                            <th>Produit</th>
                            <th>Qté</th>
                            <th>Prix unitaire</th>
                            <th>Montant total</th>
                            <th>Statut</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commandesTriees.length === 0 ? (
                            <tr>
                                <td colSpan="9">
                                    <div className="empty-state">
                                        <div className="empty-state-icon">
                                            <i className="fa-solid fa-clipboard-list"></i>
                                        </div>
                                        <p>Aucune commande trouvée</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            commandesPaginees.map(commande => (
                                <tr key={commande.id}>

                                    {/* Référence */}
                                    <td>
                                        <span className="reference">{commande.reference}</span>
                                    </td>

                                    {/* Client */}
                                    <td>
                                        <span style={{ fontWeight: 500 }}>{commande.client}</span>
                                    </td>

                                    {/* Produit */}
                                    <td>{commande.produit}</td>

                                    {/* Quantité */}
                                    <td>{commande.quantite}</td>

                                    {/* Prix unitaire */}
                                    <td>{formaterMontant(commande.prixUnitaire)}</td>

                                    {/* Montant total */}
                                    <td>
                                        <span className="montant">{formaterMontant(commande.montantTotal)}</span>
                                    </td>

                                    {/* Statut — select coloré pour modification rapide */}
                                    <td>
                                        <select
                                            className={`statut-select ${classeStatut[commande.statut]}`}
                                            value={commande.statut}
                                            onChange={e => onModifierStatut(commande.id, e.target.value)}
                                            id={`statut-${commande.id}`}
                                        >
                                            {STATUTS.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* Date de création */}
                                    <td>
                                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                            {formaterDate(commande.createdAt)}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td>
                                        <div className="col-actions">
                                            {/* Modifier */}
                                            <button
                                                className="btn btn-outline btn-sm btn-icon"
                                                title="Modifier"
                                                onClick={() => onEditer(commande)}
                                                id={`btn-edit-${commande.id}`}
                                            >
                                                <i className="fa-solid fa-pencil"></i>
                                            </button>

                                            {/* Supprimer */}
                                            <button
                                                className="btn btn-danger btn-sm btn-icon"
                                                title="Supprimer"
                                                onClick={() => demanderConfirmation(commande)}
                                                id={`btn-delete-${commande.id}`}
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination et compteurs */}
            {commandesTriees.length > 0 && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '16px',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        Affichage de {indexPremierElement + 1} à {Math.min(indexDernierElement, commandesTriees.length)} sur {commandesTriees.length} commande{commandesTriees.length > 1 ? 's' : ''}
                    </p>

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                style={{ padding: '6px 12px' }}
                            >
                                <i className="fa-solid fa-angle-left"></i> Précédent
                            </button>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                Page {page} sur {totalPages}
                            </span>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                                disabled={page === totalPages}
                                style={{ padding: '6px 12px' }}
                            >
                                Suivant <i className="fa-solid fa-angle-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal de confirmation de suppression */}
            {commandeAConfirmer && (
                <div className="modal-overlay" onClick={() => setCommandeAConfirmer(null)}>
                    <div className="modal-box" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>

                        <div className="modal-header">
                            <h2 className="modal-title">Confirmer la suppression</h2>
                            <button className="modal-close" onClick={() => setCommandeAConfirmer(null)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="confirm-dialog-icon">
                                <i className="fa-solid fa-trash-can"></i>
                            </div>
                            <p className="confirm-text">
                                Êtes-vous sûr de vouloir supprimer la commande{' '}
                                <strong>{commandeAConfirmer.reference}</strong> de{' '}
                                <strong>{commandeAConfirmer.client}</strong> ?<br /><br />
                                Cette action est <strong>irréversible</strong>.
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setCommandeAConfirmer(null)}
                                id="btn-annuler-suppression"
                            >
                                Annuler
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={confirmerSuppression}
                                id="btn-confirmer-suppression"
                            >
                                Supprimer définitivement
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}

export default OrderList
