import { Avatar, Box, Stack, Typography } from "@mui/material";
import { Image } from "antd";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import MutiPhotos from "./MutiPhotos";
LayoutMe.propTypes = {
    data: PropTypes.object.isRequired,
    next: PropTypes.number.isRequired,
    prev: PropTypes.number.isRequired,
};

function LayoutMe({ data, next, prev }) {
    return (
        <Stack flexDirection='row' justifyContent='flex-start'>
            {prev !== data.idSend && (
                <Avatar
                    src={data.avt}
                    style={{ width: "40px", height: "40px", marginRight: "15px" }}
                    alt={data.name}
                />
            )}
            <Box
                sx={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    padding: "12px",
                    marginBottom: "5px",
                    cursor: "pointer",
                    marginLeft: `${prev === data.idSend ? "55px" : "0px"}`,
                    maxWidth: "60%",
                }}
            >
                {prev !== data.idSend && (
                    <Typography
                        noWrap
                        sx={{
                            fontSize: "13px",
                            width: "100%",
                            marginBottom: "5px",
                            color: "#7589a3",
                            cursor: "pointer",
                        }}
                    >
                        {data.name}
                    </Typography>
                )}
                <Box sx={{ cursor: "text" }}>
                    {data.type === "text" && data.content}
                    {data.type === "image" && <Image  style={{maxWidth:"300px"}} src={data.metaData} />}
                    {data.type === "muti-image" && <MutiPhotos str_image={data.metaData}/>}
                    {data.type === "icon-image" && <img src={data.metaData} alt='icon' />}
                </Box>

                {next !== data.idSend && (
                    <Stack
                        sx={{
                            color: "rgba(0,0,0,0.6)",
                            fontWeight: 400,
                            marginTop: "10px",
                            fontSize: "13px",
                        }}
                        flexDirection='row'
                        justifyContent='space-between'
                    >
                        <span style={{ marginRight: "10px" }}>
                            {dayjs(data.sendAt).format("hh:mm")}
                        </span>
                        <span></span>
                    </Stack>
                )}
            </Box>
        </Stack>
    );
}

export default LayoutMe;
