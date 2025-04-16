import { toast } from 'react-toastify';
import React, { useState } from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';
import { GiCloudUpload } from 'react-icons/gi';
import CircularProgress, {
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" color='inherit'{...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color={"inherit"}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}
export default function UploadMedia() {
    const query = useQueryClient();
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>()
    const { mutate } = useMutation({
        mutationFn: async (event: React.ChangeEvent<HTMLInputElement>) => {
            setLoading(true);
            const newFile = event.target.files;
            if (!newFile?.length) return Promise.reject(new Error("هیچ عکسی انتخاب نشده"));
            const formData = new FormData();
            for (let file of newFile) {
                formData.append("media", file);
            }
            const { data } = await axios.post("media", formData, {
                onUploadProgress: (event) => {
                    if (event.lengthComputable && event.total) {
                        const percentComplete = Math.round((event.loaded * 100) / event.total);
                        setProgress(percentComplete);
                    }
                }
            });
            return data
        },
        onSuccess: () => {
            toast.success("عکس با موفقیت افزوده شد");
            query.invalidateQueries({ queryKey: ['mediaDB'] });
            query.invalidateQueries({ queryKey: ['mediaDBaaS'] });
            setProgress(0)
            setLoading(false);
        },
        onError: (err) => {
            toast.warning(err.message || "عکس آپلود نشد!");
            setLoading(false);
        },
    });
    return (
        <div className='w-full'>
            <label htmlFor="upload" className={`transition-all group p-3 bg-gradient-to-tr from-slate-600 hover:from-slate-700 hover:to-sky-500 to-sky-400 shadow-md border-black flex items-center justify-center rounded-md border-dashed border h-32 w-full ${!loading ? "cursor-pointer" : ""}`}>
                <input onChange={mutate} type="file" multiple hidden id='upload' disabled={loading} />
                {loading ?
                    <i className='text-white flex gap-3'>
                        <CircularProgressWithLabel value={progress || 0} />
                    </i>
                    :
                    <i className='text-3xl text-white '><GiCloudUpload /></i>
                }
            </label>
        </div>
    );
}
