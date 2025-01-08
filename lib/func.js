
import axios from 'axios';

export async function fetchJson(url) {
    try {
        const fetch = await axios.get(url)   
        const json = fetch.data
        return json
    } catch (error) {
        console.log("fetch error", error)
    }   
}
