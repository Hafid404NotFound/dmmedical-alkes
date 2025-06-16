-- Migration to add gallery_images and images360 columns to product table
-- Run this script in your Supabase SQL editor

-- Step 1: Add gallery_images column (if not exists)
ALTER TABLE product 
ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;

-- Step 2: Add images360 column to store 360-degree image arrays
ALTER TABLE product 
ADD COLUMN IF NOT EXISTS images360 JSONB DEFAULT '[]'::jsonb;

-- Step 3: Add indexes for better performance when querying
CREATE INDEX IF NOT EXISTS idx_product_gallery_images 
ON product USING GIN (gallery_images);

CREATE INDEX IF NOT EXISTS idx_product_images360 
ON product USING GIN (images360);

-- Step 4: Update existing products to have empty arrays if null
UPDATE product 
SET gallery_images = '[]'::jsonb 
WHERE gallery_images IS NULL;

UPDATE product 
SET images360 = '[]'::jsonb 
WHERE images360 IS NULL;

-- Step 5: Add comments to document the columns
COMMENT ON COLUMN product.gallery_images IS 'Array of URLs for product gallery images stored as JSONB';
COMMENT ON COLUMN product.images360 IS 'Array of URLs for 360-degree product images stored as JSONB';

-- Step 6: Add constraints to ensure columns are always arrays
ALTER TABLE product 
ADD CONSTRAINT check_gallery_images_is_array 
CHECK (jsonb_typeof(gallery_images) = 'array');

ALTER TABLE product 
ADD CONSTRAINT check_images360_is_array 
CHECK (jsonb_typeof(images360) = 'array');

-- Step 7: Verify the migration
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'product' AND column_name IN ('gallery_images', 'images360');

-- Migration completed successfully!
