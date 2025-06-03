"use client";

import Button from "./Button";

export default function DownloadCatalogButton() {
  function onDownloadCatalog() {
    const url = "/catalog.PNG";
    const link = document.createElement("a");
    link.href = url;
    link.download = "catalog.PNG";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Button onClick={onDownloadCatalog} className="w-full lg:w-fit">
      DOWNLOAD CATALOG
    </Button>
  );
}
