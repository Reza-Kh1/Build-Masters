import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query';
import FormPost from '../../components/FormPost/FormPost';
import { fetchSinglePost } from '../../services/post';
import { SinglePostType } from '../../type';
import { FaPen } from 'react-icons/fa6';
import { LuCopyPlus } from 'react-icons/lu';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Create({ name, setName }: { name?: string, setName: (val: string) => void }) {
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const { data: singleData } = useQuery<SinglePostType>({
        queryKey: ["siglePost", name],
        queryFn: () => fetchSinglePost(name),
        staleTime: 1000 * 60 * 60 * 24,
        enabled: !!name && openDialog,
    });
    useEffect(() => {
        if (name) {
            setOpenDialog(true)
        }
    }, [name])
    return (
        <>
            <Button
                variant="contained"
                className="!w-full"
                color="primary"
                endIcon={name ? <FaPen /> : <LuCopyPlus />}
                onClick={() => setOpenDialog(true)}
            >
                {!name ? 'ایجاد پست جدید' : 'ویرایش'}
            </Button>
            <Dialog
                fullScreen
                open={openDialog}
                onClose={setOpenDialog}
                TransitionComponent={Transition}
            >
                <DialogTitle className='bg-blue-100'>
                    ایجاد پست جدید
                </DialogTitle>
                {name && !singleData ?
                    null
                    :
                    <DialogContent>
                        <FormPost dataPost={singleData} />
                    </DialogContent>
                }
                <DialogActions className='!justify-between'>
                    <Button
                        endIcon={<MdClose />}
                        variant="contained"
                        className="!min-w-40"
                        color="error"
                        onClick={() => { setOpenDialog(false), setName('') }}
                    >
                        بستن
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
