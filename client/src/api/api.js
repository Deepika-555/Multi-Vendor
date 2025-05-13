import axios from 'axios'
import { api_url } from '../utils/config'
const api = axios.create({
     baseURL: 'http://localhost:5000/api'
})
export default api