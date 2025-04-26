import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, useEffect, useState } from 'react'
import { MdClose, MdOutlineDataSaverOn, MdOutlinePersonAdd } from 'react-icons/md'
import PendingApi from '../../components/PendingApi/PendingApi';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { fetchSingleContractor } from '../../services/contractor';
import { CategortType, ContractorType, FieldsType, TagType } from '../../type';
import FieldsInputs from '../../components/FieldsInputs/FieldsInputs';
import { fetchCategory } from '../../services/category';
import FormSocialMedia from './FormSocialMedia';
import SelectMedia from '../../components/SelectMedia/SelectMedia';
import { FaPen, FaUser } from 'react-icons/fa6';
import { fetchTags } from '../../services/tag';
import { fetchGetUserContractor } from '../../services/user';
const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
type SocialMediaType = {
    link: string;
    type: string;
    id: number;
    text: string;
};
export default function Create({ id }: { id?: string }) {
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [socialMedia, setSocialMedia] = useState<SocialMediaType[]>([])
    const [avatar, setAvatar] = useState<string>('')
    const query = useQueryClient();
    const { setValue, register, handleSubmit, reset, } = useForm();

    const { data: singleData } = useQuery<ContractorType>({
        queryKey: ["GetSingleContractor", id],
        queryFn: () => fetchSingleContractor(id),
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
        enabled: !!id && openDialog,
    });
    const { data: dataCategory } = useQuery<CategortType[]>({
        queryKey: ["GetCategory"],
        queryFn: fetchCategory,
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
    });
    const { data: dataTag } = useQuery<TagType[]>({
        queryKey: ["TagsName"],
        queryFn: fetchTags,
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
    });
    const { data: dataUsers } = useQuery<TagType[]>({
        queryKey: ["GetUsersContractor"],
        queryFn: fetchGetUserContractor,
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
    });

    const dataUserInput = () => {
        if (dataUsers?.length && singleData?.userId) {
            const body = dataUsers?.map((row: any) => { return { value: row.id, name: row.name } })
            return [...body, { value: singleData?.userId, name: "انتخاب شده" }]
        } else {
            return dataUsers?.length ? dataUsers?.map((row: any) => { return { value: row.id, name: row.name } }) : []
        }
    }
    const fields: FieldsType[] = [
        { label: 'نام', name: 'name', type: 'text', required: true },
        { label: 'شماره تلفن', name: 'phone', type: 'number', required: true },
        { label: 'ایمیل', name: 'email', type: 'text', required: true },
        {
            label: 'انتخاب دسته',
            name: 'categoryId',
            type: 'select',
            required: true,
            dataOptions: dataCategory?.length ? dataCategory?.map((row: CategortType) => { return { value: row.id, name: row.name } }) : []
        },
        {
            label: 'انتخاب کاربر',
            name: 'userId',
            type: 'select',
            required: true,
            dataOptions: dataUserInput()
        },
        {
            label: 'انتخاب تگ',
            name: 'tagName',
            type: 'multiple',
            nameGetValue: 'Tags',
            required: true,
            dataOptions: dataTag?.length ? dataTag : [],
            className: 'col-span-2'
        },
        { label: 'بیو گرافی', name: 'bio', type: 'text-multiline', required: true },
    ]

    const { isPending: createPending, mutate: createContractor } = useMutation({
        mutationFn: async (form: any) => {
            const body = {
                ...form,
                avatar,
                socialMedia: JSON.stringify(socialMedia)
            }
            return axios.post("contractor", body);
        },
        onSuccess: () => {
            toast.success("مجری افزوده شد");
            query.invalidateQueries({ queryKey: ["AllContractor"] });
            query.invalidateQueries({ queryKey: ["ContractorName"] });
        },
        onError: (err) => {
            toast.success("خطا در اجرای عملیات");
            console.log(err);
        },
    });

    const { isPending: updatePending, mutate: updateContractor } = useMutation({
        mutationFn: async (form: any) => {
            const body = {
                ...form,
                avatar,
                socialMedia: JSON.stringify(socialMedia)
            }
            return axios.put("contractor/" + singleData?.id, body);
        },
        onSuccess: () => {
            toast.success("اطلاعات مجری ویرایش شد");
            query.invalidateQueries({ queryKey: ["AllContractor"] });
        },
        onError: (err) => {
            toast.success("خطا در اجرای عملیات");
            console.log(err);
        },
    });

    useEffect(() => {
        if (id && singleData) {
            setValue('email', singleData.email)
            setValue('name', singleData.name)
            setValue('bio', singleData.bio)
            setValue('phone', singleData.phone)
            setValue('userId', singleData.userId)
            setValue('categoryId', singleData.categoryId)
            setValue('tagName', singleData.Tags)
            setAvatar(singleData.avatar)
            setSocialMedia(JSON.parse(singleData.socialMedia || ''))
        }
    }, [singleData])

    return (
        <>
            <Button
                variant="contained"
                className="!w-full"
                color="primary"
                endIcon={id ? <FaPen /> : <MdOutlinePersonAdd />}
                onClick={() => setOpenDialog(true)}
            >
                {!id ? 'افزودن مجری' : 'ویرایش'}
            </Button>
            <Dialog
                fullScreen
                open={openDialog}
                onClose={setOpenDialog}
                TransitionComponent={Transition}
            >
                <DialogTitle className='bg-blue-100'>
                    ایجاد مجری جدید
                </DialogTitle>
                {id && !singleData ?
                    null
                    :
                    <DialogContent>
                        {(createPending || updatePending) && <PendingApi />}
                        <form className="w-full grid grid-cols-4  gap-4 mt-5">
                            {fields.map((row, index) => <FieldsInputs defualtVal={singleData} register={register} data={row} key={index} />)}
                        </form>
                        <div className="flex py-7">
                            <FormSocialMedia
                                setSocialMedia={setSocialMedia}
                                socialMedia={socialMedia}
                            />
                        </div>
                        <SelectMedia
                            addMedia={(_alt, image) => setAvatar(image.url)}
                            textHelp='عکس پروفایل خود را آپلود کنید'
                        />
                        {avatar ? (
                            <figure className="group relative inline-block mt-3">
                                <img
                                    className="rounded-full w-36 p-1 h-36 object-cover shadow-md transition duration-500 hover:opacity-75"
                                    src={avatar || "/notfound.webp"}
                                    alt=""
                                />
                                <i
                                    onClick={() => setAvatar('')}
                                    className="absolute group-hover:opacity-100 opacity-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-2xl right-1/2 bg-red-500/70 p-1 rounded-full cursor-pointer text-white shadow-md"
                                >
                                    <MdClose />
                                </i>
                            </figure>
                        ) : (
                            <i className="mt-3 inline-block" onClick={() => setAvatar('')}>
                                <FaUser className=" w-36 p-1 h-36 rounded-full bg-slate-200 shadow-md" />
                            </i>
                        )}
                    </DialogContent>
                }
                <DialogActions className='!justify-between'>
                    <Button
                        endIcon={<MdOutlineDataSaverOn />}
                        variant="contained"
                        className="!min-w-40"
                        color="warning"
                        loadingPosition='end'
                        loading={(createPending || updatePending)}
                        onClick={handleSubmit((data) => id ? updateContractor(data) : createContractor(data))}
                    >
                        ذخیره اطلاعات
                    </Button>
                    <Button
                        endIcon={<MdClose />}
                        variant="contained"
                        className="!min-w-40"
                        color="error"
                        onClick={() => { setOpenDialog(false), reset() }}
                    >
                        بستن
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
