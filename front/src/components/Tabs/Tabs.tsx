"use client"
import React from 'react';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ImgTag from '../ImgTag/ImgTag';
import { TabDataType } from '@/app/type';
type TabsComponentType = {
    image: { alt: string, url: string } | null,
    tabs: TabDataType[]
}
interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            className='text-justify px-1 mt-5 md:mt-8'
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Typography className='!text-sm md:!text-base'>{children}</Typography>
            )}
        </div>
    );
}

export default function TabsComponent({ image, tabs }: TabsComponentType) {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    if (!image) return
    return (
        <section className='w-full flex flex-col md:flex-row gap-5 my-3 md:my-6'>
            <div className='w-full md:w-2/3 '>
                <Box sx={{ width: '100%' }}>
                    <Tabs
                        scrollButtons={true}
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="inherit"
                        variant="scrollable"
                    >
                        {tabs?.map((i, index) => (
                            <Tab key={index} label={i?.title} className='!text-xs !p-2 md:!text-base md:!p-3' />
                        ))}
                    </Tabs>
                    {tabs?.map((i, index) => (
                        <TabPanel key={index} value={value} index={index} dir={theme.direction}>
                            {i?.text}
                        </TabPanel>
                    ))}
                </Box>
            </div>
            <div className='w-full md:w-1/3'>
                {image ?
                    <ImgTag src={image?.url} alt={image?.alt} width={300} height={250} />
                    : null
                }
            </div>
        </section>
    );
}