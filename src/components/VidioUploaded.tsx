import { UploadService } from "@/services/upload.service";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineUploadFile } from "react-icons/md";
import LabelInputField from "./LabelInputField";
import ParallaxScrollScrubVideo from "./ScroolVideo";

export default function VidioUplaoded(props: IProps) {
  const inputRef: any = useRef(null);
  const uploadService = new UploadService();
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);

  const uploadProcess = async (files: File) => {
    try {
      if (files) {
        setLoadingUpload(true);
        uploadService
          .upload(files, "video")
          .then((url) => {
            if (props.onChange && url) props.onChange(url);
            setLoadingUpload(false);
          })
          .catch((e) => {
            setLoadingUpload(false);
            toast.error("Gagal upload file");
          });
      } else {
        setLoadingUpload(false);
      }
    } catch (error) {
      setLoadingUpload(false);
      console.error("Error during image compression:", error);
    }
  };

  return (
    <div>
      <LabelInputField label="Upload videio 360" required />
      <div
        onClick={() => !props.value && inputRef.current?.click()}
        className="bg-slate-50 mt-2 rounded-lg p-5 border-gray-500 flex items-center justify-center min-h-40 border-2 border-dashed "
      >
        {props.value ? (
          <div className="relative z-[99] w-full aspect-video">
            <ParallaxScrollScrubVideo value={props.value} />
          </div>
        ) : (
          <>
            {loadingUpload ? (
              <div>Loading</div>
            ) : (
              <MdOutlineUploadFile className={"text-gray-400 text-5xl"} />
            )}
          </>
        )}
      </div>
      <input
        onChange={(e: any) => {
          if (e.target.files && e.target.files.length) {
            uploadProcess(e.target.files[0]);
          }
        }}
        hidden
        accept="video/*"
        type={"file"}
        ref={inputRef}
      />
    </div>
  );
}

interface IProps {
  onChange?: (e: string) => void;
  value?: string;
}
