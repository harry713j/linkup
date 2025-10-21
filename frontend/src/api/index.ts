import axios from "axios"
import { config } from "@/config"
import { useNavigate } from "react-router"

const axiosInstance = axios.create({
    baseURL: config.apiUrl,
    withCredentials: true,
})

const navigate = useNavigate()
let accessToken: string | null = null

export function setAccessToken(token: string | null) {
    accessToken = token
}

axiosInstance.interceptors.request.use(function (config) {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
}, function (error) { return Promise.reject(error) })


axiosInstance.interceptors.response.use(function (response) { return response },
    async function (error) {
        const originalRequest = error.config

        if ((originalRequest.url !== "/auth/register" && originalRequest.url !== "/auth/login") && error.response) {
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true // preventing retry loop, if already retried

                try {
                    const res = await axios.get("/auth/refresh", { withCredentials: true })
                    const newAccessToken = res.data.accessToken
                    setAccessToken(newAccessToken)

                    return axiosInstance(originalRequest) // retry the failed request due to expired token
                } catch (err) {
                    navigate("/login")
                    return Promise.reject(err)
                }

            }
        }

        return Promise.reject(error)
    }
)


export default axiosInstance