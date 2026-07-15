import React, { useState, useEffect } from 'react'
import { calculerMontantTotal, formaterMontant } from '../utils/calculations'

// Statuts disponibles
const STATUTS = ['En attente', 'Confirmée', 'Livrée', 'Annulée']

// État initial du formulaire (commande vide)
const FORM_INITIAL = {
    client: '',
    produit: '',
    quantite: '',
    prixUnitaire: '',
    statut: 'En attente',
}

// Composant OrderForm — Formulaire de création/modification de commande
const OrderForm = ({ onSubmit, onFermer, commandeAEditer }) => {

    const [form, setForm] = useState(FORM_INITIAL)
    const [erreurs, setErreurs] = useState({})
    const [chargement, setChargement] = useState(false)

    // Si on est en mode édition, pré-remplir le formulaire
    useEffect(() => {
        if (commandeAEditer) {
            setForm({
                client:      commandeAEditer.client,
                produit:     commandeAEditer.produit,
                quantite:    commandeAEditer.quantite,
                prixUnitaire: commandeAEditer.prixUnitaire,
                statut:      commandeAEditer.statut,
            })
        } else {
            setForm(FORM_INITIAL)
        }
        setErreurs({})
    }, [commandeAEditer])

    // Gestion des changements de champs
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))

        // Effacer l'erreur du champ modifié
        if (erreurs[name]) {
            setErreurs(prev => ({ ...prev, [name]: '' }))
        }
    }

    // Calcul du montant total en temps réel
    const montantTotal = calculerMontantTotal(
        parseFloat(form.quantite) || 0,
        parseFloat(form.prixUnitaire) || 0
    )

    // Validation du formulaire
    const valider = () => {
        const nouvellesErreurs = {}

        if (!form.client.trim()) {
            nouvellesErreurs.client = 'Le nom du client est obligatoire.'
        }

        if (!form.produit.trim()) {
            nouvellesErreurs.produit = 'Le nom du produit est obligatoire.'
        }

        if (!form.quantite || parseFloat(form.quantite) <= 0) {
            nouvellesErreurs.quantite = 'La quantité doit être supérieure à zéro.'
        }

        if (!form.prixUnitaire || parseFloat(form.prixUnitaire) <= 0) {
            nouvellesErreurs.prixUnitaire = 'Le prix unitaire doit être supérieur à zéro.'
        }

        return nouvellesErreurs
    }

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Valider avant d'envoyer
        const erreursTrouvees = valider()
        if (Object.keys(erreursTrouvees).length > 0) {
            setErreurs(erreursTrouvees)
            return
        }

        setChargement(true)
        await onSubmit({
            client:      form.client.trim(),
            produit:     form.produit.trim(),
            quantite:    parseInt(form.quantite),
            prixUnitaire: parseFloat(form.prixUnitaire),
            statut:      form.statut,
        })
        setChargement(false)
    }

    const estEdition = !!commandeAEditer

    return (
        <div className="modal-overlay" onClick={onFermer}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>

                {/* En-tête */}
                <div className="modal-header">
                    <h2 className="modal-title">
                        {estEdition ? (
                            <>
                                <i className="fa-solid fa-pencil me-2 btn-outline btn-icon"></i><span className='ps-2'>Modifier la commande</span>
                            </>
                        ) : (
                            <><i className="fa-solid fa-plus me-2 btn-outline btn-icon"></i><span className='ps-2'>Nouvelle commande</span></>
                        )}
                    </h2>
                    <button className="modal-close" onClick={onFermer} id="btn-fermer-form">
                        <i className="fa-solid fa-xmark fa-2x"></i>
                    </button>
                </div>

                {/* Corps du formulaire */}
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">

                        {/* Nom du client */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="client">Nom du client *</label>
                            <input
                                id="client"
                                name="client"
                                type="text"
                                className={`form-control ${erreurs.client ? 'error' : ''}`}
                                placeholder="Ex : Jean Dupont"
                                value={form.client}
                                onChange={handleChange}
                            />
                            {erreurs.client && (
                                <span className="form-error"><i className="fa-solid fa-circle-exclamation me-1"></i> {erreurs.client}</span>
                            )}
                        </div>

                        {/* Produit */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="produit">Produit commandé *</label>
                            <input
                                id="produit"
                                name="produit"
                                type="text"
                                className={`form-control ${erreurs.produit ? 'error' : ''}`}
                                placeholder="Ex : Ordinateur portable"
                                value={form.produit}
                                onChange={handleChange}
                            />
                            {erreurs.produit && (
                                <span className="form-error"><i className="fa-solid fa-circle-exclamation me-1"></i> {erreurs.produit}</span>
                            )}
                        </div>

                        {/* Quantité & Prix unitaire (sur 2 colonnes) */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label" htmlFor="quantite">Quantité *</label>
                                <input
                                    id="quantite"
                                    name="quantite"
                                    type="number"
                                    min="1"
                                    className={`form-control ${erreurs.quantite ? 'error' : ''}`}
                                    placeholder="1"
                                    value={form.quantite}
                                    onChange={handleChange}
                                />
                                {erreurs.quantite && (
                                    <span className="form-error"><i className="fa-solid fa-circle-exclamation me-1"></i> {erreurs.quantite}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="prixUnitaire">Prix unitaire (FCFA) *</label>
                                <input
                                    id="prixUnitaire"
                                    name="prixUnitaire"
                                    type="number"
                                    min="1"
                                    className={`form-control ${erreurs.prixUnitaire ? 'error' : ''}`}
                                    placeholder="350000"
                                    value={form.prixUnitaire}
                                    onChange={handleChange}
                                />
                                {erreurs.prixUnitaire && (
                                    <span className="form-error"><i className="fa-solid fa-circle-exclamation me-1"></i> {erreurs.prixUnitaire}</span>
                                )}
                            </div>
                        </div>

                        {/* Montant total calculé automatiquement */}
                        {montantTotal > 0 && (
                            <div className="total-preview">
                                <span className="total-preview-label">
                                    <i className="fa-solid fa-calculator me-2"></i>Montant total calculé
                                </span>
                                <span className="total-preview-value">{formaterMontant(montantTotal)}</span>
                            </div>
                        )}

                        {/* Statut */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="statut">Statut</label>
                            <select
                                id="statut"
                                name="statut"
                                className="form-control"
                                value={form.statut}
                                onChange={handleChange}
                            >
                                {STATUTS.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {/* Pied de formulaire */}
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={onFermer}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            id="btn-submit-commande"
                            disabled={chargement}
                        >
                            {chargement ? (
                                <><i className="fa-solid fa-spinner fa-spin me-2"></i>Enregistrement...</>
                            ) : estEdition ? (
                                <><i className="fa-solid fa-floppy-disk me-2"></i>Modifier</>
                            ) : (
                                <><i className="fa-solid fa-plus me-2"></i>Créer la commande</>
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default OrderForm
