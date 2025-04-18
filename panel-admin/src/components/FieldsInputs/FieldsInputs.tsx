import { MenuItem, TextField } from '@mui/material';
import { FieldsType } from '../../type';

type FormComponentType = {
    data: FieldsType
    register: any,
    watch?: (value: string) => string
}
export default function FieldsInputs({ register, data, watch }: FormComponentType) {
    switch (data.type) {
        case 'input':
            return (
                <TextField
                    autoComplete='off'
                    className='shadow-md'
                    label={data.label}
                    fullWidth
                    {...register(data.name, { required: data.required || false })}
                />
            )
        case 'select':
            return (
                <TextField
                    fullWidth
                    autoComplete='off'
                    select
                    className='shadow-md'
                    label={data.label}
                    id='evaluationField'
                    defaultValue={watch ? watch(data.name) || 's' : 's'}
                    {...register(data.name, { required: data.required || false })}
                >
                    <MenuItem value={'s'}>
                        انتخاب کنید
                    </MenuItem>
                    {data.dataOptions?.map((i, index) => (
                        <MenuItem key={index} value={i.value}>
                            {i.name}
                        </MenuItem>
                    ))}
                </TextField>
            )
        default:
            return null;
    }
}
