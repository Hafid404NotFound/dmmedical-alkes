export interface IReqCreateNewProduct {
  name: string;
  description: string;
  image_url: string;
  gallery_images?: string[];
  images360?: string[];
  wa_link: string;
  shopee_link: string;
  tokopedia_link: string;
  bukalapak_link: string;
  category_id: string;
}
