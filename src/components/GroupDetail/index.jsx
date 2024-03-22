import {
    Box,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    Stack,
    ThemeProvider,
    createTheme
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import groupApi from "../../api/groupApi";
import { ArrowBack, Chat, Home, NoteAlt } from "@mui/icons-material";
import { Avatar, List } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { socketActions } from "../../components/socketSlice";
import { STATIC_HOST } from "../../constants";
import Welcome from "./components/Welcome"
import ChatGroup from "./components/ChatGroup"
import NoteGroup from "./components/NoteGroup"
import { io } from "socket.io-client";



GroupDetail.propTypes = {};
const theme = createTheme({
    palette: {
        white: {
            main: "#fff",
            contrastText: "#fff",
        },
        black: {
            main: "#000",
            contrastText: "#000",
        },
        lightBlue: {
            main: "#007AFF",
            contrastText: "#007AFF",
        },
        lightGray: {
            main: "#EAEDF0",
            contrastText: "#EAEDF0",
        },
    },
});

function GroupDetail(props) {
    const params = useParams();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch=useDispatch()
    const user =
        useSelector((state) => state.user.current) || JSON.parse(localStorage.getItem("user"));
    let socket = useSelector(state=>state.socket.socket) 
    let socketRef=useRef()
    if (!socket){
        socketRef.current = io(STATIC_HOST);
        dispatch(socketActions.setSocket(socketRef.current))
        socket=socketRef.current
    }
    
    
    const [group, setGroup] = useState(null);
    const [idGr,setIdGr]=useState("")
    useEffect(() => {
        (async () => {
            try {
                const { data } = await groupApi.getGroup(params.idGroup);
                if (data) {
                    setGroup(data);
                    setIdGr(data.idGroup)
                    console.log(data)
                    socket.emit('join', { room: data.idGroup });

                }
            } catch (error) {}
        })();
        return () => {
            socket.emit('leave', { room: idGr });
        };
    }, []);

    const handleNav = (nav) => {
        if (pathname.split("/")[2] === nav) return;
        navigate(`./${nav}`);
    };
    const icons = [
        <Home
            style={{
                color: "#ffffff",
                fontSize: "1.9rem",
            }}
        />,
        <Chat
            style={{
                color: "#ffffff",
                fontSize: "1.9rem",
            }}
        />,
        <NoteAlt
            style={{
                color: "#ffffff",
                fontSize: "1.9rem",
            }}
        />,
    ];
    return (
        <ThemeProvider theme={theme}>
            {group && (
                <Box
                    className='group-color-note'
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100vw",
                        height: "100vh",
                        overflow: "hidden",
                    }}
                >
                    <Stack
                        sx={{ width: "65px", backgroundColor: "#0091FF", height: "100vh" }}
                        spacing={2}
                        direction='column'
                        alignItems='center'
                    >
                        <Box
                            sx={{
                                width: "100%",
                                height: "55px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderBottom: "1px solid white",
                                
                            }}
                        >
                            <IconButton
                                aria-label='Back'
                                onClick={() => {
                                    navigate("/home/groups");
                                }}
                            >
                                <ArrowBack color='white' />
                            </IconButton>
                        </Box>

                        <Avatar
                            src={user.avt}
                            style={{ width: "50px", height: "50px", marginTop: "15px" }}
                            alt={user.name}
                        />
                        <Box className='nav-2' sx={{ marginTop: 2, width: "100%" }}>
                            <List>
                                {["Welcome","Chat", "Note"].map((text, index) => (
                                    <ListItem
                                        key={text}
                                        disablePadding
                                        onClick={() => {
                                            handleNav(text.toLowerCase());
                                        }}
                                    >
                                        <ListItemButton
                                            alignItems='center'
                                            selected={
                                                pathname.split("/")[3] === text.toLowerCase()
                                                    ? true
                                                    : false
                                            }
                                            sx={{ padding: "20px" }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: "unset",
                                                    width: "100%",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {icons[index]}
                                            </ListItemIcon>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Stack>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            width: "calc(100vw - 64px)",
                            height: "100vh",
                        }}
                    >
                        <Routes>
                            <Route path='/' element={<Navigate to='./welcome' replace />} />
                            <Route path='/welcome' element={<Welcome group={group}/>} />
                            <Route path='/chat' element={<ChatGroup group={group} />} />
                            <Route path='/note' element={<NoteGroup />} />
                        </Routes>
                    </Box>
                </Box>
            )}
        </ThemeProvider>
    );
}

export default GroupDetail;
