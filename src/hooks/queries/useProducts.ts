'use client'
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/app/api/product/service";

export const useProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: productService.getProducts,
    })
}