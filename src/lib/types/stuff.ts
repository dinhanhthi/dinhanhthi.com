export interface Stuff {
  id: string
  title: string
  url: string
  image_url: string | null
  description: string | null
  notes: string | null
  created_at: string
  tags: string[]
}

export interface StuffFormData {
  title: string
  url: string
  image_url: string
  description: string
  notes: string
  tags: string[]
}

export interface URLMetadata {
  title: string
  description: string
  image: string
  url: string
}

export interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
  width: number
  height: number
}
