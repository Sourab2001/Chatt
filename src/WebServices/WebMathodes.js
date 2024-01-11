import axios from "axios"

export default {
    postApi : (url,data)=>{
        const rspn = axios.post(url,data)
        return rspn
    },
    getApi : (url,token)=>{
        return axios.get(url,{
            headers: {
                Authorization: "Bearer " + token
             }
        })
    },
    putApi : (url,token,data)=>{
        return axios.put(
            url,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
          );
    },
    postApiAuth : (url,token)=>{
        const rspn = axios.post(url, { headers: { Authorization: `Bearer ${token}` } })
        return rspn
    },
    postApiAuthData : (url,token,data)=>{
        const rspn = axios.post(url,data,{ headers: { Authorization: `Bearer ${token}` } })
        return rspn
    }
}