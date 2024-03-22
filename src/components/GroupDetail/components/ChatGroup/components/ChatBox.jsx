import {
    AddAPhotoRounded,
    AttachFileRounded,
    InterestsRounded,
    QuickreplyOutlined,
} from "@mui/icons-material";
import { Button, Divider, IconButton, Stack, TextField, Tooltip } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

ChatBox.propTypes = {
    nameGroup: PropTypes.string.isRequired,
    handleSend: PropTypes.func.isRequired,
};

function ChatBox({ nameGroup, handleSend }) {
    const [value, setValue] = useState("");
    const user =
        useSelector((state) => state.user.current) || JSON.parse(localStorage.getItem("user"));
    const handleChangeValue = (e) => {
        const val = e.target.value;
        setValue(val);
    };
    const imageRef=useRef()
    const { enqueueSnackbar } = useSnackbar();

    const handleImageInputChange =async (e) => {
        const files=e.target.files
        let metaData=""
        if(files.length===0) return;
        for (const file of files){
                console.log(file)

                const formData = new FormData();
                formData.append("image", file);
                try {
                    const imgbb = await axios.post(
                        "https://api.imgbb.com/1/upload?key=a07b4b5e0548a50248aecfb194645bac",
                        formData
                    );
                    const url = imgbb?.data.data.url || null;
                    metaData=metaData+url+";"
                } catch (error) {
                    enqueueSnackbar("Some error occurred, please try again",{variant:"error"})
                }      
        }
        handleSend({
            idSend: user.id,
            avt: user.avt,
            name: user.name,
            type: `${files.length===1?"image":"muti-image"}`,
            metaData: `${metaData.slice(0, -1)}`,
            sendAt:dayjs().format("DD/MM/YYYY hh:mm A Z")
        })
        
    };
    const handleSendLike = () => {
        handleSend({
            idSend: user.id,
            avt: user.avt,
            name: user.name,
            type: "icon-image",
            metaData: `${process.env.PUBLIC_URL + "/assets/like.png"}`,
            sendAt:dayjs().format("DD/MM/YYYY hh:mm A Z")
        });
    };
    const handleSendImage = () => {
        console.log("Tôi đang muốn gửi ảnh");
        imageRef.current.click()
    };
    const handleSendMessage = () => {
        if (value.length === 0) return;
        handleSend({
            idSend: user.id,
            avt: user.avt,
            name: user.name,
            type: "text",
            content: value,
            sendAt:dayjs().format("DD/MM/YYYY hh:mm A Z")
        });
        setValue("");
    };
    function handleKeyDown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            // Do something here
            handleSendMessage();
        }
    }
    return (
        <Stack flexDirection='column' sx={{ minHeight: "100px"}}>
            <Stack
                direction='row'
                justifyContent='flex-start'
                alignItems='center'
                spacing={1}
                sx={{ padding: "2px 8px" }}
            >

                {/* sticker and Emoji */}

                {/* <Tooltip placement='top' title='Sticker & Emoji'>
                    <IconButton aria-label='Sticker'>
                        <InterestsRounded color='lightBlue' />
                    </IconButton>
                </Tooltip> */}

                <Tooltip placement='top' title='Add Image'>
                    <IconButton onClick={handleSendImage} aria-label='Add Image'>
                        <AddAPhotoRounded color='lightBlue' />
                    </IconButton>
                </Tooltip>
                <input
                    type='file'
                    accept='image/png, image/jpeg'
                    id='upload-photo'
                    name='upload-photo'
                    ref={imageRef}
                    multiple
                    onChange={handleImageInputChange}
                    style={{ display: "none" }}
                />
                {
                
                /* <Tooltip placement='top' title='Attach file'>
                    <IconButton aria-label='Attach file'>
                        <AttachFileRounded color='lightBlue' sx={{ transform: "rotate(45deg)" }} />
                    </IconButton>
                </Tooltip> */}
                
            </Stack>
            <Divider />

            <Stack
                flex={1}
                sx={{ height: "calc(100px - 45px)", marginRight: "10px" }}
                flexDirection='row'
                alignItems='center'
            >
                <TextField
                    id='chat-textarea'
                    fullWidth
                    label=''
                    sx={{
                        "& .MuiInputBase-root:hover:before": {
                            borderBottom: "none !important",
                        },
                        "& .MuiInputBase-root:hover:after": {
                            borderBottom: "none !important",
                        },
                        "& .MuiInputBase-root:hover": {
                            borderBottom: "none !important",
                        },
                        "& .MuiInputBase-root:before": {
                            borderBottom: "none !important",
                        },
                        "& .MuiInputBase-root:after": {
                            borderBottom: "none !important",
                        },

                        "&": {
                            padding: "4px 12px ",
                            overflow: "hidden auto",
                        },

                        "& .MuiInputBase-root:placeholder": {
                            color: "black !important",
                        },
                    }}
                    value={value}
                    onChange={handleChangeValue}
                    placeholder={`Type @, Chat with group ${nameGroup} !`}
                    multiline
                    maxRows={5}
                    variant='standard'
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                />

                <Tooltip placement='top' title='Quick Chat'>
                    <IconButton aria-label='Quick Chat'>
                        <QuickreplyOutlined color='black' />
                    </IconButton>
                </Tooltip>
                <Tooltip placement='top' title='Tag'>
                    <IconButton aria-label='Quick Chat'>
                        <span style={{ fontSize: "20px", color: "black" }}>@</span>
                    </IconButton>
                </Tooltip>
                {value.length === 0 ? (
                    <IconButton
                        onClick={handleSendLike}
                        sx={{ marginRight: "10px" }}
                        aria-label='like'
                    >
                        <img src={process.env.PUBLIC_URL + "/assets/like.png"} alt='like' />
                    </IconButton>
                ) : (
                    <Button onClick={handleSendMessage}>Send</Button>
                )}
            </Stack>
        </Stack>
    );
}

export default ChatBox;
