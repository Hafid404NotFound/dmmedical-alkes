import { createClient } from "@supabase/supabase-js";

import toast from "react-hot-toast";

export class UploadService {
  private supabse: any = null;
  private bucketName = String(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME);

  constructor() {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      throw new Error("Missing Supabase environment variables");
    }
    this.supabse = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    if (!this.bucketName) {
      throw new Error("Bucket name is not defined in environment variables");
    }
  }

  public async uploadMultiple(
    files: File[] | FileList,
    folder: string
  ): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        const filePath = `${folder}/${Date.now()}_${file.name}`;

        const { error } = await this.supabse.storage
          .from(this.bucketName)
          .upload(filePath, file, {
            contentType: file.type || "application/octet-stream",
          });

        if (error) {
          toast.error(`Upload failed: ${error.message}`);
          continue;
        }

        const url = `${process.env
          .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${
          this.bucketName
        }/${filePath}`;
        uploadedUrls.push(url);
      } catch (err) {
        toast.error("Unexpected error during upload");
        console.error(err);
      }
    }

    return uploadedUrls;
  }
  public async upload(file: File, folder: string): Promise<string | undefined> {
    try {
      const filePath = `${folder}/${Date.now()}_${file.name}`;

      const { error } = await this.supabse.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          contentType: file.type || "application/octet-stream",
        });

      if (error) {
        toast.error(`Upload failed: ${error.message}`);
        return;
      }

      return `${process.env
        .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${
        this.bucketName
      }/${filePath}`;
    } catch (err) {
      toast.error("Unexpected error during upload");
      console.error(err);
    }
  }

  public async uploadBlob(
    file: Blob,
    folder: string
  ): Promise<string | undefined> {
    try {
      const fileName =
        file instanceof File && file.name ? file.name : "upload.png";
      const filePath = `${folder}/${Date.now()}_${fileName}`;

      const { error } = await this.supabse.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          contentType: file.type || "application/octet-stream",
        });

      if (error) {
        toast.error(`Upload failed: ${error.message}`);
        return;
      }

      return `${process.env
        .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${
        this.bucketName
      }/${filePath}`;
    } catch (err) {
      toast.error("Unexpected error during upload");
      console.error(err);
    }
  }
}
