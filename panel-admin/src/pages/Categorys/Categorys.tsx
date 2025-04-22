import axios from "axios";
import { CategortType } from "../../type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCategory } from "../../services/category";
import { toast } from "react-toastify";
import PendingApi from "../../components/PendingApi/PendingApi";
import DontData from "../../components/DontData/DontData";
import deleteCache from "../../services/revalidate";
import { AgGridReact } from "ag-grid-react";
import { myThemeTable } from "../../main";
import EditButton from "../../components/EditButton/EditButton";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import { MdOutlineCategory } from "react-icons/md";
import CreateButton from "../../components/CreateButton/CreateButton";

export default function Categorys() {
  const query = useQueryClient();
  const { data } = useQuery<CategortType[]>({
    queryKey: ["GetCategory"],
    queryFn: fetchCategory,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const { isPending: createPending, mutate: createCategory, isSuccess: successCreate } = useMutation({
    mutationFn: async (form) => {
      await deleteCache({ tag: "category" });
      return axios.post("category", form);
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["GetCategory"] });
      toast.success("دسته با موفقیت اضافه شد");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "خطا در اضافه کردن دسته");
    },
  });
  const { isPending: updatePending, mutate: updateCategory } = useMutation({
    mutationFn: async ({ data, values }: any) => {
      if (data.subCategoryId === 's') {
        data.subCategoryId = null
      }
      await deleteCache({ tag: "category" });
      return axios.put(`category/${values?.id}`, data)
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["GetCategory"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const dataOptions = () => {
    if (!data || !data?.length) return []
    return data.map((row) => {
      return {
        value: row.id,
        name: row.name
      }
    })
  }

  const columnDefs: ColDef[] = [
    { field: "name", headerName: "نام", flex: 2 },
    { field: "slug", headerName: "اسلاگ" },
    {
      field: "SubCategoryTo", headerName: "زیر مجموعه", valueFormatter: (params) => {
        if (params?.value === null) {
          return "-------"
        } else {
          return params?.value?.name
        }
      }
    },
    {
      headerName: "عملیات",
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex gap-2 h-full items-center justify-center">
          <EditButton
            loadingBtn={updatePending}
            actionForm={updateCategory}
            values={params.data}
            fields={[
              { label: "نام دسته", name: "name", type: "text", required: true },
              { label: "اسلاگ", name: "slug", type: "text" },
              {
                label: "زیر مجموعه", name: "subCategoryId", type: "select", required: true,
                dataOptions: dataOptions()
              },
            ]}
            title="ویرایش اطلاعات کاربران"
          />
          <DeleteButton id={params.value} keyQuery="GetCategory" keyCacheNext={{ tag: 'category' }} urlAction="category" headerText="حذف دسته" />
        </div>
      ),
      field: "id",
      width: 200,
      filter: false,
      sortable: false,
    },

  ]

  return (
    <>
      {(createPending || updatePending) && <PendingApi />}
      <div>
        <CreateButton
          actionForm={createCategory}
          btnCreate={{
            icon: <MdOutlineCategory />,
            name: "افزودن دسته"
          }}
          fields={[
            { label: 'نام دسته', name: 'name', type: 'text', required: true },
            { label: 'اسلاگ', name: 'slug', type: 'text', required: true },
            { label: "زیر مجموعه", name: "subCategoryId", type: "select", required: true, dataOptions: dataOptions() },
          ]}
          isSuccess={successCreate}
          loadingBtn={createPending}
          title="ایجاد دسته"
        />
        <div className="mt-5">
          {data?.length ? (
            <div className="my-4 w-full h-[450px] [--ag-font-size:16px] [--ag-font-family:iranSans]">
              <AgGridReact
                enableRtl
                rowData={data}
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
          ) : (
            <DontData text="دسته ای یافت نشد!" />
          )}
        </div>
      </div>
    </>
  );
}
