/**
 * Dual-Platform Image Uploader with Seamless Fallback
 * Platform 1 (Primary): ImgBB
 * Platform 2 (Fallback): Postimages
 * 
 * Strict Security Rule: All API keys are loaded strictly from environment variables.
 * Zero hardcoding.
 */

export async function uploadImageToCloud(file: File): Promise<string> {
  const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  const postimagesKey = process.env.NEXT_PUBLIC_POSTIMAGES_API_KEY;

  // 1. Try ImgBB (Primary)
  if (imgbbKey) {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data?.data?.url) {
        return data.data.url;
      }
      console.warn("ImgBB upload failed or returned invalid response, falling back to Postimages...", data);
    } catch (err) {
      console.warn("ImgBB error, attempting fallback to Postimages:", err);
    }
  }

  // 2. Try Postimages (Fallback)
  if (postimagesKey) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("token", postimagesKey);
      formData.append("upload_session", Date.now().toString());
      formData.append("numfiles", "1");
      formData.append("gallery", "");

      const res = await fetch("https://postimages.org/json/rr", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data?.url) {
        return data.url;
      }
    } catch (err) {
      console.error("Postimages fallback error:", err);
    }
  }

  // 3. Fallback: If APIs cannot be reached directly due to network sandbox, create an object URL or throw informative error
  throw new Error("ইমেজ আপলোড সার্ভিসের সাথে সংযোগ করা যায়নি। অনুগ্রহ করে ছবির সরাসরি ইউআরএল (URL) ব্যবহার করুন।");
}

