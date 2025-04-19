import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdClose, MdOutlineDataSaverOn } from 'react-icons/md';
import PendingApi from '../PendingApi/PendingApi';
import FieldsInputs from '../FieldsInputs/FieldsInputs';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
type FieldsType = {
    required?: boolean
    label: string
    name: string
    type: 'input' | 'select'
    dataOptions?: {
        name: string
        value: string
    }[]
}
type CreateButtonType = {
    actionForm: (value: any) => void
    fields: FieldsType[]
    btnCreate: {
        name: string
        icon: React.ReactNode
    }
    isSuccess: boolean
    loadingBtn: boolean
    title: string
}
export default function CreateButton(formData: CreateButtonType) {
    const { actionForm, fields, btnCreate, title, loadingBtn, isSuccess = true } = formData
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const {
        register,
        setValue,
        handleSubmit,
        reset,
    } = useForm();
    useEffect(() => {
        if (isSuccess) {
            reset()
            setOpenDialog(false)
        }
    }, [isSuccess])
    return (
        <>
            <Button
                variant="contained"
                className="!w-full"
                color="primary"
                onClick={() => setOpenDialog(true)}
                endIcon={btnCreate.icon}
            >
                {btnCreate.name}
            </Button>
            <Dialog
                fullScreen
                open={openDialog}
                onClose={setOpenDialog}
                TransitionComponent={Transition}
            >
                <DialogTitle className='bg-blue-100'>
                    {title}
                </DialogTitle>
                <DialogContent>
                    {loadingBtn && <PendingApi />}
                    <form className="w-full grid grid-cols-4 gap-4 mt-5">
                        {fields.map((row, index) => <FieldsInputs data={row} register={register} key={index} />)}
                    </form>
                </DialogContent>
                <DialogActions className='!justify-between'>
                    <Button
                        endIcon={<MdOutlineDataSaverOn />}
                        variant="contained"
                        className="!min-w-40"
                        color="warning"
                        loadingPosition='end'
                        loading={loadingBtn}
                        onClick={handleSubmit((data) => actionForm(data))}
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