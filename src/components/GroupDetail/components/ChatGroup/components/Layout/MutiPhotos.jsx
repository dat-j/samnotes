import React from "react";
import PropTypes from "prop-types";
import { Grid, ImageList, ImageListItem } from "@mui/material";
import { Image } from "antd";
import useWindowDimensions from "../../../../../../customHook/WindowDimensions";

MutiPhotos.propTypes = {
    str_image: PropTypes.string.isRequired,
};

function MutiPhotos({ str_image }) {
    const arr_image = str_image.split(";");
    const {width}=useWindowDimensions()
    return (
        <ImageList
            gaps={4}
            rowHeight={200}
            cols={ arr_image.length >= 3 && arr_image.length <= 6 && width>600 ? 2 : arr_image.length > 6 && width>1000 ? 3 : 1}
        >
            {arr_image.map((item) => (
                <ImageListItem sx={{"& div":{height:"100%"}, "& .ant-image-mask-info":{
                    display:"none !important"
                }}} key={item}>
                    
                    <Image
                        
                        src={item}
                        style={{height:"100%", border: "1px solid rgba(27, 31, 35, 0.15)", maxWidth: "300px",objectFit:"cover" }}
                        srcSet={item}
                        alt='img-send'
                        loading='lazy'
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}

export default MutiPhotos;
