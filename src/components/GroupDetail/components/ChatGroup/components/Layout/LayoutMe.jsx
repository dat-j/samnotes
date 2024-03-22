import { Avatar, Box, Stack } from "@mui/material";
import { Image } from "antd";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import MutiPhotos from "./MutiPhotos";
LayoutMe.propTypes = {
    data: PropTypes.object.isRequired,
    next:PropTypes.number.isRequired,
    prev:PropTypes.number.isRequired

};

function LayoutMe({ data,next,prev }) {
    const user =
        useSelector((state) => state.user.current) || JSON.parse(localStorage.getItem("user"));
    return (
        <Stack flexDirection='row' justifyContent='flex-end'>
            <Box
                sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    padding: "12px",
                    marginBottom:"5px",
                    cursor:"pointer",
                    marginRight:`${prev === data.idSend ?"55px":"0px"}`,
                    maxWidth:"60%"
                }}
            >
                 <Box sx={{ cursor: "text" }}>
                    {data.type === "text" && data.content}
                    {data.type === "image" && <Image  style={{maxWidth:"300px"}} src={data.metaData} />}
                    {data.type === "muti-image" && <MutiPhotos str_image={data.metaData}/>}

                    {data.type === "icon-image" && <img src={data.metaData} alt='icon' />}
                </Box>
                {next!==data.idSend &&<Stack
                    sx={{
                        color: "rgba(0,0,0,0.6)",
                        fontWeight: 400,
                        marginTop:"10px",
                        fontSize: "12px",
                    }}
                    flexDirection='row'
                    justifyContent='space-between'
                >
                    <span style={{marginRight:"10px"}}>{dayjs(data.sendAt).format("hh:mm")}</span>
                    <span>Đã gửi</span>
                </Stack>}
            </Box>
            {prev!==data.idSend &&<Avatar
                src={user.avt}
                style={{ width: "40px", height: "40px", marginLeft: "15px" }}
                alt={user.name}
            />}
        </Stack>
    );
}

export default LayoutMe;
