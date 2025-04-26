import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { dataOrder, dataStatus, dataRole, dataTypeComment, } from "../../data/selectData";
import { GrSearchAdvanced } from "react-icons/gr";
import { useQuery } from "@tanstack/react-query";
import { CategortType, TagType } from "../../type";
import { fetchContractorName } from "../../services/contractor";
import FieldsInputs from "../FieldsInputs/FieldsInputs";
import { FaSearch } from "react-icons/fa";
import { fetchCategory } from "../../services/category";
import { fetchTags } from "../../services/tag";

type SearchFormType = {
  search: string
  role: string
  order: string
  isPublished: string
  category: string
  tags: string
  contractor: string
};

type SearchBoxType = {
  isPublished?: boolean;
  tag?: boolean;
  roleUSer?: boolean;
  searchText?: boolean;
  contractor?: boolean
  order?: boolean
  category?: boolean
  typeComment?: boolean
};

export default function SearchBox({ category, order, isPublished, tag, roleUSer, searchText, contractor, typeComment }: SearchBoxType) {
  const navigate = useNavigate();
  const { register, setValue, handleSubmit } = useForm<SearchFormType>()

  const { data: dataContractor } = useQuery<TagType[]>({
    queryKey: ["ContractorName"],
    queryFn: fetchContractorName,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const { data: dataCategory } = useQuery<CategortType[]>({
    queryKey: ["GetCategory"],
    queryFn: fetchCategory,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });

  const { data: dataTags } = useQuery<{ name: string }[] | []>({
    queryKey: ["TagsName"],
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    queryFn: fetchTags,
  });

  const searchHandler = (form: SearchFormType) => {
    const filteredEntries = Object.entries(form).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "" && value !== "s"
    );
    const url = "?" + new URLSearchParams(filteredEntries);
    navigate(url);
  }

  const field = [
    searchText ? { label: 'جستجو', icon: <FaSearch />, name: 'search', type: 'text' } : null,
    roleUSer ? { label: 'سطح کاربر', name: 'role', type: 'select', dataOptions: dataRole } : null,
    order ? { label: 'مرتب سازی', name: 'order', type: 'select', dataOptions: dataOrder } : null,
    isPublished ? { label: 'وضیعت انتشار', name: 'isPublished', type: 'select', dataOptions: dataStatus } : null,
    category ? { label: 'دسته بندی', name: 'category', type: 'select', dataOptions: dataCategory?.length ? dataCategory?.map((row: CategortType) => { return { value: row.id, name: row.name } }) : [] } : null,
    tag ? { label: 'انتخاب تگ', name: 'tags', type: 'multiple', dataOptions: dataTags } : null,
    contractor ? { label: 'انتخاب مجری', name: 'contractor', type: 'autoComplate', dataOptions: dataContractor } : null,
    typeComment ? { label: 'نوع کامنت', name: 'type', type: 'select', dataOptions: dataTypeComment } : null,
  ]
  return (
    <form className="w-full grid my-4 grid-cols-5 gap-3 items-center justify-center">
      {field.map((row: any, index) => {
        if (!row) return
        return <FieldsInputs key={index} data={row} register={register} setValue={setValue} />
      })}
      <div>
        <Button
          className="w-1/2 !bg-gradient-to-tr to-slate-500 from-blue-500"
          variant="contained"
          onClick={handleSubmit(searchHandler)}
          endIcon={<GrSearchAdvanced />}
        >
          جستجو
        </Button>
      </div>
    </form>
  );
}