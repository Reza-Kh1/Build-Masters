import { useLocation } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { fetchProject } from "../../services/project";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AllProjectType } from "../../type";
import SearchBox from "../../components/SearchBox/SearchBox";
import DontData from "../../components/DontData/DontData";
import Create from "./Create";
import { myThemeTable } from "../../main";
import { AgGridReact } from "ag-grid-react";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import { ColDef, ICellRendererParams } from "ag-grid-community";
export default function Projects() {
  const [searchQuery, setSearchQuery] = useState<any>();
  const { search } = useLocation();
  const { data } = useInfiniteQuery<AllProjectType>({
    queryKey: ["AllProject", searchQuery],
    queryFn: () => fetchProject(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage || undefined,
    initialPageParam: "",
  });
  useEffect(() => {
    const query = queryString.parse(search);
    setSearchQuery(query);
  }, [search]);
  const columnDefs: ColDef[] = [
    { field: "name", headerName: "نام", flex: 2 },
    { field: "slug", headerName: "اسلاگ", flex: 2 },
    { field: "image", headerName: "عکس", flex: 2, cellRenderer: (params: ICellRendererParams) => (<img src={params.value} alt="project" className="w-12 h-12 shadow-md rounded-full" />) },
    { field: "isPublished", headerName: "وضعیت انتشار", flex: 1 },
    { field: "Contractor", headerName: "نام مجری", flex: 1, valueFormatter: (p) => p.value?.name || '----' },
    { field: "Category", headerName: "نام دسته", flex: 1, valueFormatter: (p) => p.value?.name || '----' },
    {
      field: "Tags", headerName: "تگ ها", flex: 2, cellRenderer: (params: ICellRendererParams) => (
        <div className="flex gap-1 items-center">
          {params.value.length ? params.value.map((tag: any, index: number) => (
            <span key={index} className="ml-1">
              {tag?.name || ''},
            </span>))
            : null}
        </div>
      ),
    },
    { field: "updateAt", headerName: "اخرین آپدیت", flex: 1, valueFormatter: p => new Date(p.value).toLocaleDateString("fa") },
    {
      headerName: "عملیات",
      field: "id",
      width: 200,
      filter: false,
      sortable: false,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex gap-2 h-full items-center justify-center">
          <Create id={params.data.slug} />
          <DeleteButton id={params.value} keyQuery="GetUsers" urlAction="user" headerText="حذف کاربران" />
        </div>
      ),
    },
  ]
  return (
    <div className="w-full">
      <Create />
      <div>
        <SearchBox status nameWorker />
      </div>
      {
        data?.pages[0].data.length ?
          <>
            <div className="my-4 w-full h-[450px] [--ag-font-size:16px] [--ag-font-family:iranSans]">
              <AgGridReact
                enableRtl
                rowData={data?.pages[0]?.data}
                columnDefs={columnDefs}
                rowHeight={55}
                theme={myThemeTable}
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
          :
          <DontData
            text={"پروژه ای یافت نشد!"}
          />
      }
    </div>
  );
}
