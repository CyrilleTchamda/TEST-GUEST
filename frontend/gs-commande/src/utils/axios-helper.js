import axios from 'axios'
import API_URL from '../api/config'

// Instance Axios avec l'URL de base du backend
const axiosInstance = axios.create({
    baseURL: API_URL,
})

export default axiosInstance
