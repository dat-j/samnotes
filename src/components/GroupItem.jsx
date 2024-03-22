import { Box, Tooltip, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router-dom";

GroupItem.propTypes = {
    dataItem: PropTypes.object.isRequired,
};

function GroupItem({ dataItem }) {
    const navigate=useNavigate()
    const handleNavGroup=()=>{
        navigate(`/group/${dataItem.idGroup}/welcome`)
    }
    return (
        <div
            style={{
                backgroundColor: `#FFFFFF`,
                position: "relative",
                width: "100%",
                maxWidth: "350px",
                cursor: "pointer",
                height: "220px",
                borderRadius: "5px",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                padding: "10px 15px",
            }}
            onClick={handleNavGroup}
        >
            <Box sx={{ position: "absolute", right: "10px" }}></Box>
            <Tooltip
                title={<span style={{ fontSize: "14px" }}>{dataItem.name}</span>}
                placement='top'
            >
                <span
                    style={{
                        fontWeight: 500,
                        fontSize: "24px",
                        width: "calc(100% - 80px)",
                        marginBottom: "5px",
                        display: "block",
                        cursor: "default",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {dataItem.name}
                </span>
            </Tooltip>
            <div
                className='box-container'
                style={{
                    width: "100%",
                    overflow: "hidden auto",
                    maxHeight: "100px",
                    wordWrap: "break-word",
                }}
            >
                <Typography sx={{ color: "#00000080", fontWeight: "500", fontSize: "16px" }}>
                    {dataItem.describe}
                </Typography>
            </div>
            
            <div
                style={{
                    fontWeight: 500,
                    fontSize: "14px",
                    background: "rgba(255, 255, 255, 0.160784)",
                    borderRadius: "3px",
                    display: "inline-block",
                    color: "black",
                    padding: "5px 8px",
                    position: "absolute",
                    bottom: "15px",
                    marginRight: "15px",
                }}
            >
                {dataItem.numberMems} members
            </div>
        </div>
    );
}

export default GroupItem;
