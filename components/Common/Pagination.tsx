"use client";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export type paginationProp = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPage: number;
  limit?: number;
  setLimit?: React.Dispatch<React.SetStateAction<number>>;
  total?: number;
  limitOptions?: number[];
};

const Pagination = ({
  totalPage = 1,
  page,
  setPage,
  limit,
  setLimit,
  total,
  limitOptions = [10, 20, 50, 100],
}: paginationProp) => {
  const safeTotalPage = Math.max(1, totalPage || 1);
  let start = Math.max(1, page - 1);
  let end = Math.min(safeTotalPage, start + 2);

  if (end - start + 1 > 3) {
    end = start + 2;
  }

  if (end > safeTotalPage) {
    end = safeTotalPage;
    start = Math.max(1, end - 2);
  }

  const visiblePages = [];
  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }

  const currentLimit = limit || 10;
  const startItem = total && total > 0 ? (page - 1) * currentLimit + 1 : 0;
  const endItem = total ? Math.min(page * currentLimit, total) : 0;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center ${
        setLimit || typeof total === "number"
          ? "justify-between"
          : "justify-end"
      } gap-4 mt-6 w-full`}
    >
      {(setLimit || typeof total === "number") && (
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          {setLimit && (
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Rows per page:
              </span>
              <select
                value={currentLimit}
                onChange={(e) => {
                  const newLimit = Number(e.target.value);
                  setLimit(newLimit);
                  setPage(1);
                }}
                className="border border-gray-300 rounded-md px-2.5 py-1 text-sm bg-white text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-bprimary focus:border-bprimary cursor-pointer shadow-xs"
              >
                {limitOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
          {typeof total === "number" && (
            <span className="text-xs sm:text-sm text-gray-500 font-normal">
              Showing {startItem}–{endItem} of {total}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className={`p-2 rounded-md border transition flex items-center gap-1 ${
            page <= 1
              ? "bg-bprimary/10 text-bprimary/40 cursor-not-allowed border-gray-200"
              : "bg-cyan-50 hover:bg-gray-100 cursor-pointer"
          }`}
        >
          <IoIosArrowBack size={15} className="text-bprimary text-xl" />
        </button>
        {start > 1 && <span className="px-2 text-gray-400">...</span>}
        {visiblePages.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded-md text-sm transition cursor-pointer ${
              page === p
                ? "bg-bprimary text-white border-primary font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}
        {end < safeTotalPage && <span className="px-2 text-bprimary">...</span>}

        <button
          disabled={page >= safeTotalPage}
          onClick={() => setPage(page + 1)}
          className={`p-2 rounded-md flex items-center gap-1 border transition ${
            page >= safeTotalPage
              ? "bg-bprimary/10 text-bprimary/40 cursor-not-allowed border-gray-200"
              : "bg-cyan-50 hover:bg-gray-100 cursor-pointer"
          }`}
        >
          <IoIosArrowForward size={15} className="text-bprimary text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
