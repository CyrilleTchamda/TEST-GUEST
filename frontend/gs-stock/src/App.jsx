import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import OrderList from './components/OrderList'
import OrderForm from './components/OrderForm'
import {
    fetchCommandes,
    createCommande,
    updateCommande,
    updateStatutCommande,
    deleteCommande,
    fetchDashboard
} from './services/commandeService'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
    // État pour la page courante ('dashboard' | 'commandes')
    const [pageCourante, setPageCourante] = useState('dashboard')

    // État pour le menu mobile
    const [sidebarOuverte, setSidebarOuverte] = useState(false)

    // État pour le mode sombre (persistant via localStorage)
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('GUEST_MARKETS_DARK_MODE') === 'true')

    // Effet pour appliquer la classe dark-mode sur le body
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode')
        } else {
            document.body.classList.remove('dark-mode')
        }
        localStorage.setItem('GUEST_MARKETS_DARK_MODE', darkMode)
    }, [darkMode])

    const toggleDarkMode = () => setDarkMode(prev => !prev)

    // Données de l'application
    const [commandes, setCommandes] = useState([])
    const [stats, setStats] = useState(null)

    // États de chargement
    const [chargementCommandes, setChargementCommandes] = useState(false)
    const [chargementStats, setChargementStats] = useState(false)

    // États des modaux
    const [formulaireOuvert, setFormulaireOuvert] = useState(false)
    const [commandeAEditer, setCommandeAEditer] = useState(null)

    // Charger les statistiques du tableau de bord
    const chargerStats = async () => {
        setChargementStats(true)
        try {
            const res = await fetchDashboard()
            setStats(res.data)
        } catch (err) {
            console.error('Erreur lors du chargement des stats:', err)
            toast.error('Impossible de charger les statistiques.')
        } finally {
            setChargementStats(false)
        }
    }

    // Charger la liste des commandes
    const chargerCommandes = async () => {
        setChargementCommandes(true)
        try {
            const res = await fetchCommandes()
            setCommandes(res.data)
        } catch (err) {
            console.error('Erreur lors du chargement des commandes:', err)
            toast.error('Impossible de charger les commandes.')
        } finally {
            setChargementCommandes(false)
        }
    }

    // Au montage du composant, charger les données
    useEffect(() => {
        chargerStats()
        chargerCommandes()
    }, [])

    // Soumission du formulaire (Ajout ou Modification)
    const handleFormSubmit = async (donneesFormulaire) => {
        try {
            if (commandeAEditer) {
                // Modification d'une commande existante
                const res = await updateCommande(commandeAEditer.id, donneesFormulaire)
                // Mettre à jour la liste localement
                setCommandes(prev => prev.map(cmd => cmd.id === commandeAEditer.id ? res.data : cmd))
                toast.success(`Commande ${res.data.reference} mise à jour avec succès !`)
            } else {
                // Création d'une nouvelle commande
                const res = await createCommande(donneesFormulaire)
                // Ajouter à la liste localement
                setCommandes(prev => [res.data, ...prev])
                toast.success(`Commande ${res.data.reference} créée avec succès !`)
            }
            // Mettre à jour les stats
            chargerStats()
            // Fermer le formulaire
            handleFermerFormulaire()
        } catch (err) {
            console.error('Erreur lors de la soumission du formulaire:', err)
            const message = err.response?.data?.message || "Erreur de communication avec le serveur."
            toast.error(message)
        }
    }

    // Modification rapide du statut dans le tableau
    const handleModifierStatut = async (id, nouveauStatut) => {
        try {
            const res = await updateStatutCommande(id, nouveauStatut)
            // Mettre à jour localement
            setCommandes(prev => prev.map(cmd => cmd.id === id ? res.data : cmd))
            toast.success(`Statut mis à jour : ${nouveauStatut}`)
            // Mettre à jour les stats
            chargerStats()
        } catch (err) {
            console.error('Erreur de mise à jour du statut:', err)
            toast.error("Impossible de modifier le statut.")
        }
    }

    // Suppression d'une commande
    const handleSupprimerCommande = async (id) => {
        try {
            await deleteCommande(id)
            setCommandes(prev => prev.filter(cmd => cmd.id !== id))
            toast.success('Commande supprimée avec succès.')
            // Mettre à jour les stats
            chargerStats()
        } catch (err) {
            console.error('Erreur lors de la suppression:', err)
            toast.error("Impossible de supprimer la commande.")
        }
    }

    // Ouvrir le formulaire en mode édition
    const handleEditerCommande = (commande) => {
        setCommandeAEditer(commande)
        setFormulaireOuvert(true)
    }

    // Fermer le formulaire
    const handleFermerFormulaire = () => {
        setFormulaireOuvert(false)
        setCommandeAEditer(null)
    }

    return (
        <div className="app-layout">
            {/* Sidebar gauche */}
            <Sidebar
                pageCourante={pageCourante}
                setPageCourante={setPageCourante}
                sidebarOuverte={sidebarOuverte}
                setSidebarOuverte={setSidebarOuverte}
            />

            {/* Overlay d'arrière-plan sur mobile */}
            {sidebarOuverte && (
                <div className="sidebar-overlay" onClick={() => setSidebarOuverte(false)}></div>
            )}

            {/* Zone principale */}
            <main className="app-main">
                {/* Topbar supérieure */}
                <header className="topbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            className="mobile-menu-toggle btn btn-ghost btn-icon"
                            onClick={() => setSidebarOuverte(true)}
                            title="Ouvrir le menu"
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        <div>
                            <div className="topbar-title">Guest Markets</div>
                            <div className="topbar-subtitle">
                                {pageCourante === 'dashboard' ? 'Tableau de bord' : 'Gestion des commandes'}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Bouton Mode Sombre */}
                        <button
                            className="btn btn-ghost btn-icon"
                            onClick={toggleDarkMode}
                            title={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
                            style={{ fontSize: '16px' }}
                        >
                            {darkMode ? (
                                <i className="fa-solid fa-sun text-warning"></i>
                            ) : (
                                <i className="fa-solid fa-moon"></i>
                            )}
                        </button>

                        {pageCourante === 'commandes' && (
                            <button
                                id="btn-nouvelle-commande"
                                className="btn btn-primary"
                                onClick={() => setFormulaireOuvert(true)}
                            >
                                <i className="fa-solid fa-plus me-1"></i> Nouvelle commande
                            </button>
                        )}
                    </div>
                </header>

                {/* Contenu de la page */}
                <div className="page-content">
                    {pageCourante === 'dashboard' ? (
                        <Dashboard stats={stats} chargement={chargementStats} />
                    ) : (
                        <div>
                            {/* En-tête de page */}
                            <div className="page-header">
                                <div className="page-header-text">
                                    <h1>Gestion des commandes</h1>
                                    <p>Suivi, modification et enregistrement des commandes clients</p>
                                </div>
                            </div>

                            {/* Liste & filtres */}
                            <OrderList
                                commandes={commandes}
                                chargement={chargementCommandes}
                                onModifierStatut={handleModifierStatut}
                                onSupprimer={handleSupprimerCommande}
                                onEditer={handleEditerCommande}
                            />
                        </div>
                    )}
                </div>
            </main>

            {/* Formulaire Modal */}
            {formulaireOuvert && (
                <OrderForm
                    onSubmit={handleFormSubmit}
                    onFermer={handleFermerFormulaire}
                    commandeAEditer={commandeAEditer}
                />
            )}

            {/* Notifications toast */}
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    )
}

export default App
