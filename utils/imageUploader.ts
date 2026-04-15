import { supabase } from './supabase';

/**
 * Resizes an image file using an offscreen canvas.
 * Maintains aspect ratio while ensuring the image fits within maxWidth & maxHeight.
 */
/**
 * Resizes and crops an image to fit exactly within target dimensions (Center-Crop).
 */
export const resizeImage = (file: File, targetWidth: number, targetHeight: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const sourceWidth = img.width;
        const sourceHeight = img.height;
        const targetAspectRatio = targetWidth / targetHeight;
        const sourceAspectRatio = sourceWidth / sourceHeight;

        let sX, sY, sW, sH;

        if (sourceAspectRatio > targetAspectRatio) {
          // Source is wider than target: crop sides
          sH = sourceHeight;
          sW = sourceHeight * targetAspectRatio;
          sX = (sourceWidth - sW) / 2;
          sY = 0;
        } else {
          // Source is taller than target: crop top/bottom
          sW = sourceWidth;
          sH = sourceWidth / targetAspectRatio;
          sX = 0;
          sY = (sourceHeight - sH) / 2;
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context is not available'));
        }

        // Apply high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, sX, sY, sW, sH, 0, 0, targetWidth, targetHeight);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob failed'));
            }
          },
          'image/jpeg',
          0.92 // Better quality for banners
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Uploads a file/blob to Supabase storage.
 * 
 * --- SUPABASE CONFIGURATION NOTES ---
 * 1. Bucket: Ensure a bucket named 'slider-images' exists in Supabase Storage.
 * 2. Public Access: Set the bucket to 'Public' so images are viewable via URL.
 * 3. RLS Policies: You must add a policy to the 'storage.objects' table:
 *    - Allowed Operation: INSERT (and possibly UPDATE/DELETE)
 *    - Target: 'slider-images' bucket
 *    - Roles: public or authenticated (depending on your setup)
 *    - Example SQL: 
 *      CREATE POLICY "Allow Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'slider-images');
 */
export const uploadImageToSupabase = async (
  fileOrBlob: File | Blob, 
  bucket: string, 
  path: string
): Promise<{ url: string | null; error: any | null }> => {
  try {

    const { data, error } = await supabase.storage.from(bucket).upload(path, fileOrBlob, {
      cacheControl: '3600',
      upsert: true,
      contentType: fileOrBlob.type || 'image/jpeg',
    });

    if (error) {
      console.error('Supabase upload error detail:', error);
      return { url: null, error };
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return { url: publicUrlData.publicUrl, error: null };
  } catch (error) {
    console.error('Caught error in uploadImageToSupabase:', error);
    return { url: null, error };
  }
};
