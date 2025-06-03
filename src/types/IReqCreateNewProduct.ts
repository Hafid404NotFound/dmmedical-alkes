export interface IReqCreateNewProduct {
  name: string;
  description: string;
  image_url: string;
  wa_link: string;
  shopee_link: string;
  tokopedia_link: string;
  bukalapak_link: string;
  video_url?: string;
  category_id: string;
}
