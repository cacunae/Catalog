export type ProductImage = {
  id: string
  src: string
  alt: string
  fallbackSrc?: string
}

export type Product = {
  id: string
  name: string
  price: number
  brand?: string
  category?: string
  images: ProductImage[]
}

export type CartItem = {
  product: Product
  quantity: number
}

export type ApiProduct = {
  id: string
  name: string
  price: number
  brand?: string | null
  category?: string | null
  imageUrl?: string | null
}

export type ApiProductsResponse = {
  items: ApiProduct[]
}
