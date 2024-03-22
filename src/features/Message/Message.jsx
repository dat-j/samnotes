import { AppBar, Box, Stack, TextField, Typography, Toolbar } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button } from "antd";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import userApi from "../../api/userApi";
import { useEffect, useRef } from "react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import SearchIcon from "@mui/icons-material/Search";
import { AiOutlineSearch } from "react-icons/ai";
import { AiOutlineMore, AiFillMessage } from "react-icons/ai";
import { useOnClickOutside } from "src/customHook/useOnClickOutside";
import io from "socket.io-client";
import { useEffectOnce } from "src/customHook/useEffectOnce";
import { useMediaQuery } from "src/customHook/useMediaQuery";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "src/shadcn/ui/dropdown-menu"

const options = [
    'All',
    'Recent',
    'Blocked'
]

// const socket = io("https://samnote.mangasocial.online").connect();

function getCurrentDate() {
    var currentTime = new Date();

    // Chuyển định dạng thành "YYYY-MM-DD HH:mm:ss"
    var formattedTime = currentTime.getFullYear() + '-' +
        ('0' + (currentTime.getMonth() + 1)).slice(-2) + '-' +
        ('0' + currentTime.getDate()).slice(-2) + ' ' +
        ('0' + currentTime.getHours()).slice(-2) + ':' +
        ('0' + currentTime.getMinutes()).slice(-2) + ':' +
        ('0' + currentTime.getSeconds()).slice(-2);
    return formattedTime;
}
function ReduceString({ string, maxLength }) {
    if (!string) {
        return '';
    }
    if (string.length > maxLength) {
        return string.substring(0, maxLength) + '...';
    } else {
        return string;
    }
}

