import { Autocomplete, MenuItem, TextField } from '@mui/material';
import { FieldsType } from '../../type';

type FormComponentType = {
    data: FieldsType
    register: any,
    watch?: (value: string) => string
    setValue?: (val: string, val2: any) => void
}
export default function FieldsInputs({ register, data, watch, setValue }: FormComponentType) {
    switch (data.type) {
        case 'input':
            return (
                <TextField
                    autoComplete='off'
                    className={`shadow-md ${data?.className}`}
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
                    className={`shadow-md ${data?.className}`}
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
        case 'autoComplate':
            return (
                <Autocomplete
                    multiple
                    id="tags-outlined"
                    className={`shadow-md ${data?.className}`}
                    {...register(data.name, { required: false })}
                    options={data.dataOptions}
                    getOptionLabel={(option: any) => data.nameGetValue ? option[data.nameGetValue] : ''}
                    defaultValue={watch ? watch(data.name) || [] : []}
                    filterSelectedOptions
                    onChange={(event: any, newValue: string | null) => setValue ? setValue(data.name, newValue) : null}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={data.label}
                            placeholder="انتخاب کنید"
                        />
                    )}
                />
            )
        default:
            return null;
    }
}
