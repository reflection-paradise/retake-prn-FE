export interface CreateAccountRequest {
  name: string;
  description: string;
  categoryId: number;
  origin: string;
  model: string;
  occasion: string;
  style: string;
  material: string;
  status: string;
  images: File[];
}

export interface CreateAccountRespond {
  data: number;
  status: boolean;
  message: string;
}
