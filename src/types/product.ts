export interface ProductType {
  title: string
  product_link: string
  product_id: string
  scrapingdog_product_link: string
  source: string
  price: string
  extracted_price: number
  old_price?: string
  old_price_extracted?: number
  rating?: number
  reviews?: string
  tag?: string
  extensions?: string[]
  thumbnail: string
  position: number
}

