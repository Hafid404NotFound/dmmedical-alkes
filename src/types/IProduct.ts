export interface IProduct {
  id: number;
  created_at: Date;
  name: string;
  description: string;
  image_url: string;
  gallery_images?: string[] | string; // Support both array and JSON string from database
  images360?: string[] | string; // Support both array and JSON string from database
  category_id: string;
  bukalapak_link: string;
  wa_link: string;
  shopee_link: string;
  tokopedia_link: string;
  category: {
    id: number;
    name: string;
  };
}
