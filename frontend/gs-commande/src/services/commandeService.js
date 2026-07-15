import axiosInstance from '../utils/axios-helper'

const BASE_URL = '/api/commandes'

// Récupérer toutes les commandes
export const fetchCommandes = () => {
    return axiosInstance.get(BASE_URL)
}

// Récupérer une commande par ID
export const fetchCommandeById = (id) => {
    return axiosInstance.get(`${BASE_URL}/${id}`)
}

// Créer une nouvelle commande
export const createCommande = (data) => {
    return axiosInstance.post(BASE_URL, data)
}

// Modifier une commande complète
export const updateCommande = (id, data) => {
    return axiosInstance.put(`${BASE_URL}/${id}`, data)
}

// Modifier uniquement le statut d'une commande
export const updateStatutCommande = (id, statut) => {
    return axiosInstance.put(`${BASE_URL}/${id}/statut`, { statut })
}

// Supprimer une commande
export const deleteCommande = (id) => {
    return axiosInstance.delete(`${BASE_URL}/${id}`)
}

// Récupérer les indicateurs du tableau de bord
export const fetchDashboard = () => {
    return axiosInstance.get(`${BASE_URL}/dashboard`)
}
