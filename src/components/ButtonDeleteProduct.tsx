"use client";
import { createClient } from "@/utils/supabase/client";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toast-helper";
import { useState } from "react";
import PopupModal from "./PopupModal";
import { Card, CardBody } from "./Card";

export function ButtonDeleteProduct(props: IProps) {
  const [show, setShow] = useState<boolean>(false);
  const supabase = createClient();
  const router = useRouter();
  async function onDelete() {
    const { error } = await supabase
      .from("product")
      .delete()
      .eq("id", props.id);
    if (error) {
      console.error("Error deleting:", error.message);
    } else {
      showToast.success("Deleted successfully");
      router.push("/dashboard/product");
    }
  }

  function body() {
    return (
      <Card>
        <CardBody>
          <div>
            <div className="py-5 px-4 text-center">
              Yakin ingin menghapus produk ?
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                className="bg-red-700 hover:bg-red-800 active:bg-red-600"
                onClick={() => setShow(true)}
              >
                Batal
              </Button>
              <Button onClick={onDelete}>Ya</Button>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
  return (
    <>
      <PopupModal
        component={body()}
        open={show}
        onClose={() => setShow(false)}
      />
      <Button
        className="bg-red-700 hover:bg-red-800 active:bg-red-600"
        onClick={() => setShow(true)}
      >
        Delete product
      </Button>
    </>
  );
}

interface IProps {
  id: string;
}
