"use client";
import { UploadService } from "@/services/upload.service";
import getCroppedImg from "@/utils/cropper-utils";
import { useCallback, useRef, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import toast from "react-hot-toast";
import { MdClose, MdOutlineUploadFile } from "react-icons/md";

import { twMerge } from "tailwind-merge";
import Slider from "./Slider";
import Button from "./Button";
import LabelInputField from "./LabelInputField";
import IconButton from "./IconButton";
import PopupModal from "./PopupModal";

export default function UploadBoxCropperArea(props: IProps) {
  const [aspectSet] = useState<number>(props.ratio || 16 / 9);
  const [zoom, setZoom] = useState<number>(1);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [fileCrop, setFileCrop] = useState<any | null>(null);
  const [cropper, setCropper] = useState<Area | null>(null);
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
  const inputRef: any = useRef(null);
  const uploadService = new UploadService();
  const uploadProcess = async (files: Blob) => {
    try {
      if (files) {
        setLoadingUpload(true);
        uploadService
          .uploadBlob(files, props.folderName)
          .then((url) => {
            if (props.onChange) props.onChange(url);
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

  const showCropper = useCallback(async () => {
    try {
      const resultCropper: any = await getCroppedImg(fileCrop, cropper, 0);
      const file: File = resultCropper.file;
      uploadProcess(file).then();
      setFileCrop(null);
    } catch (e) {
      console.error(e);
      toast.error("Gagal upload file");
    }
  }, [fileCrop, cropper]);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCropper(croppedAreaPixels);
  }, []);

  function onClearImage() {
    if (props.onChange) {
      props.onChange(undefined);
    }
  }

  function componentModalCropper() {
    return (
      <div className="flex items-end justify-center h-full lg:py-32 py-4 z-400">
        <Cropper
          image={fileCrop}
          crop={crop}
          zoom={zoom}
          aspect={aspectSet}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
        <div
          className="w-full px-8 flex justify-center items-center lg:w-[400px] flex-col gap-5"
          style={{ zIndex: 999 }}
        >
          <Slider
            aria-label="Default"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e: number) => {
              setZoom(e);
            }}
          />
          <div className="lg:flex grid grid-cols-2 gap-3    w-full">
            <Button onClick={() => setFileCrop(null)}>Cancel</Button>
            <Button onClick={showCropper}>Submit</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {props.label && (
        <LabelInputField label={props.label} required={props.required} />
      )}
      <div
        className={twMerge(
          "bg-gray-50 border border-dashed  rounded-md   h-48",
          props.errorMessage ? "border-red-700" : "border-slate-600"
        )}
      >
        <div
          className={twMerge(
            " h-full w-full flex items-center  justify-center duration-300 ",
            props.value
              ? ""
              : "hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
          )}
          onClick={() => !props.value && inputRef.current?.click()}
        >
          <div className={"h-full w-full flex items-center justify-center p-3"}>
            {props.value ? (
              <div
                className={
                  "h-full w-fit relative  p-2 bg-white rounded-md border-slate-300 flex items-center justify-center"
                }
              >
                <div className={"absolute top-0 right-0"}>
                  <IconButton
                    onClick={onClearImage}
                    className={
                      "bg-red-500 text-white hover:bg-red-700 active:bg-red-300"
                    }
                  >
                    <MdClose />
                  </IconButton>
                </div>
                <img
                  className={"h-full rounded-md"}
                  src={props.value}
                  alt="uploaded"
                />
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
        </div>

        <input
          onChange={(e: any) => {
            if (e.target.files && e.target.files.length) {
              const reader = new FileReader();
              reader.readAsDataURL(e.target.files[0]);
              reader.addEventListener("load", () => {
                setFileCrop(reader.result);
              });
            }
          }}
          onBlur={props.onBlur}
          name={props.name}
          hidden
          accept="image/*"
          type={"file"}
          ref={inputRef}
        />
      </div>
      {props.errorMessage && (
        <p
          className={twMerge(
            "text-xs mt-1",
            props.errorMessage ? "text-red-500" : "text-gray-500"
          )}
        >
          {props.errorMessage}
        </p>
      )}
      <PopupModal
        onClose={() => setFileCrop(undefined)}
        open={!!fileCrop}
        component={componentModalCropper()}
      />
    </div>
  );
}

interface IProps {
  ratio?: number;
  label?: string;
  onBlur?: any;
  required?: boolean;
  onChange?: (e?: string) => void;
  value?: string;
  name?: string;
  errorMessage?: any;
  folderName: "POST" | "PROFILE_PICTURE" | "MENU_IMAGE";
}
