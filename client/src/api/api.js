import axios from 'axios'
import { api_url } from '../utils/config'
const api = axios.create({
     baseURL: 'http://multi-vendor-5z5y.onrender.com/api'
})
export default api