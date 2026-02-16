import type { ApiProductsResponse } from '../types/product'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080'

export type ProductQueryParams = {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  search?: string
  brand?: string
  category?: string
}

export const fetchProducts = async (params: ProductQueryParams): Promise<ApiProductsResponse> => {
  const searchParams = new URLSearchParams()
  searchParams.set('page', String(params.page ?? 0))
  searchParams.set('size', String(params.size ?? 100))
  searchParams.set('sortBy', params.sortBy ?? 'id')
  searchParams.set('sortDir', params.sortDir ?? 'asc')

  if (params.search?.trim()) searchParams.set('search', params.search.trim())
  if (params.brand?.trim()) searchParams.set('brand', params.brand.trim())
  if (params.category?.trim()) searchParams.set('category', params.category.trim())

  const response = await fetch(`${API_BASE_URL}/api/products?${searchParams.toString()}`)
  if (!response.ok) {
    throw new Error(`No se pudieron cargar productos (${response.status})`)
  }

  return (await response.json()) as ApiProductsResponse
}
