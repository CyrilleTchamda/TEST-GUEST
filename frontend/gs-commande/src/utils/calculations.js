// Calcul du montant total d'une commande
// Formule : quantite x prixUnitaire
export const calculerMontantTotal = (quantite, prixUnitaire) => {
    return quantite * prixUnitaire
}

// Formater un montant en FCFA avec séparateur de milliers
// Exemple : 350000 → "350 000 FCFA"
export const formaterMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA'
}

// Formater une date ISO en format lisible
// Exemple : "2026-07-15T..." → "15/07/2026"
export const formaterDate = (dateISO) => {
    if (!dateISO) return '-'
    const date = new Date(dateISO)
    return date.toLocaleDateString('fr-FR')
}

// Calcul du chiffre d'affaires total (hors commandes annulées)
export const calculerChiffreAffaires = (commandes) => {
    return commandes
        .filter(cmd => cmd.statut !== 'Annulée')
        .reduce((total, cmd) => total + cmd.montantTotal, 0)
}
