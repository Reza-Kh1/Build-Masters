import { FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Theme, useTheme } from '@mui/material';
import Switch from '@mui/material/Switch';
import { FieldsType } from '../../type';
import { useEffect, useState } from 'react';
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import "react-multi-date-picker/styles/colors/purple.css"
import persian_fa from "react-date-object/locales/persian_fa";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_en from "react-date-object/locales/persian_en";
import moment from "moment";
import { UseFormSetValue } from 'react-hook-form';

type FormComponentType = {
    data: FieldsType
    register: any,
    defualtVal?: any
    setValue?: UseFormSetValue<any>
}

export default function FieldsInputs({ register, data, defualtVal, setValue }: FormComponentType) {
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


    // useEffect(() => {
    //     if (date) {
    //         setDayCount(moment(date).diff(moment(), "days"))
    //     }
    // }, [date])
    switch (data.type) {
        case 'text':
            return (
                <TextField
                    InputProps={data?.icon ? {
                        startAdornment: (
                            <InputAdornment position="start">
                                {data?.icon}
                            </InputAdornment>
                        ),
                    } : null}
                    autoComplete='off'
                    className={`shadow-md ${data?.className}`}
                    label={data.label}
                    fullWidth
                    {...register(data.name, { required: data.required || false })}
                />
            )
        case 'text-multiline':
            return (
                <div className={`w-full col-span-4 gap-4 grid grid-cols-4`}>
                    <TextField
                        InputProps={data?.icon ? {
                            startAdornment: (
                                <InputAdornment position="start">
                                    {data?.icon}
                                </InputAdornment>
                            ),
                        } : null}
                        multiline
                        rows={4}
                        autoComplete='off'
                        className={`shadow-md ${data?.className}`}
                        label={data.label}
                        fullWidth
                        {...register(data.name, { required: data.required || false })}
                    />
                </div>
            )
        case 'number':
            return (
                <TextField
                    {...register(data.name, { required: data.required || false })}
                    onChange={({ target }) => {
                        target.value = Number(
                            target.value.replace(/[^0-9]/g, "")
                        ).toLocaleString();
                    }}
                    InputProps={data?.icon ? {
                        startAdornment: (
                            <InputAdornment position="start">
                                {data?.icon}
                            </InputAdornment>
                        ),
                    } : null}
                    autoComplete='off'
                    className={`shadow-md ${data?.className}`}
                    label={data.label}
                    fullWidth
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
        case 'date':
            const changeHandler = (value: any) => {
                const date = new DateObject({
                    date: value,
                    format: "YYYY/MM/DD HH:mm:ss",
                    calendar: persian,
                    locale: persian_fa,
                });
                date.convert(gregorian, persian_en);
                const time = new Date(date.format())

                if (setValue) {
                    setValue(data.name, time.toISOString())
                    return
                }
            }
            return (
                <div className="flex flex-col gap-2 items-start">
                    <span>{data.label}</span>
                    <DatePicker
                        multiple={false}
                        // value={date}
                        format="YYYY/MM/DD"
                        onChange={changeHandler}
                        calendar={persian}
                        className="teal"
                        locale={persian_fa}
                        calendarPosition="bottom-right"
                    />
                </div>
            )
        case 'checkBox':
            return (
                <div className={`flex flex-col gap-1 ${data?.className}`}>
                    <span>{data.label}</span>
                    <Switch
                        {...register(data.name, { required: false })}
                        // checked={checked}
                        // onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </div>
            )
        case 'autoComplate':
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
