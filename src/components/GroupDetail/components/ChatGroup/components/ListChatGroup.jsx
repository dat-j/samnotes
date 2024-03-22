import { MoreVertRounded } from "@mui/icons-material";
import { Avatar, Box, IconButton, Stack, Tab, Tabs, Typography } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { reName } from "../../../../../constants";
import AvatarGroupCM from "./AvatarGroupCM";

ListChatGroup.propTypes = {
    data: PropTypes.array,
};
ListChatGroup.defaultProps = {
    data: [],
};
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function ListChatGroup({ data }) {
    const [tab, setTab] = useState(0);
    
    const [filterData,setFilterData]=useState(data)
    const navigate=useNavigate()
    const handleChange = (event, newValue) => {
        setTab(newValue);
        if(newValue===1){
            const newData=data.filter((chat)=>chat.lastest.status==="unread")
            setFilterData(newData)
        }
        else{
            setFilterData(data)
        }
    };

    return (
        <Box sx={{ width: "100%"  }}>
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <Tabs
                    sx={{ padding: "0 16px", minHeight: "30px" }}
                    value={tab}
                    onChange={handleChange}
                    aria-label='basic tabs example'
                >
                    <Tab
                        sx={{
                            fontSize: "14px",
                            padding: "3px 7px",
                            minWidth: "60px",
                            fontWeight: "bold",
                            minHeight: "30px",
                            textTransform: "capitalize",
                        }}
                        label='All'
                        {...a11yProps(0)}
                    />
                    <Tab
                        sx={{
                            fontSize: "14px",
                            padding: "2px 5px",
                            minWidth: "50px",
                            minHeight: "30px",
                            fontWeight: "bold",
                            textTransform: "capitalize",
                        }}
                        label='Unread'
                        {...a11yProps(1)}
                    />
                </Tabs>
            </Box>

            <Box
                sx={{
                    padding: 0,
                    height: "calc(100vh - 30px - 64px - 55px)",
                    overflow: "hidden auto",
                    width: "100%",
                }}
            >
                {filterData.map((chat) => {
                    return (
                        <Stack
                            onClick={()=>{navigate(`./?idRoom=${chat.id}`)}}
                            flexDirection='row'
                            alignItems='center'
                            justifyContent='space-between'
                            key={chat.id}
                            sx={{
                                cursor: "pointer",
                                width: "100%",
                                height: "75px",
                                padding: "4px 16px",
                                transition: "all 0.2s",
                                "&:hover": {
                                    background: "#f3f5f6",
                                },
                                "&:hover .more": {
                                    visibility: "visible",
                                },
                            }}
                        >
                            <Stack
                                flexDirection='row'
                                alignItems='center'
                                sx={{ width: "calc(100% - 40px)" }}
                            >
                                {chat.avt.link ? (
                                    <Avatar
                                        sx={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                        src={chat.avt.link}
                                    />
                                ) : chat.avt.mems.length === 3 ? (
                                    <Avatar
                                        sx={{
                                            width: "50px",
                                            height: "50px",
                                            borderRadius: "50%",
                                            bgcolor: deepPurple[500],
                                        }}
                                    >
                                        {reName(chat.name)}
                                    </Avatar>
                                ) : (
                                    <AvatarGroupCM data={chat.avt.mems} />
                                )}
                                <Stack
                                    flexDirection='column'
                                    alignItems='flex-start'
                                    justifyContent='space-between'
                                    sx={{
                                        marginLeft: "12px",
                                        width: "calc(100% - 65px)",
                                        overflow: "hidden",
                                    }}
                                >
                                    <Typography
                                        noWrap
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                            width: "100%",
                                            marginBottom: "3px",
                                        }}
                                    >
                                        {chat.name}
                                    </Typography>
                                    <Typography
                                        noWrap
                                        sx={{
                                            fontSize: "14px",
                                            width: "100%",
                                            color: `${
                                                chat.lastest.status === "unread" ? "black" : "#7589a3"
                                            }`,
                                        }}
                                    >
                                        {chat.lastest.user_name}: {chat.lastest.content}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <IconButton onClick={(e)=>{e.stopPropagation()}} className='more' sx={{ visibility: "hidden" }}>
                                <MoreVertRounded color='black' />
                            </IconButton>
                        </Stack>
                    );
                })}
            </Box>
        </Box>
    );
}

export default ListChatGroup;
