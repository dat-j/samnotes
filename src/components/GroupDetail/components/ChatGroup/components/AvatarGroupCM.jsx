import React from "react";
import PropTypes from "prop-types";
import { Avatar, Box } from "@mui/material";

AvatarGroupCM.propTypes = {
    data: PropTypes.array.isRequired,
    w:PropTypes.number
};
AvatarGroupCM.defaultProps={
    w:50
}
function AvatarGroupCM({ data,w }) {
    return (
        <>
            {data.length > 4 && (
                <Box sx={{ width: `${w}px`, height: `${w}px`, position: "relative" }}>
                    <Avatar
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: `${w/2}px`,
                            height: `${w/2}px` ,
                            borderRadius: "50%",
                        }}
                        alt='avatar'
                        src={data[0]}
                    />
                    <Avatar
                        sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: `${w/2}px` ,
                            height: `${w/2}px` ,
                            borderRadius: "50%",
                        }}
                        alt='avatar'
                        src={data[1]}
                    />
                    <Avatar
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: `${w/2}px`,
                            height: `${w/2}px`,
                            borderRadius: "50%",
                        }}
                        alt='avatar'
                        src={data[2]}
                    />
                    <Avatar
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: `${w/2}px` ,
                            height: `${w/2}px` ,
                            borderRadius: "50%",
                            fontSize:"12px"
                        }}
                        alt='avatar'
                        
                    >+{data.length-3}</Avatar>
                </Box>
            )}
            {data.length === 4 && (
                <Box sx={{ width: `${w}px`, height: `${w}px`, position: "relative" }}>
                    <Avatar
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: `${w/2}px`,
                            height: `${w/2}px`,
                            borderRadius: "50%",
                        }}
                        alt='avatar'
                        src={data[0]}
                    />
                    <Avatar
                        sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: `${w/2}px`,
                            height: `${w/2}px`,
                            borderRadius: "50%",
                        }}
                        alt='avatar'
                        src={data[1]}
                    />
                    <Avatar
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: `${w/2}px`,
                            height: `${w/2}px`,
                            borderRadius: "50%",
                        }}
                        alt='avatar'
                        src={data[2]}
                    />
                    <Avatar
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: `${w/2}px`,
                            height: `${w/2}px`,
                            borderRadius: "50%",
                        }}
                        alt='avatar'
                        src={data[3]}
                    />
                </Box>
            )}
           
        </>
    );
}

export default AvatarGroupCM;
