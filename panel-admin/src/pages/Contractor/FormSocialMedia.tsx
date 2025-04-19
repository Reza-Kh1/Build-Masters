import { Button, IconButton } from '@mui/material';
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { BiLogoInternetExplorer } from 'react-icons/bi';
import { FaCheck, FaInstagram, FaLinkedin, FaMinus, FaPen, FaPhone, FaPlus, FaTelegram, FaWhatsapp } from 'react-icons/fa6';
import { IoLogoTwitter } from 'react-icons/io5';
import FieldsInputs from '../../components/FieldsInputs/FieldsInputs';
import { MdClose } from 'react-icons/md';
const dataSocialMedia = [
    {
        value: "whatsapp",
        name: <FaWhatsapp className="text-xl text-green-700" />,
    },
    {
        value: "telegram",
        name: <FaTelegram className="text-xl text-sky-600" />,
    },
    {
        value: "instagram",
        name: <FaInstagram className="text-xl text-red-500" />,
    },
    {
        value: "phone",
        name: <FaPhone className="text-xl text-green-400" />,
    },
    {
        value: "web",
        name: <BiLogoInternetExplorer className="text-xl text-indigo-500" />,
    },
    {
        value: "twitter",
        name: <IoLogoTwitter className="text-xl text-sky-400" />,
    },
    {
        value: "linkedin ",
        name: <FaLinkedin className="text-xl text-blue-700" />,
    },
];
type SocialMediaType = {
    link: string;
    type: string;
    id: number;
    text: string;
};
type FormSocialMediaType = {
    socialMedia: SocialMediaType[]
    setSocialMedia: (val: SocialMediaType[]) => void
}

export default function FormSocialMedia({ socialMedia, setSocialMedia }: FormSocialMediaType) {
    const [editId, setEditId] = useState<number | null>(null)
    const { getValues, register, handleSubmit, reset, setValue, watch } = useForm()
    const editSocialHandler = () => {
        const newBody = socialMedia.map((item) => {
            if (item.id === editId) {
                item.link = getValues('link-update')
                item.text = getValues('text-update')
                item.type = getValues('type-update')
            }
            return item
        })
        setSocialMedia(newBody)
        setEditId(null)
    };
    const deleteSocialMedia = (id: number) => {
        const newBody = socialMedia.filter((item) => item.id !== id)
        setSocialMedia(newBody)
    }
    const inserSocialMedia = () => {
        const body = {
            type: getValues('type-insert'),
            link: getValues('link-insert'),
            text: getValues('text-insert'),
            id: Math.floor(Math.random() * 1000),
        }
        reset()
        setSocialMedia([...socialMedia, body])
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <h2>افزودن شبکه های اجتماعی</h2>
            <form className="flex items-center gap-4 w-full">
                <FieldsInputs
                    register={register}
                    data={{
                        label: 'اپلیکیشن',
                        name: 'type-insert',
                        type: 'select',
                        dataOptions: dataSocialMedia,
                        required: true,
                        className: '!w-1/5'
                    }}
                />
                <FieldsInputs
                    register={register}
                    data={{
                        label: 'متن',
                        name: 'text-insert',
                        type: 'input',
                        required: true,
                        className: '!w-2/5'
                    }}
                />
                <FieldsInputs
                    register={register}
                    data={{
                        label: 'لینک',
                        name: 'link-insert',
                        type: 'input',
                        required: true,
                        className: '!w-2/5'
                    }}
                />
                <Button
                    onClick={handleSubmit(inserSocialMedia)}
                    className='!min-w-32'
                    variant='contained'
                    endIcon={<FaPlus />}
                >
                    افزودن
                </Button>
            </form>
            <div className='flex flex-col gap-5'>
                {socialMedia.map((rows, index) => (
                    rows.id === editId ?
                        <form className="flex items-center gap-4 w-full">
                            <FieldsInputs
                                register={register}
                                data={{
                                    label: 'اپلیکیشن',
                                    name: 'type-update',
                                    type: 'select',
                                    dataOptions: dataSocialMedia,
                                    required: true,
                                    className: '!w-1/5'
                                }}
                                watch={watch}
                            />
                            <FieldsInputs
                                register={register}
                                data={{
                                    label: 'متن',
                                    name: 'text-update',
                                    type: 'input',
                                    required: true,
                                    className: '!w-2/5'
                                }}
                            />
                            <FieldsInputs
                                register={register}
                                data={{
                                    label: 'لینک',
                                    name: 'link-update',
                                    type: 'input',
                                    required: true,
                                    className: '!w-2/5'
                                }}
                            />
                            <div className='flex items-center gap-2 min-w-32 justify-evenly'>
                                <IconButton color='success' onClick={() => editSocialHandler()}>
                                    <FaCheck />
                                </IconButton>
                                <IconButton color='error' onClick={() => setEditId(null)}>
                                    <MdClose />
                                </IconButton>
                            </div>
                        </form> :
                        <div className='w-full flex gap-4 items-center ' key={index}>
                            <span className='bg-gray-100 p-3 shadow-md rounded-md w-1/5'>{dataSocialMedia.find((item) => item.value === rows.type)?.name}</span>
                            <span className='bg-gray-100 p-3 shadow-md rounded-md w-2/5'>{rows.text}</span>
                            <span className='bg-gray-100 p-3 shadow-md rounded-md w-2/5'>{rows.link}</span>
                            <div className='flex items-center gap-2 min-w-32 justify-evenly'>
                                <IconButton color='info' onClick={() => {
                                    setEditId(rows.id)
                                    setValue('link-update', rows.link)
                                    setValue('type-update', rows.type)
                                    setValue('text-update', rows.text)
                                }}>
                                    <FaPen />
                                </IconButton>
                                <IconButton color='error' onClick={() => deleteSocialMedia(rows.id)}>
                                    <FaMinus />
                                </IconButton>
                            </div>
                        </div>
                ))}
            </div>
        </div>
    )
}
