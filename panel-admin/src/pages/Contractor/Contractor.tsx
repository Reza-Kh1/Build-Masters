import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchContractor } from "../../services/contractor";
import queryString from "query-string";
import { AllContractorType } from "../../type";
import Pagination from "../../components/Pagination/Pagination";
import SearchBox from "../../components/SearchBox/SearchBox";
import DontData from "../../components/DontData/DontData";
import Create from "./Create";
import { AgGridReact } from "ag-grid-react";
import { myThemeTable } from "../../main";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import DeleteButton from "../../components/DeleteButton/DeleteButton";

export default function Contractor() {
  const [searchQuery, setSearchQuery] = useState<any>();
  const { search } = useLocation();
  const { data } = useInfiniteQuery<AllContractorType>({
    queryKey: ["AllContractor", searchQuery],
    queryFn: () => fetchContractor(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    getNextPageParam: (lastPage) => lastPage?.pagination?.nextPage || undefined,
    initialPageParam: "",
  });

  useEffect(() => {
    const query = queryString.parse(search);
    setSearchQuery(query);
  }, [search]);
  const columnDefs: ColDef[] = [
    {
      field: "avatar", headerName: "عکس", flex: 1,rowDrag: true ,
      cellRenderer: (params: ICellRendererParams) => (<img src={params.value} alt="project" className="w-12 h-12 shadow-md rounded-full" />)
    },
    { field: "name", headerName: "نام" },
    { field: "rating", width: 120, headerName: "امتیاز" },
    { field: "totalComment", width: 120, headerName: "کامنت" },
    { field: "Category", headerName: "دسته", valueFormatter: p => p.value?.name, flex: 1 },
    {
      field: "Tags",
      headerName: "تگ",
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex gap-1 items-center">
          {params.value.length ? params.value.map((tag: { id: string, name: string }) => (
            <span key={tag.id} className="ml-1">
              {tag?.name},
            </span>))
            : null}
        </div>
      ), flex: 1
    },
    { field: "createdAt", width: 120, headerName: "تاریخ", valueFormatter: p => new Date(p.value).toLocaleDateString("fa") },
    {
      headerName: "عملیات",
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex gap-2 h-full items-center justify-center w-full">
          <Create id={params.data.name} />
          <DeleteButton id={params.value} keyQuery="AllContractor" urlAction="contractor" headerText="حذف مجری" />
        </div>
      ),
      field: "id",
      width: 200,
      filter: false,
      sortable: false,
    },
  ]
  return (
    <div className="w-full">
      <Create />
      <div>
        <SearchBox order searchText tag category />
      </div>
      {data?.pages[0]?.data.length ? (
        <>
          <div className="my-4 w-full h-[450px] [--ag-font-size:16px] [--ag-font-family:iranSans]">
            <AgGridReact
              rowData={data?.pages[0]?.data}
              columnDefs={columnDefs}
              rowHeight={55}
              theme={myThemeTable}
              enableRtl
              rowDragManaged
              defaultColDef={{
                cellStyle: { direction: 'rtl' },
                headerStyle: { direction: 'rtl' },
                filter: true,
                sortable: true,
                resizable: true,
              }}
            />
          </div>
          <Pagination pager={data?.pages[0].pagination} />
        </>
      ) : <DontData text="هیچ مجری ثبت نشده است" />}
    </div>
  );
}
