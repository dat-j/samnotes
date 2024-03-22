import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    ImageList,
    ImageListItem,
    Stack,
    Typography,
    styled,
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";

import {
    EditOutlined,
    EventNoteOutlined,
    ExpandMore,
    GroupAddOutlined,
    InfoOutlined,
    PersonOutline,
    Search,
} from "@mui/icons-material";
import { deepPurple } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import groupApi from "../../../../api/groupApi";
import { reName } from "../../../../constants";
import useWindowDimensions from "../../../../customHook/WindowDimensions";
import AvatarGroupCM from "./components/AvatarGroupCM";
import ChatBox from "./components/ChatBox";
import ChatView from "./components/ChatView";

Chatgroup.propTypes = {
    group: PropTypes.object,
};
Chatgroup.defaultProps = {
    group: {},
};

const drawerWidth = 350;

const Main = styled("div")(({ theme, open, widthWin }) => ({
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: `${widthWin < 1000 ? "0px" : -drawerWidth + "px"}`,
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    }),
}));
function Chatgroup({ group }) {
    const { width } = useWindowDimensions();

    const [open, setOpen] = useState(false);
    const drawRef = useRef(null);
    let socket = useSelector((state) => state.socket.socket);
    const [messages, setMessages] = useState([]);
    const handleSend = (newMessage) => {
        socket.emit("chat_group", { data: newMessage, room: group.idGroup });
    };
    useEffect(() => {
        socket.on("chat_group", (data) => {
            setMessages([...messages, data]);
        });
    }, [messages]);
    const [listImage,setListImage]=useState([])
    const [showImage,setShowImage]=useState([])
    useEffect(() => {
        (async () => {
            try {
                const { data } = await groupApi.getMessage(group.idGroup);
                const { images ,show} = await groupApi.getImage(group.idGroup);
                setListImage(images)
                setShowImage(show)
                setMessages(data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);
    const handleMobileCloseDrawer = () => {
        if (open && width < 1000) {
            setOpen(false);
        } else {
            return;
        }
    };
    useEffect(() => {
        width > 1200 && setOpen(true);
    }, []);
    return (
        <Stack
            flexDirection='row'
            sx={{
                width: `100%`,
            }}
        >
            <Main
                onClick={handleMobileCloseDrawer}
                widthWin={width}
                open={open}
                className='chat-group'
            >
                <Stack
                    flexDirection='row'
                    className='header-chat'
                    alignItems='center'
                    justifyContent='space-between'
                    sx={{
                        width: "100%",
                        padding: "10px 15px",
                        height: "70px",
                        borderBottom: "1px solid rgba(27, 31, 35, 0.15)",
                    }}
                >
                    <Stack
                        flexDirection='row'
                        sx={{
                            width: "100%",
                        }}
                        alignItems='center'
                    >
                        {group.avt.link ? (
                            <Avatar
                                sx={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                src={group.avt.link}
                            />
                        ) : group.avt.mems.length === 3 || group.avt.mems.length === 2 ? (
                            <Avatar
                                sx={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    bgcolor: deepPurple[500],
                                }}
                            >
                                {reName(group.name)}
                            </Avatar>
                        ) : (
                            <AvatarGroupCM data={group.avt.mems} />
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
                                    fontSize: "18px",
                                    width: "100%",
                                    minWidth: "200px",
                                    marginBottom: "0px",
                                }}
                            >
                                {group.name}
                            </Typography>

                            <Typography
                                noWrap
                                sx={{
                                    fontSize: "14px",
                                    width: "fit-content",
                                    cursor: "pointer",
                                    "&:hover": {
                                        textDecoration: "underline",
                                        color: "#007AFF",
                                    },
                                    display: "flex",
                                    alignItems: "flex-end",
                                }}
                            >
                                <PersonOutline sx={{ marginRight: "4px" }} />{" "}
                                {group.avt.mems.length} members
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack flexDirection='row' className='feature'>
                        <IconButton>
                            <GroupAddOutlined color='black' />
                        </IconButton>
                        <IconButton sx={{ marginLeft: "2px" }}>
                            <Search color='black' />
                        </IconButton>
                        <IconButton
                            ref={drawRef}
                            onClick={() => {
                                setOpen(!open);
                            }}
                            sx={{ marginLeft: "2px" }}
                        >
                            {open ? (
                                <InfoOutlined color='lightBlue' />
                            ) : (
                                <InfoOutlined color='black' />
                            )}
                        </IconButton>
                    </Stack>
                </Stack>
                <ChatView data={messages} />
                <ChatBox nameGroup={group.name} handleSend={handleSend} />
            </Main>
            <Drawer
                sx={{
                    width: `${width > 1000 ? "350px" : "0px"}`,
                    visibility: `${!open ? "hidden" : "visiable"}`,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: `${width > 600 ? drawerWidth + "px" : "100vw"}`,
                        height: `${width > 600 ? "100vh" : "400px"}`,
                        borderTopLeftRadius: `${width < 600 && "20px"}`,
                        borderTopRightRadius: `${width < 600 && "20px"}`,
                    },
                }}
                variant={width > 1000 ? "persistent" : "temporary"}
                anchor={width > 600 ? "right" : "bottom"}
                hideBackdrop={width < 600 ? false : true}
                open={open}
                onClose={handleMobileCloseDrawer}
            >
                <Stack
                    alignItems='center'
                    sx={{
                        height: "70px",
                        borderBottom: " 1px solid rgba(27, 31, 35, 0.15)",
                        fontWeight: 500,
                        fontSize: "18px",
                    }}
                    justifyContent='center'
                >
                    Thông tin nhóm
                </Stack>
                <Box sx={{ padding: "16px 0" }}>
                    <Stack flexDirection='column' alignItems='center' sx={{ marginBottom: "15px" }}>
                        {group.avt.link ? (
                            <Avatar
                                sx={{ width: "60px", height: "60px", borderRadius: "50%" }}
                                src={group.avt.link}
                            />
                        ) : group.avt.mems.length === 3 || group.avt.mems.length === 2 ? (
                            <Avatar
                                sx={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "50%",
                                    bgcolor: deepPurple[500],
                                }}
                            >
                                {reName(group.name)}
                            </Avatar>
                        ) : (
                            <AvatarGroupCM w={60} data={group.avt.mems} />
                        )}
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                fontSize: "20px",
                                marginTop: "10px",
                            }}
                        >
                            {group.name}
                            <Button
                                variant='contained'
                                color='lightGray'
                                sx={{
                                    marginLeft: "10px",
                                    borderRadius: "50%",
                                    width: "30px",
                                    height: "30px",
                                    minWidth: "unset",
                                }}
                            >
                                <EditOutlined fontSize='small' color='black' />
                            </Button>
                        </Typography>
                    </Stack>
                    <Divider sx={{margin:"0 -16px"}} />
                    <Accordion
                        sx={{
                            boxShadow: "unset",
                            "&:before": {
                                backgroundColor: "unset",
                            },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls='panel1a-content'
                            id='panel1a-header'
                            sx={{
                             
                                "&.Mui-expanded": {
                                    minHeight: "50px",
                                    height: "50px",
                                    
                                },
                            }}
                        >
                            <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                                Members in group
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: "0px" }}>
                            <Typography
                                sx={{
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    padding: "16px",
                                    display: "flex",
                                    "&:hover": {
                                        backgroundColor: "#EAEDF0",
                                    },
                                 
                                    alignItems: "flex-end",
                                    marginBottom: "0px",
                                }}
                            >
                                <PersonOutline sx={{ marginRight: "10px" }} />
                                {group.avt.mems.length} members
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Divider sx={{margin:"0 -16px"}} />

                    <Accordion
                        defaultExpanded={true}
                        sx={{
                            boxShadow: "unset",
                            "&:before": {
                                backgroundColor: "unset",
                            },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls='panel1a-content'
                            id='panel1a-header'
                            sx={{
                             
                                "&.Mui-expanded": {
                                    minHeight: "50px",
                                    height: "50px",
                                
                                },
                            }}
                        >
                            <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>News</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: "0px" }}>
                            <Typography
                                sx={{
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    padding: "16px",
                                    display: "flex",
                                    "&:hover": {
                                        backgroundColor: "#EAEDF0",
                                    },
                                   
                                    alignItems: "flex-end",
                                    marginBottom: "5px",
                                }}
                            >
                                <EventNoteOutlined sx={{ marginRight: "10px" }} />
                                Notes, pin
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Divider sx={{margin:"0 -16px"}} />

                    <Accordion
                        defaultExpanded={true}
                        sx={{
                            boxShadow: "unset",
                            "&:before": {
                                backgroundColor: "unset",
                            },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls='panel1a-content'
                            id='panel1a-header'
                            sx={{
                             
                                "&.Mui-expanded": {
                                    minHeight: "50px",
                                    height: "50px",
                                  
                                },
                            }}
                        >
                            <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
                                Photos
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: "16px" }}>
                            <ImageList gaps={4} rowHeight={72} cols={4}>
                                {showImage.map((item) => (
                                    <ImageListItem
                                        sx={{
                                            "& div": { height: "100%" },
                                            "& .ant-image-mask-info": {
                                                display: "none !important",
                                            },
                                        }}
                                        key={item.id}
                                    >
                                        <img
                                            src={item.url}
                                            style={{
                                                height: "100%",
                                                border: "1px solid rgba(27, 31, 35, 0.15)",
                                                width:"72px",
                                                borderRadius:"5px",
                                                objectFit: "cover",
                                            }}
                                           
                                            alt='img-send'
                                            loading='lazy'
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Drawer>
        </Stack>
    );
}

export default Chatgroup;