export default function MessagePage() {
    const users = useSelector((state) => state.user.current) || JSON.parse(localStorage.getItem("user"));
    //@kitsuneremi
    const messageBoxRef = useRef(null);
    const messageInputRef = useRef(null);
    const interactIconRef = useRef(null);
    const interactIconButtonRef = useRef(null);
    const messageRenderRef = useRef(null);
    const targetuserMessageMenuRef = useRef(null);
    const targetuserMessageButtonRef = useRef(null);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [targetMessageUserData, setTargetMessageUserData] = useState(null);
    const [messageListData, setMessageListData] = useState([]);
    const [openInteractDropDown, setOpenInteractDropDown] = useState({ button: false, menu: false });
    const [openSidebar, setOpenSidebar] = useState({ navi: false, list: true })
    const [listUserSearchValue, setListUserSearchValue] = useState("")

    const [CountMessage, setCountMessage] = useState(0);
    const [getMessage, setGetMessageuser] = useState([]);
    const [messageContent, setMessageContent] = useState("");
    const [listUserOnline, setlistUserOnline] = useState([]);
    const [UserOnlineId, setUserOnlineId] = useState(10);
    const [UserIdSend, setUserIdSend] = useState([]);
    const [statusMess, setstatusMess] = useState();
    const [inputUser, setInputUser] = useState("");
    const [toggleSearch, setToggleSearch] = useState(false);
    const [toggleOption, setToggleOption] = useState(false);
    const [toggleBlock, setToggleBlock] = useState(true);
    const [toggleRemoveBlock, setToggleRemoveBlock] = useState(true);
    const [toggleSearchContext, setToggleSearchContext] = useState(false);
    const [file, setFile] = useState(null);
    const [listInputUser, setListInputUser] = useState([]);
    const [listSearchUser, setListSearchUser] = useState([]);
    const [toggleIcon, setToggleIcon] = useState(false);
    const [readyListUser, setReadyUser] = useState(false);
    const [showMessageSearches, setShowMessageSearches] = useState(false);
    const [targetUserMessageMenuOpen, setTargetUserMessageMenuOpen] = useState({ menu: false, button: false });

    useOnClickOutside(interactIconRef, () => { setOpenInteractDropDown(prev => { return { menu: false, button: prev.button } }) })
    useOnClickOutside(interactIconButtonRef, () => { setOpenInteractDropDown(prev => { return { menu: prev.menu, button: false } }) })
    useOnClickOutside(targetuserMessageButtonRef, () => { setTargetUserMessageMenuOpen(prev => { return { menu: prev.menu, button: false } }) })
    useOnClickOutside(targetuserMessageMenuRef, () => { setTargetUserMessageMenuOpen(prev => { return { menu: false, button: prev.button } }) })

    const { enqueueSnackbar } = useSnackbar();

    const device = {
        sm: useMediaQuery("(min-width: 640px)"),
        md: useMediaQuery("(min-width: 768px)"),
        lg: useMediaQuery("(min-width: 1024px)")
    }


    // useEffectOnce(() => {
    //     const handleReceivedMessage = (data) => {
    //         // setList((prev) => [...prev, data]);
    //         console.log(data)
    //     };

    //     socket.on("receive_message", handleReceivedMessage);

    //     return () => {
    //         socket.off("receive_message", handleReceivedMessage);
    //     };
    // });

    useEffect(() => {
        setCountMessage(getMessage.length);
        document.title = `Bạn đang có ${getMessage.length} tin nhắn`;
    }, [CountMessage]);

    useEffect(() => {
        const check = listUserOnline.filter(user => user.name.includes(inputUser));
        setListInputUser(check);
        if (check.length >= 1) {
            setToggleSearch(prev => { return !prev });
        }
    }, [inputUser]);

    useEffect(() => {
        if (readyListUser) {
            setTargetMessageUserData(listUserOnline[0])
            setReadyUser(false);
        }
    }, [listUserOnline])

    // get online users
    useEffect(() => {
        userApi.userOnline().then((res) => {
            const status = res.users.filter((user) => user.statesLogin === 1);
            const listUsersOnlineExcept = status.filter((user) => user.id !== users.id);
            setlistUserOnline(listUsersOnlineExcept);
            setReadyUser(true);
        });
    }, []);

    useEffect(() => {
        if (targetMessageUserData) {
            setMessageListData([]);
            axios.get(`https://samnote.mangasocial.online/message/chat-unknown/${users.id}`)
                .then(res1 => {
                    const data1 = res1.data.data.filter(message => Number.parseInt(message.idReceive) === targetMessageUserData.id);
                    axios.get(`https://samnote.mangasocial.online/message/chat-unknown/${targetMessageUserData.id}`)
                        .then(res2 => {
                            const data2 = res2.data.data.filter(message => Number.parseInt(message.idSend) === users.id);
                            // Gộp hai mảng
                            const mergedData = [...data1, ...data2];
                            // Sắp xếp mảng theo trường sendAt
                            const sortedData = mergedData.sort((a, b) => new Date(a.sendAt) - new Date(b.sendAt));
                            // Lưu vào state
                            setMessageListData(sortedData);
                        })
                        .catch(err => {
                            console.log(err);
                            setMessageListData([]);
                        });
                })
                .catch(err => {
                    console.log(err);
                    setMessageListData([]);
                });

        }
    }, [targetMessageUserData])

    // search
    // useEffect(() => {
    //     const Content = getMessage.filter((mess) => mess.content.includes(searchContent));
    //     const received = UserIdSend.filter((mes) => mes.content.includes(searchContent));
    //     setListSearchUser(Content.concat(received));
    // }, [searchContent]);

    // use drop zone
    const onDrop = useCallback((acceptedFiles) => {
        setFile(acceptedFiles[0]);
    });
    const { getRootProps, getInputProps, open: setOpenUploadFile, isDragActive } = useDropzone({ onDrop, noClick: true });


    const handleSendMessage = () => {
        // emit socket
        const data = {
            room: `${users.id}${targetMessageUserData.id}`,
            data: {
                idSend: users.id,
                idReceive: targetMessageUserData.id,
                type: 'text',
                state: '',
                content: messageContent
            }
        };
        // socket.emit("send_message", data);

        // save data to db
        axios({
            method: "POST",
            url: `https://samnote.mangasocial.online/message/chat-unknown/${targetMessageUserData.id}`,
            data: {
                content: messageContent,
                id: "",
                idReceive: targetMessageUserData.id,
                idSend: users.id,
                sendAt: new Date().toISOString(),
            },
            headers: {
                "Content-Type": "application/json",
            },
        }).then(res => { setstatusMess(res.data.message) })
        const displayMessageData = { idSend: data.data.idSend, idReceive: data.data.idReceive, sendAt: getCurrentDate(), content: data.data.content }
        setMessageListData(prev => { return [...prev, displayMessageData] })
        setMessageContent("");
    }

    const FlexMenu = ({ listData }) => {
        return (
            <>
                <div className="flex max-sm:overflow-x-scroll w-full justify-center">
                    {options.map((option, index) => {
                        return (
                            <button onClick={() => { if (index != selectedIndex) { setSelectedIndex(index) } }} key={index} className={`px-3 py-2  ${selectedIndex == index ? 'relative text-blue-600 after:absolute after:w-full after:h-[2px] after:bg-blue-600 after:left-0 after:bottom-0 after:rounded-lg' : ''} w-full min-w-fit max-w-[33%]`}>
                                {option}
                            </button>
                        )
                    })}
                </div>
                <div className="h-[calc(100%-140px)] w-full px-3 mt-3">
                    {ContentRender(selectedIndex, listData)}
                </div>
            </>

        )
    }

    const ContentRender = (index, listData) => {
        if (index == 0) {
            return (
                <div className="flex h-full flex-col gap-2 overflow-y-auto tiny-scrollbar">
                    {listData.map((data, index) => {
                        return (
                            <div className="flex justify-between" key={index}>
                                <div className="flex gap-4 items-center max-lg:flex-col max-lg:gap-2 max-lg:justify-start flex-1">
                                    <div className="w-14 max-lg:w-12 aspect-square relative">
                                        <img className="w-full h-full rounded-full" src={data.img} alt="a picture" />
                                        <div className="absolute w-4 h-4 bg-green-500 rounded-full bottom-1 right-1 border-[1px] border-white" />
                                    </div>
                                    <p className="text-xl max-lg:text-base">{ReduceString({ string: data.name, maxLength: 9 })}</p>
                                </div>
                                <div className="flex items-center">
                                    <div className="text-2xl max-lg:text-lg" onClick={() => { setTargetMessageUserData(data) }}><AiFillMessage /></div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <div className="text-2xl max-lg:text-lg" onClick={() => { }}><AiOutlineMore /></div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Profile</DropdownMenuItem>
                                            <DropdownMenuItem>Billing</DropdownMenuItem>
                                            <DropdownMenuItem>Team</DropdownMenuItem>
                                            <DropdownMenuItem>Subscription</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        } else if (index == 1) {

        }
    }

    return (
        <div className="w-screen h-screen flex overflow-x-hidden">
            {/* sidebar 1 list message user*/}
            {
                openSidebar.list
                &&
                <div className="flex flex-col items-center py-2 w-[250px] max-sm:w-full h-full border-r-[1px] border-black shadow-lg shadow-slate-700 z-10">
                    <button onClick={() => { setOpenSidebar(prev => { return { list: prev.list, navi: true } }) }}>Open navigation menu</button>
                    <div className="w-5/6 flex items-center h-8 py-1 px-1 rounded-2xl border-[1px] border-[#ccccc] bg-slate-100 dark:bg-slate-800">
                        <input
                            className="bg-transparent w-[calc(100%-26px)] focus:outline-none ml-3 my-1 text-base leading-6"
                            value={listUserSearchValue}
                            onChange={(e) => {
                                setListUserSearchValue(e.target.value);
                            }}
                            onFocus={() => {
                                setToggleSearch(true);
                            }}
                            onBlur={() => { setToggleSearch(false) }}
                        />
                        <div className="w-[2px] h-full relative after:absolute after:bg-slate-300 dark:after:bg-slate-500 after:h-[90%] after:top-[5%] after:left-0 after:w-full" />
                        <div className="h-full w-4 ml-2 flex flex-col justify-center cursor-pointer hover:bg-slate-400 dark:hover:bg-slate-700 text-[#020817] dark:text-[white] rounded-r-2xl">
                            <AiOutlineSearch />
                        </div>
                    </div>
                    {toggleSearch ? FlexMenu({ listData: listInputUser }) : FlexMenu({ listData: listUserOnline })}
                </div>
            }
            {/* sidebar 2 navigation menu */}
            {
                openSidebar.navi
                &&
                <div className="absolute top-0 left-0 bg-white flex flex-col items-center w-[250px] max-sm:w-full h-screen border-r-[1px] border-black shadow-lg shadow-slate-700 z-20">
                    <div className="w-4/5">
                        <button className="" onClick={() => { setOpenSidebar(prev => { return { list: prev.list, navi: false } }) }}>close navigation menu</button>
                    </div>
                    <div className="w-4/5 flex flex-col gap-3 mt-2">
                        <Link to={'/home/profile'}>Profile</Link>
                        <Link to={'/home'}>Home</Link>
                    </div>
                </div>
            }
            <div className="flex flex-col flex-grow h-full">
                <div className="w-full h-20 flex justify-between px-[3%] border-b-[1px] bg-slate-50 shadow-sm">
                    <div className="flex gap-2 items-center">
                        {!device.sm && <div onClick={() => { setOpenSidebar({ list: true, navi: false }) }}>back</div>}
                        <div className="flex items-center gap-2">
                            <div className="w-14 aspect-square relative">
                                <img className="w-full h-full rounded-full" src={targetMessageUserData?.img} alt="a picture" />
                                <div className="absolute w-4 h-4 bg-green-500 rounded-full bottom-1 right-1 border-[1px] border-white" />
                            </div>
                            <p className="text-xl">{targetMessageUserData?.name}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="text-2xl"><AiOutlineSearch /></div>
                        <div className="text-2xl relative">
                            <div ref={targetuserMessageButtonRef} onClick={() => { setTargetUserMessageMenuOpen({ button: true, menu: false }) }}>
                                <AiOutlineMore />
                            </div>
                            {
                                (targetUserMessageMenuOpen.button || targetUserMessageMenuOpen.menu)
                                &&
                                <div onMouseDown={() => setTargetUserMessageMenuOpen({ button: false, menu: true })} className="absolute flex flex-col gap-1 rounded-lg top-12 right-0 w-fit h-fit px-2 py-3 z-50 bg-slate-50 shadow-2xl" ref={targetuserMessageMenuRef}>
                                    <div className="min-w-36 px-3 py-1 rounded-md flex items-center text-red-600 font-bold text-sm hover:bg-slate-200">
                                        Block
                                    </div>
                                    <div className="min-w-36 px-3 py-1 rounded-md flex items-center text-red-600 font-bold text-sm hover:bg-slate-200">
                                        Block
                                    </div>
                                    <div className="min-w-36 px-3 py-1 rounded-md flex items-center text-red-600 font-bold text-sm hover:bg-slate-200">
                                        Block
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {/* message render */}
                <div className="w-full h-[calc(100%-80px-56px)] overflow-y-scroll gap-5 tiny-scrollbar relative" ref={messageRenderRef}>
                    <div className={`absolute w-full h-full px-[2%] ${isDragActive ? '' : 'bg-white'}`}>
                        {
                            targetMessageUserData &&
                            messageListData.map((message, index) => {
                                return (
                                    <div key={index} className="flex flex-col items-center h-max min-h-16">
                                        <div className={`p-2 rounded-full items-center w-fit max-w-[66%] flex gap-2 ${message.idSend == users.id ? 'flex-row-reverse self-end' : 'flex-row'} mt-2`}>
                                            <img className="w-16 h-16 rounded-full" src={`${message.idSend == users.id ? users.Avarta : targetMessageUserData.img}`} alt='' />
                                            <div className="bg-white text-black p-3 min-h-[50px] rounded-3xl ml-2">
                                                <div className="flex flex-col gap-1">
                                                    <p className={`font-bold text-xl ${message.idSend == users.id ? 'self-end' : 'self-start'}`} id={index}>
                                                        {message.content}
                                                    </p>
                                                    <p className={`text-xs font-thin text-slate-500 ${message.idSend == users.id ? 'self-end' : 'self-start'}`}>{message.sendAt}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={`sticky top-0 left-0 w-full h-full px-[1.5%]`} {...getRootProps()}>
                        {
                            isDragActive ? (
                                <div className="h-full w-full bg-slate-200 border-2 border-dashed border-cyan-400 bg-opacity-30 flex items-center text-center justify-center">
                                    <input
                                        {...getInputProps()}
                                        aria-label="file"
                                        className="w-full h-full"
                                    />
                                    <p className="text-2xl font-bold">
                                        Drop file here
                                    </p>
                                </div>
                            ) : (
                                <div className="flex gap-1">
                                    {file ? file.name : ''}
                                </div>
                            )}
                    </div>
                </div>
                <div className="w-full h-14 flex justify-between px-[3%] border-t-[1px] shadow-sm bg-slate-50">
                    <div className="h-full flex items-center">
                        <button onClick={setOpenUploadFile}>
                            <AttachFileIcon />
                        </button>

                    </div>
                    <div className="flex flex-row-reverse px-5 gap-3 flex-grow items-center">
                        <button className="w-9 aspect-square" onClick={handleSendMessage}>
                            send
                        </button>

                        <input className="flex-grow h-10 rounded-full border-slate-400 bg-slate-200 px-2 py-1" placeholder="enter message" />
                    </div>
                </div>
            </div>
        </div>
    )
}