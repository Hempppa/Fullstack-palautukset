import axios from 'axios'
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/"

const getAll = () => {
    return axios.get(baseUrl + "all").then(response => (response.data))
}

const getOne = (country) => {
    return axios.get(baseUrl + "name/" + country).then(response => (response.data))
}

export default {getAll, getOne}