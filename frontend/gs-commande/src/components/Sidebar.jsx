import React from 'react'
import logo from '../assets/logo.png'

// Composant Sidebar — Navigation latérale
const Sidebar = ({ pageCourante, setPageCourante, sidebarOuverte, setSidebarOuverte }) => {

    const navItems = [
        {
            id: 'dashboard',
            label: 'Tableau de bord',
            icon: <i className="fa-solid fa-chart-line"></i>
        },
        {
            id: 'commandes',
            label: 'Commandes',
            icon: <i className="fa-solid fa-cart-shopping"></i>
        },
    ]

    return (
        <aside className={`sidebar ${sidebarOuverte ? 'open' : ''}`}>

            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-text">
                    <img src={logo} alt="Guest Markets Cameroun" style={{width: "100%", height: "auto", boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)"}}/>
                </div>
                <button
                    className="sidebar-close-btn"
                    onClick={() => setSidebarOuverte(false)}
                    title="Fermer"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <div
                        key={item.id}
                        className={`sidebar-nav-item ${pageCourante === item.id ? 'active' : ''}`}
                        onClick={() => {
                            setPageCourante(item.id)
                            setSidebarOuverte(false)
                        }}
                        id={`nav-${item.id}`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                Guest Markets © 2026
            </div>

        </aside>
    )
}

export default Sidebar
