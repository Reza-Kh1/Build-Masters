import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, useState } from 'react'
import { MdClose, MdOutlineDataSaverOn, MdOutlinePersonAdd } from 'react-icons/md'
import PendingApi from '../../components/PendingApi/PendingApi';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { fetchSingleContractor } from '../../services/contractor';
import { CategortType, FieldsType } from '../../type';
import FieldsInputs from '../../components/FieldsInputs/FieldsInputs';
import { fetchCategory } from '../../services/category';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Create({ id }: { id?: string }) {
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const query = useQueryClient();
    const { data } = useQuery({
        queryKey: ["GetSingleContractor", id],
        queryFn: () => fetchSingleContractor(id),
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
        enabled: !!id,
    });
    const { data: dataCategory } = useQuery<CategortType[]>({
        queryKey: ["GetCategory"],
        queryFn: fetchCategory,
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 24,
    });
    const {
        register,
        handleSubmit,
        reset,
    } = useForm();

console.log(dataCategory);

    // "socialMedia": "",
    //     "avatar": "",
    //             "tagName": [],
    //                 "userId": "3ae96e23-0bcc-4de6-802b-322f1efb5226"
    const fields: FieldsType[] = [
        { label: 'نام', name: 'name', type: 'input', required: true },
        { label: 'شماره تلفن', name: 'phone', type: 'input', required: true },
        { label: 'ایمیل', name: 'email', type: 'input', required: true },
        { label: 'بیو گرافی', name: 'bio', type: 'input', required: true },
        {
            label: 'انتخاب دسته',
            name: 'role',
            type: 'select',
            required: true,
            dataOptions: dataCategory?.length ? dataCategory?.map((row: CategortType) => { return { value: row.id, name: row.name } }) : []
        },
    ]

    const { isPending: createPending, mutate: createContractor } = useMutation({
        mutationFn: async (form: any) => {
            return axios.post("contractor", form);
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

    const { isPending: updatePending, mutate: updateContractor } = useMutation({
        mutationFn: async (form: any) => {
            return axios.put("contractor", form);
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

    return (
        <>
            <Button
                variant="contained"
                className="!w-full"
                color="primary"
                endIcon={<MdOutlinePersonAdd />}
                startIcon={<MdOutlinePersonAdd />}
                onClick={() => setOpenDialog(true)}
            >
                افزودن مجری
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
                <DialogContent>
                    {(createPending || updatePending) && <PendingApi />}
                    <form className="w-full grid grid-cols-4 gap-4 mt-5">
                        {fields.map((row, index) => <FieldsInputs register={register} data={row} key={index} />)}
                    </form>
                </DialogContent>
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
