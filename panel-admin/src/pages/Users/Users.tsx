import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUser } from "../../services/user";
import axios from "axios";
import { toast } from "react-toastify";
import { UserArrayType } from "../../type";
import { FaUser } from "react-icons/fa6";
import { useEffect, useState } from "react";
import PendingApi from "../../components/PendingApi/PendingApi";
import Pagination from "../../components/Pagination/Pagination";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import SearchBox from "../../components/SearchBox/SearchBox";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { myThemeTable } from "../../main";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import EditButton from "../../components/EditButton/EditButton";
import CreateButton from "../../components/CreateButton/CreateButton";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState<any>("");
  const query = useQueryClient();
  const { search } = useLocation();
  const { data } = useInfiniteQuery<UserArrayType>({
    queryKey: ["GetUsers", searchQuery],
    queryFn: () => fetchUser(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage || undefined,
    initialPageParam: "",
  });
  const { isPending: updatePending, mutate: updateUser } = useMutation({
    mutationFn: async ({ values, data }: any) => {
      return axios.put(`user/${values.id}`, data);
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["GetUsers"] });
    },
    onError: (err) => {
      toast.success("خطا در اجرای عملیات");
      console.log(err);
    },
  });
  const { isPending: createPending, mutate: createUser, isSuccess: createSuccess } = useMutation({
    mutationFn: async (form) => {
      return axios.post("user", form);
    },
    onSuccess: () => {
      toast.success("کاربر اضافه شد");
      query.invalidateQueries({ queryKey: ["GetUsers"] });
    },
    onError: (err) => {
      toast.success("خطا در اجرای عملیات");
      console.log(err);
    },
  });
  const columnDefs: ColDef[] = [
    { field: "name", headerName: "نام", flex: 2 ,rowDrag: true },
    { field: "email", headerName: "ایمیل" },
    { field: "phone", headerName: "شماره تلفن" },
    {
      field: "role", headerName: "سطح کاربری", valueFormatter: (p) => {
        if (p.value === "ADMIN") {
          return 'ادمین'
        } else if (p.value === "AUTHOR") {
          return 'نویسنده'
        } else {
          return 'مجری'
        }
      }
    },
    {
      field: "createdAt", headerName: "تاریخ", valueFormatter: p => new Date(p.value).toLocaleDateString("fa")
    },
    {
      headerName: "عملیات",
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex gap-2 h-full items-center justify-center w-full">
          <EditButton
            loadingBtn={updatePending}
            actionForm={updateUser}
            values={params.data}
            fields={[
              { label: "نام", name: "name", type: "text", required: true },
              { label: "شماره تلفن", name: "phone", type: "number" },
              { label: "ایمیل", name: "email", type: "text" },
              { label: "پسورد", name: "password", type: "text" },
              {
                label: "انتخاب موقعیت", name: "role", type: "select", required: true,
                dataOptions: [
                  { name: "ادمین", value: "ADMIN" },
                  { name: "مجری", value: "CONTRACTOR" },
                  { name: "نویسنده", value: "AUTHOR" },
                ]
              },
            ]}
            title="ویرایش اطلاعات کاربران"
          />
          <DeleteButton id={params.value} keyQuery="GetUsers" urlAction="user" headerText="حذف کاربران" />
        </div>
      ),
      field: "id",
      filter: false,
      sortable: false,
    },

  ]
  useEffect(() => {
    const query = queryString.parse(search);
    setSearchQuery(query);
  }, [search]);

  return (
    <>
      {(createPending || updatePending) && <PendingApi />}
      <div className="w-full">
        <CreateButton
          isSuccess={createSuccess ? true : false}
          loadingBtn={createPending}
          actionForm={createUser}
          btnCreate={{
            name: "افزودن کاربر",
            icon: <FaUser />
          }}
          fields={[
            { label: "نام", name: "name", type: "text", required: true },
            { label: "شماره تلفن", name: "phone", type: "text", required: true },
            { label: "ایمیل", name: "email", type: "text", required: true },
            { label: "پسورد", name: "password", type: "text", required: true },
            {
              label: "انتخاب موقعیت", name: "role", type: "select", required: true,
              dataOptions: [
                { name: "ادمین", value: "ADMIN" },
                { name: "مجری", value: "CONTRACTOR" },
                { name: "نویسنده", value: "AUTHOR" },
              ]
            },
          ]}
          title="افزودن کاربر جدید"
        />
        <SearchBox searchText roleUSer order />
        {data?.pages[0]?.data.length ? (
          <>
            <div className="my-4 w-full h-[450px] [--ag-font-size:16px] [--ag-font-family:iranSans]">
              <AgGridReact
                rowDragManaged
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
        ) : null}
      </div>
    </>
  );
}
