import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, useEffect, useState } from 'react'
import { MdClose, MdOutlineDataSaverOn, MdOutlinePersonAdd } from 'react-icons/md'
import PendingApi from '../../components/PendingApi/PendingApi';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CategortType, ProjectType, FieldsType, TagType } from '../../type';
import FieldsInputs from '../../components/FieldsInputs/FieldsInputs';
import { fetchCategory } from '../../services/category';
import SelectMedia from '../../components/SelectMedia/SelectMedia';
import { FaDollarSign, FaHashtag, FaLocationDot, FaPen } from 'react-icons/fa6';
import { fetchTags } from '../../services/tag';
import ImageComponent from '../../components/ImageComponent/ImageComponent';
import { fetchSingleProject } from '../../services/project';
import { IoLogoAndroid } from 'react-icons/io';
import { fetchContractorName } from '../../services/contractor';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Create({ id }: { id?: string }) {
    const query = useQueryClient();
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const { setValue, register, handleSubmit, reset, } = useForm();
    const [image, setImage] = useState<string | null>(null)
    const [gallery, setGallery] = useState<string[]>([])
    const [video, setVideo] = useState<string | null>(null)

    const { data: singleData } = useQuery<ProjectType>({
        queryKey: ["projectSingle", id],
        queryFn: () => fetchSingleProject(id),
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
        enabled: !!id && openDialog,
    });
    const { data: dataCategory } = useQuery<CategortType[]>({
        queryKey: ["GetCategory"],
        queryFn: fetchCategory,
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
        enabled: !!openDialog,
    });
    const { data: dataTag } = useQuery<TagType[]>({
        queryKey: ["TagsName"],
        queryFn: fetchTags,
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
        enabled: !!openDialog,
    });
    const { data: dataContractor } = useQuery<TagType[]>({
        queryKey: ["ContractorName"],
        queryFn: fetchContractorName,
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
        enabled: !!openDialog,
    });

    const fields: FieldsType[] = [
        { label: 'نام پروژه', name: 'name', icon: <IoLogoAndroid />, type: 'text', required: true },
        { label: 'اسلاگ پروژه', name: 'slug', icon: <FaHashtag />, type: 'text', required: true },
        { label: 'آدرس', name: 'address', icon: <FaLocationDot />, type: 'text', required: true },
        { label: 'هزینه پروژه', icon: <FaDollarSign />, name: 'price', type: 'number', required: true },
        {
            label: 'انتخاب دسته',
            name: 'categoryId',
            type: 'select',
            required: true,
            dataOptions: dataCategory?.length ? dataCategory?.map((row: CategortType) => { return { value: row.id, name: row.name } }) : []
        },
        {
            label: 'انتخاب مجری',
            name: 'contractorId',
            type: 'select',
            required: true,
            dataOptions: dataContractor?.length ? dataContractor?.map((row: any) => { return { value: row.id, name: row.name } }) : []
        },
        {
            label: 'انتخاب تگ',
            name: 'tags',
            type: 'multiple',
            nameGetValue: 'Tags',
            dataOptions: dataTag?.length ? dataTag : [],
            className: 'col-span-2'
        },
        {
            label: 'شروع پروژه',
            name: 'stratDate',
            type: 'date',
            required: true,
        },
        {
            label: 'پایان پروژه',
            name: 'endDate',
            type: 'date',
            required: true,
        },
        { label: 'توضیحات', name: 'description', className: "col-span-2", type: 'text-multiline', required: true },
        {
            label: 'انتشار پروژه',
            name: 'isPublished',
            type: 'checkBox',
            required: true,
            className: 'col-span-4'
        },
    ]

    const { isPending: createPending, mutate: createProject } = useMutation({
        mutationFn: async (form: any) => {
            const body = {
                ...form,
                image,
                gallery,
                video
            }
            body.contractorId === 's' ? body.contractorId = null : null
            return axios.post("project", body);
        },
        onSuccess: () => {
            setOpenDialog(false)
            toast.success("پروژه افزوده شد");
            query.invalidateQueries({ queryKey: ["AllProject"] });
        },
        onError: (err) => {
            toast.success("خطا در اجرای عملیات");
            console.log(err);
        },
    });
    const { isPending: updatePending, mutate: updateProject } = useMutation({
        mutationFn: async (form: any) => {
            const body = {
                ...form,
                image,
                gallery,
                video
            }
            body.contractorId === 's' ? body.contractorId = null : null
            return axios.put("project/" + singleData?.id, body);
        },
        onSuccess: () => {
            toast.success("اطلاعات پروژه ویرایش شد");
            query.invalidateQueries({ queryKey: ["AllProject"] });
            query.invalidateQueries({ queryKey: ["projectSingle", id] });
        },
        onError: (err) => {
            toast.success("خطا در اجرای عملیات");
            console.log(err);
        },
    });

    useEffect(() => {
        if (id && singleData) {
            setValue('name', singleData.name)
            setValue('slug', singleData.slug)
            setValue('address', singleData.address)
            setValue('price', singleData.price)
            setValue('stratDate', singleData.stratDate)
            setValue('tags', singleData.Tags?.map((i) => i.id) || [])
            setValue('endDate', singleData.endDate)
            setValue('description', singleData.description)
            setValue('isPublished', singleData.isPublished)
            setGallery(singleData.gallery || [])
            setImage(singleData.image)
            setVideo(singleData.video)
        }
    }, [singleData, openDialog])

    return (
        <>
            <Button
                variant="contained"
                className="!w-full"
                color="primary"
                endIcon={id ? <FaPen /> : <MdOutlinePersonAdd />}
                onClick={() => setOpenDialog(true)}
            >
                {!id ? 'افزودن پروژه' : 'ویرایش'}
            </Button>
            <Dialog
                fullScreen
                open={openDialog}
                onClose={setOpenDialog}
                TransitionComponent={Transition}
            >
                <DialogTitle className='bg-blue-100'>
                    ایجاد پروژه جدید
                </DialogTitle>
                {id && !singleData ?
                    null
                    :
                    <DialogContent>
                        {(createPending || updatePending) && <PendingApi />}
                        <form className="w-full grid grid-cols-4 items-end gap-4 mt-5">
                            {fields.map((row, index) => <FieldsInputs defualtVal={singleData} setValue={setValue} register={register} data={row} key={index} />)}
                        </form>
                        <div className='flex flex-col gap-5'>
                            <div className="flex my-5">
                                <div className="flex flex-col items-start w-1/2 gap-3">
                                    <span>تصویر پروژه</span>
                                    <SelectMedia
                                        textHelp="ابعاد تصویر 450*1450"
                                        addMedia={(_alt, image) => setImage(image.url)}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <ImageComponent
                                        deleteHandler={() => setImage(null)}
                                        img={{ url: image || '' }}
                                    />
                                </div>
                            </div>
                            <div className="flex my-5">
                                <div className="flex flex-col items-start w-1/2 gap-3">
                                    <span>گالری پروژه</span>
                                    <SelectMedia
                                        textHelp="ابعاد تصویر 288*384"
                                        addMedia={(_alt, image) => setGallery([...gallery, image.url])}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {gallery.length ? gallery.map((i: string, index) => (
                                        <ImageComponent
                                            key={index}
                                            img={{ url: i }}
                                            deleteHandler={(img) => {
                                                const newDetail = gallery.filter((i) => {
                                                    return i !== img.url;
                                                });
                                                setGallery(newDetail);
                                            }}
                                        />
                                    )) : null}
                                </div>
                            </div>
                            <div className="flex my-5">
                                <div className="flex flex-col items-start w-1/2 gap-3">
                                    <span>آپلود ویدئو</span>
                                    <SelectMedia
                                        textHelp="قبل آپلود حجم فیلم را کاهش دهید"
                                        addMedia={(_alt, image) => setVideo(image.url)}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <ImageComponent
                                        deleteHandler={() => setVideo(null)}
                                        img={{ url: video || '' }}
                                    />
                                </div>
                            </div>
                        </div>
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
                        onClick={handleSubmit((data) => id ? updateProject(data) : createProject(data))}
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
