import axios from "axios";
const api = axios.create({ baseURL: "https://dummyjson.com" })

export const productService = {
    getProducts: async () => {
        const response = await api.get("/products?limit=0")
        return response.data;
    }
}