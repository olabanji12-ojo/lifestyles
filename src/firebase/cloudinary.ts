// src/firebase/cloudinary.ts

// 1.  Read everything from the Vite env
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

// 2.  Tiny guard so the build fails fast if something is missing
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  throw new Error('Missing Cloudinary environment variables – check .env');
}

/* ------------------------------------------------------------------ */
/*  UNSIGNED UPLOADS (perfect for front-end)                          */
/* ------------------------------------------------------------------ */

/**
 * Upload a single file to Cloudinary (returns the secure URL)
 */
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  fd.append('folder', 'inspire-products'); // optional organisation

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: fd }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${text}`);
  }

  const data = await res.json();
  return data.secure_url as string;
};

/**
 * Upload many files in parallel
 */
export const uploadMultipleImagesToCloudinary = async (
  files: File[]
): Promise<{ success: boolean; urls: string[] }> => {
  try {
    const urls = await Promise.all(files.map(uploadImageToCloudinary));
    return { success: true, urls };
  } catch (e) {
    console.error('Cloudinary batch upload error:', e);
    return { success: false, urls: [] };
  }
};

/**
 * Upload a request image (different folder)
 */
export const uploadRequestImage = async (
  file: File
): Promise<{ success: boolean; url: string }> => {
  try {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    fd.append('folder', 'inspire-requests');

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: fd }
    );

    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return { success: true, url: data.secure_url };
  } catch (e) {
    console.error('Request image upload error:', e);
    return { success: false, url: '' };
  }
};

/* ------------------------------------------------------------------ */
/*  SIGNED OPERATIONS (backend only) – example, not used here         */
/* ------------------------------------------------------------------ */
// If you ever need to delete or transform assets securely, call a
// Cloud-function route that uses the Node SDK with API_SECRET.