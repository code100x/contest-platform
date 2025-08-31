// "use server"
import { jwtDecode } from "jwt-decode";
import { BACKEND_URL } from "@/config/index";
import axios from "axios";

const getAuthStateSSR = async () => {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/refresh`, {}, {
            withCredentials: true,
        });
        
        if(response.status === 200){
            const data = response.data;
            return { accessToken: data.accessToken, user: data.user}
        }
    }catch(error){
        console.log("getAuthStateSSR Error:", error);
        return null;
    }
}

const getTokenExpiration = (token: string) => {
    try {
        const decoded = jwtDecode(token);
        if (typeof decoded === "object" && decoded && "exp" in decoded && typeof decoded.exp === "number") {
            return decoded.exp * 1000;
        }
        return null;
    }catch(error){
        console.log("getTokenExpiration Error:", error);
        return null;
    }
}

export { getAuthStateSSR, getTokenExpiration }