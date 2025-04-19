import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Theme, useTheme } from '@mui/material';
import { FieldsType } from '../../type';
import { useState } from 'react';

type FormComponentType = {
    data: FieldsType
    register: any,
    defualtVal?: any
}

export default function FieldsInputs({ register, data, defualtVal }: FormComponentType) {
    const getValueInputs = () => {
        if (data.type === 'autoComplate') {
            if (defualtVal) {
                return data?.nameGetValue ? defualtVal[data.nameGetValue].map((i: any) => i.id) : defualtVal[data.name].map((i: any) => i.id)
            } else {
                return []
            }
        } else {
            return defualtVal && data.name ? defualtVal[data.name] : 's'
        }
    }
    const [selector, setSelector] = useState<any>(getValueInputs())
    const theme = useTheme();
    const handleChange = (event: SelectChangeEvent<typeof selector>) => {
        const {
            target: { value },
        } = event;
        setSelector(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    function getStyles(name: string, personName: string[], theme: Theme) {
        return {
            fontWeight: personName.includes(name)
                ? theme.typography.fontWeightMedium
                : theme.typography.fontWeightRegular,
        };
    }
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
                <FormControl className={`shadow-md ${data?.className}`}>
                    <InputLabel id="demo-controlled-open-select-label">{data.label}</InputLabel>
                    <Select
                        fullWidth
                        className={`shadow-md`}
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        {...register(data.name, { required: data.required || false })}
                        value={selector}
                        label={data.label}
                        onChange={(event: SelectChangeEvent) => setSelector(event.target.value)}
                    >
                        <MenuItem value={'s'}>
                            انتخاب کنید
                        </MenuItem>
                        {data.dataOptions?.map((i, index) => (
                            <MenuItem key={index} value={i.value}>
                                {i.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )
        case 'autoComplate':
            return (
                <FormControl className={`shadow-md ${data?.className}`}>
                    <InputLabel id="demo-multiple-name-label">Name</InputLabel>
                    <Select
                        className={`shadow-md`}
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        multiple
                        value={selector}
                        {...register(data.name, { required: data.required || false })}
                        onChange={handleChange}
                        input={<OutlinedInput label="Name" />}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 48 * 4.5 + 8,
                                    width: 250,
                                },
                            },
                        }}
                    >
                        {data.dataOptions?.length ? data.dataOptions.map((name) => (
                            <MenuItem
                                key={name.id}
                                value={name.id || name.value}
                                style={getStyles(String(name.id || name.value || name.name), selector, theme)}
                            >
                                {name.name}
                            </MenuItem>
                        )) : null}
                    </Select>
                </FormControl>
            )
        default:
            return null;
    }
}
