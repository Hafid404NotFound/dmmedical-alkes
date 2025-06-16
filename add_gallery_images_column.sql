-- Add gallery_images column to product table
-- This will store an array of image URLs for product gallery

-- Add gallery_images column as JSONB for better performance and PostgreSQL array support
ALTER TABLE product 
ADD COLUMN gallery_images JSONB DEFAULT '[]'::jsonb;

-- Add comment to document the column
COMMENT ON COLUMN product.gallery_images IS 'Array of image URLs for product gallery, stored as JSONB';

-- Create index for better query performance on gallery_images
CREATE INDEX idx_product_gallery_images ON product USING GIN (gallery_images);

-- Optional: Update existing products to have empty gallery array
UPDATE product 
SET gallery_images = '[]'::jsonb 
WHERE gallery_images IS NULL;
