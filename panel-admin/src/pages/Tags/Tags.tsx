import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaHashtag } from "react-icons/fa6";
import { fetchTags } from "../../services/tag";
import { toast } from "react-toastify";
import { TagType } from "../../type";
import DontData from "../../components/DontData/DontData";
import deleteCache from "../../services/revalidate";
import { AgGridReact } from "ag-grid-react";
import { myThemeTable } from "../../main";
import EditButton from "../../components/EditButton/EditButton";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import PendingApi from "../../components/PendingApi/PendingApi";
import CreateButton from "../../components/CreateButton/CreateButton";

export default function Tags() {
  const query = useQueryClient();
  const { data } = useQuery<TagType[]>({
    queryKey: ["TagsName"],
    queryFn: fetchTags,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const { mutate: createTag, isPending: pendingcreate, isSuccess: createSuccess } = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      await deleteCache({ tag: "tag" });
      return axios.post("tag", { name });
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["TagsName"] });
      toast.success("تگ جدید ایجاد شد");
    },
    onError: (err: any) => {
      toast.warning(err.response.data.message || "با خطا مواجه شدیم");
      console.log(err);
    },
  });
  const { mutate: updatetag, isPending: pendingupate } = useMutation({
    mutationFn: async ({ data, values }: any) => {
      await deleteCache({ tag: "tag" });
      return axios.put(`tag/${values?.id}`, { name: data.name });
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["TagsName"] });
      toast.success("تگ ویرایش شد");
    },
    onError: (err: any) => {
      toast.warning(err.response.data.message || "با خطا مواجه شدیم");
      console.log(err);
    },
  });

  const columnDefs: ColDef[] = [
    { field: "name", headerName: "نام", flex: 2 },
    {
      headerName: "عملیات",
      field: "id",
      width: 200,
      filter: false,
      sortable: false,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex gap-2 h-full items-center justify-center">
          <EditButton
            loadingBtn={pendingupate}
            actionForm={updatetag}
            values={params.data}
            fields={[
              { label: "نام", name: "name", type: "text", required: true },
            ]}
            title="ویرایش اطلاعات"
          />
          <DeleteButton keyCacheNext={{ tag: "tag" }} id={params.value} keyQuery="TagsName" urlAction="tag" headerText="حذف تگ" />
        </div>
      )
    },

  ]

  return (
    <div className="w-full">
      {(pendingcreate || pendingupate) && <PendingApi />}
      <CreateButton
        actionForm={createTag}
        btnCreate={{
          icon: <FaHashtag />,
          name: 'ایجاد تگ'
        }}
        fields={[
          { label: 'نام تگ', name: 'name', type: 'text', required: true }
        ]}
        isSuccess={createSuccess}
        loadingBtn={pendingcreate}
        title="تگ جدید ایجاد کنید"
      />
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
      ) : <DontData text="تگ یافت نشد!" />}
    </div>
  );
}
