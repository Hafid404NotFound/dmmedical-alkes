export interface IProduct {
  id: number;
  created_at: Date;
  name: string;
  description: string;
  image_url: string;
  category_id: string;
  bukalapak_link: string;
  wa_link: string;
  shopee_link: string;
  video_url: string;
  tokopedia_link: string;
  category: {
    id: number;
    name: string;
  };
}
