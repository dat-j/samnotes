import React, { useCallback, useState, useEffect, useRef } from "react";
import axios from "axios";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import StorageKeys from "../../constants/storage-keys";
import jwtDecode from "jwt-decode";
import { Box, createTheme, Typography, Stack, TextField } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import InputField from "../../components/FormControls/InputField";
import { SendOutlined } from '@ant-design/icons'
import { useOnClickOutside } from "../../customHook/useOnClickOutside";
import { useCopyToClipboard } from "src/customHook/useCopyToClipboard";
import { FaCopy } from "react-icons/fa6";
import { useSnackbar } from "notistack";
import Menu from '@mui/material/Menu';

const ListNoteRender = ({ listData, user }) => {
    const NoteRender = (noteData) => {
        const [listComment, setListComment] = useState([]);
        const [like, setLike] = useState(false);
        const [dislike, setDislike] = useState(false);
        const [viewCount, setViewCount] = useState();
        const [cmtValue, setCommentValue] = useState("");
        const [showComment, setShowComment] = useState(false);

        const { enqueueSnackbar } = useSnackbar();
        const cmtRef = useRef(null);
        const [copiedText, setCopyTech] = useCopyToClipboard();

        // mui
        const [anchorEl, setAnchorEl] = React.useState(null);
        const open = Boolean(anchorEl);
        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
            setAnchorEl(null);
        };

        useOnClickOutside(cmtRef, () => { setShowComment(false) })

        useEffect(() => {
            axios.get(`https://samnote.mangasocial.online/notes/notes-comment/${noteData.noteData.idNote}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                }
            }).then(res => {
                setListComment(res.data.data);
            }).catch(err => {
                setListComment([]);
            })

            axios.get('https://samnote.mangasocial.online/view').then(res => {
                res.data.data.map(data => {
                    if (data.idNote == noteData.noteData.idNote) {
                        setViewCount(data.view)
                    }
                });
            })
        }, [])

        /**
         * @param (type, value):(number, boolean)
         * type 0: like
         * type 1: dislike
         */

        const handlePostComment = () => {
            axios.post("https://samnote.mangasocial.online/notes/notes-comment", {
                idNote: noteData.noteData.noteId,
                idUser: user.id,
                parentId: 0,
                text: cmtValue
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                }
            })
        }

        return (
            <div className="flex h-max max-xl:flex-col max-xl:gap-5 border-[1px solid #e2e2e2] rounded-[12px] px-[6px] py-[12px] mx-[12px] shadow-[0px 4px 4px rgba(0, 0, 0, 0.25)]"
                style={{
                    backgroundColor: `rgba(${noteData.noteData.color.r}, ${noteData.noteData.color.g}, ${noteData.noteData.color.b}, ${noteData.noteData.color.a})`,
                }}>
                <div className={`flex flex-grow-0 flex-col ${showComment ? 'w-full xl:w-3/4' : 'w-full'}`}>
                    {/* note's main */}
                    <div className="px-4 py-2 flex flex-col">
                        <div className="flex items-center gap-2">
                            <img className="w-[70px] h-[70px] rounded-full" src={user.Avarta ? user.Avarta : ""} />

                            {/* note description */}
                            <div className="flex justify-between h-16 flex-grow">
                                {/*note's owner detail */}
                                <div className="flex flex-col justify-between">
                                    <p className="text-black text-xl font-bold">{user.name}</p>
                                    <p className="text-black text-base font-normal">join at date {user.createAt}</p>
                                </div>
                                {/*note's menu icon */}
                                <div onClick={handleClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 49" fill="none">
                                        <path d="M42 24.5L28 10.5V18.5C14 20.5 8 30.5 6 40.5C11 33.5 18 30.3 28 30.3V38.5L42 24.5Z" fill="black" />
                                    </svg>
                                </div>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <div className="flex px-3 py-2 justify-between">
                                        <p className="text-2xl font-bold">share note</p>
                                        <p className="text-2xl font-bold" onClick={handleClose}>x</p>
                                    </div>
                                    <div className="flex gap-4 p-3 items-center">
                                        <TextField id="standard-basic" disabled label="Standard" variant="standard" value={`http://localhost:3000/note/${noteData.noteData.idNote}`} />
                                        <div className="text-2xl" onClick={() => { setCopyTech(`http://localhost:3000/note/${noteData.noteData.idNote}`); enqueueSnackbar('copied to clipboard') }}>
                                            <FaCopy />
                                        </div>
                                    </div>
                                </Menu>
                            </div>
                        </div>
                        {/* note content */}
                        <div className="flex flex-col gap-2">
                            <p className="text-xl font-bold leading-7">{noteData.noteData.title}</p>
                            <p className="text-base leading-8 font-normal">{noteData.noteData.data}</p>
                        </div>
                    </div>
                    {/* note reaction */}
                    <div className="px-4">
                        <p style={{ margin: "30px 0" }}>Created at {noteData.noteData.createAt}</p>
                        <div className="flex justify-end gap-5 items-center">
                            {/* note view count */}
                            {viewCount &&
                                <div className="flex gap-2 items-center">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </g>
                                    </svg>
                                    <p className="text-[#000] text-[22px] font-light">2</p>
                                </div>
                            }
                            {/* note like count*/}
                            <div className="flex gap-2 items-center"
                                onClick={() => {
                                    setLike(prev => { return !prev })
                                    handleInteractWithNote(0, dislike)
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 29 30" fill="none">
                                    <path d="M8.40039 14.0002L13.2004 3.2002C14.1552 3.2002 15.0708 3.57948 15.746 4.25461C16.4211 4.92974 16.8004 5.84542 16.8004 6.80019V11.6002H23.5924C23.9403 11.5963 24.2849 11.668 24.6023 11.8105C24.9197 11.9529 25.2023 12.1627 25.4306 12.4252C25.6589 12.6877 25.8274 12.9968 25.9244 13.3309C26.0214 13.665 26.0446 14.0162 25.9924 14.3602L24.3364 25.1602C24.2496 25.7325 23.9589 26.2541 23.5179 26.629C23.0768 27.0039 22.5152 27.2067 21.9364 27.2002H8.40039M8.40039 14.0002V27.2002M8.40039 14.0002H4.80039C4.16387 14.0002 3.55342 14.2531 3.10333 14.7031C2.65325 15.1532 2.40039 15.7637 2.40039 16.4002V24.8002C2.40039 25.4367 2.65325 26.0472 3.10333 26.4972C3.55342 26.9473 4.16387 27.2002 4.80039 27.2002H8.40039" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p className="text-[#000] text-[22px] font-light">1</p>
                            </div>
                            {/* note dislike count */}
                            <div className="flex gap-2 items-center" onClick={() => {
                                setDislike(prev => { return !prev })
                                handleInteractWithNote(1, dislike)
                            }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30" fill="none">
                                    <path d="M21.2002 16.2002L16.4002 27.0002C15.4455 27.0002 14.5298 26.6209 13.8546 25.9458C13.1795 25.2706 12.8002 24.355 12.8002 23.4002V18.6002H6.00823C5.66034 18.6041 5.31576 18.5324 4.99835 18.3899C4.68094 18.2475 4.39829 18.0377 4.17 17.7752C3.94171 17.5126 3.77323 17.2036 3.67622 16.8695C3.57922 16.5354 3.55602 16.1842 3.60823 15.8402L5.26423 5.04019C5.35102 4.4679 5.64171 3.94626 6.08275 3.57138C6.52378 3.1965 7.08544 2.99365 7.66423 3.00019H21.2002M21.2002 16.2002V3.00019M21.2002 16.2002H24.4042C25.0834 16.2122 25.7433 15.9744 26.2587 15.532C26.7741 15.0896 27.1092 14.4733 27.2002 13.8002V5.40019C27.1092 4.72706 26.7741 4.11079 26.2587 3.66837C25.7433 3.22595 25.0834 2.98818 24.4042 3.00019H21.2002" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p className="text-black text-xl font-normal">1</p>
                            </div>
                            {/* note comment count */}
                            <div className="flex gap-2 items-center" onClick={() => { setShowComment(prev => { return !prev }) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30" fill="none">
                                    <path d="M25.7992 14.4002C25.8033 15.9841 25.4333 17.5465 24.7192 18.9602C23.8725 20.6543 22.5709 22.0792 20.9602 23.0754C19.3494 24.0715 17.4931 24.5995 15.5992 24.6002C14.0154 24.6044 12.453 24.2343 11.0392 23.5202L4.19922 25.8002L6.47922 18.9602C5.76514 17.5465 5.39509 15.9841 5.39922 14.4002C5.39995 12.5063 5.92795 10.6501 6.92408 9.03929C7.92021 7.42853 9.34512 6.12691 11.0392 5.28023C12.453 4.56615 14.0154 4.1961 15.5992 4.20023H16.1992C18.7004 4.33822 21.0629 5.39394 22.8342 7.16526C24.6055 8.93658 25.6612 11.299 25.7992 13.8002V14.4002Z" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p className="text-black text-xl font-normal">{listComment.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    showComment && <div ref={cmtRef} className="flex flex-col gap-8 p-4 w-1/4 max-xl:w-full max-xl:mt-2 bg-[rgba(0,0,0,0.1)] rounded-lg">
                        <div className="flex gap-5 items-center h-fit group-focus:scale-105 group-focus:shadow-lg">
                            <input name="value" value={cmtValue} onChange={e => setCommentValue(e.target.value)} className="w-full group bg-transparent text-xl leading-8 border-solid border-b-[1px] border-slate-400 focus:border-b-2 focus:border-slate-700 focus:outline-none" />
                            <button onClick={handlePostComment} className="border-none bg-transparent flex justify-center items-center">
                                <SendOutlined />
                            </button>
                        </div>

                        <div className="flex flex-shrink-0 flex-grow flex-col gap-5 items-center overflow-y-auto">
                            {listComment.map((cmt, index) => {
                                { console.log(cmt) }
                                return (
                                    <div className="w-full px-5 py-3 rounded-lg shadow-lg bg-slate-200" key={index}>
                                        <div className="flex gap-4 items-center">
                                            <img className="rounded-full w-16 h-16" src={''} alt="" />
                                            <p className="font-bold text-xl">comment owner name</p>
                                        </div>
                                        <div>
                                            <p>comment content here</p>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                }

            </div>
        )
    }
    return (
        <div className="p-2 overflow-y-auto flex flex-col gap-5 rounded-md bg-white">
            {listData.map(note => {
                return <NoteRender noteData={note} />
            })}
            {
                listData.length == 0 && <div className="">
                    <p className="text-xl font-bold text-center">No note to show</p>
                </div>
            }
        </div>
    )

}

const handleInteractWithNote = (type, value) => {
    // handle like/dislike here
    if (type == 0) {
        if (value) {

        } else {

        }
    }
}


export default ListNoteRender;