// lib/uploadImage.ts
import { createClient } from "@/utils/supabase/client";

export async function uploadImage(file: File): Promise<string> {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `markers/${fileName}`;

  const { error } = await supabase.storage
    .from("marker-images")
    .upload(filePath, file);

  if (error) throw new Error("Image upload failed");

  const { data } = supabase.storage
    .from("marker-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
