import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface ITableColumn<T> {
  headerTitle?: string;
  component?: (data: T) => ReactNode;
  width?: string;
}

interface IProps {
  data: any[];
  column: ITableColumn<any>[];
  loading?: boolean;
  cellClassName?: string;
}

function Table(props: IProps) {
  const { cellClassName = "" } = props;

  return (
    <div className="w-full overflow-x-auto">
      <table className="table-auto bg-white w-full">
        <thead>
          <tr className="border-b">
            {props.column.map((header, i) => (
              <th
                className={twMerge(
                  "text-start py-3 px-2 font-semibold text-sm text-gray-700",
                  i === 0 && "pl-4"
                )}
                key={i}
                style={{ width: header.width }}
              >
                {header.headerTitle}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {props.loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {props.column.map((_, idx) => (
                  <td
                    key={idx + 1}
                    className={twMerge("py-4", idx === 0 && "pl-4", "border-b")}
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : props.data.length === 0 ? (
            <tr>
              <td
                colSpan={props.column.length}
                className="text-center py-8 text-gray-500"
              >
                Tidak ada data
              </td>
            </tr>
          ) : (
            props.data.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {props.column.map((column, idx) => (
                  <td
                    key={idx}
                    className={twMerge(
                      "py-2",
                      idx === 0 && "pl-4",
                      "border-b",
                      cellClassName
                    )}
                  >
                    {column.component && column.component(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
