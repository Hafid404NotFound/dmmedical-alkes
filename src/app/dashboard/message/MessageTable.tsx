"use client";

import Table, { ITableColumn } from "@/components/Table";
import DeleteMessageButton from "@/components/DeleteMessageButton";
import { IQuestion } from "@/types/IQuestion";
import DateHelper from "@/utils/date-helper";
import { MdMailOutline, MdPhone, MdCalendarToday } from "react-icons/md";
import { useState } from "react";

interface MessageTableProps {
  initialData: IQuestion[];
}

export default function MessageTable({ initialData }: MessageTableProps) {
  const [data, setData] = useState<IQuestion[]>(initialData);
  const dateHelper = new DateHelper();
  const handleDeleteSuccess = () => {
    // Refresh data setelah penghapusan berhasil
    window.location.reload();
  };

  // Function to truncate message for preview
  const truncateMessage = (message: string, maxLength: number = 60) => {
    return message.length > maxLength
      ? message.substring(0, maxLength) + "..."
      : message;
  };

  const tableColumn: ITableColumn<IQuestion>[] = [
    {
      headerTitle: "Pengirim",
      component: (e: IQuestion) => (
        <div className="p-2 sm:p-3 min-w-[250px] space-y-1">
          <div className="font-semibold text-primary-main text-sm sm:text-base">
            {e.name}
          </div>
          <div className="text-gray-600 text-xs sm:text-sm flex items-center gap-1.5">
            <MdMailOutline className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>{e.email}</span>
          </div>
          {e.phone && (
            <div className="text-gray-600 text-xs sm:text-sm flex items-center gap-1.5">
              <MdPhone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>{e.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      headerTitle: "Pesan",
      component: (e: IQuestion) => (
        <div className="p-2 sm:p-3 min-w-[300px]">
          <div className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {e.message}
          </div>
        </div>
      ),
    },
    {
      headerTitle: "Tanggal",
      component: (e: IQuestion) => (
        <div className="p-2 sm:p-3 min-w-[180px] flex items-center gap-1.5">
          <MdCalendarToday className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-main flex-shrink-0" />
          <span className="text-gray-600 text-xs sm:text-sm">
            {e.created_at
              ? dateHelper.toFormatDate(e.created_at, "dd LLLL, yyyy - HH:mm")
              : "-"}
          </span>
        </div>
      ),
    },
    {
      headerTitle: "Aksi",
      component: (e: IQuestion) => (
        <div className="p-2 sm:p-3 min-w-[120px] flex justify-center">
          <DeleteMessageButton
            messageId={e.id}
            messageName={e.name}
            messagePreview={truncateMessage(e.message)}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/80 overflow-hidden">
      <div className="overflow-x-auto w-full">
        <Table data={data} column={tableColumn} />
      </div>
    </div>
  );
}
