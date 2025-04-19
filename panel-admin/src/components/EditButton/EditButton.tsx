import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React, { forwardRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaPen } from 'react-icons/fa6';
import { MdClose, MdOutlineDataSaverOn } from 'react-icons/md';
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
    }[] | []
}
type EditButtonType = {
    actionForm: (value: any) => void
    fields: FieldsType[]
    loadingBtn: boolean
    values: any
    title: string
}
export default function EditButton(formData: EditButtonType) {
    const { actionForm, fields, title, loadingBtn, values } = formData
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const {
        register,
        setValue,
        handleSubmit,
        reset,
        watch
    } = useForm();
    const syncData = () => {
        fields.map((row) => {
            setValue(row.name, values[row.name])
        })
        setOpenDialog(true)
    }
    return (
        <>
            <Button
                loading={loadingBtn}
                variant="contained"
                color="primary"
                onClick={() => syncData()}
                endIcon={<FaPen size={16} />}
            >
                ویرایش
            </Button>
            <Dialog
                fullScreen
                open={openDialog}
                TransitionComponent={Transition}
            >
                <DialogTitle className='bg-blue-100'>
                    {title}
                </DialogTitle>
                <DialogContent>
                    <form className="w-full grid grid-cols-4 gap-4 mt-5">
                        {fields.map((row, index) => <FieldsInputs watch={watch} data={row} register={register} key={index} />)}
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
                        onClick={handleSubmit((data) => {
                            reset()
                            setOpenDialog(false)
                            actionForm({ data, values })
                        })}
                    >
                        دخیره کردن اطلاعات
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
