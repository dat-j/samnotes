import { Box, IconButton, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React, { useRef } from "react";
import { Autoplay, Navigation, Pagination } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";
import "./ChatGroup/components/styles.css";
// Import Swiper styles
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import "swiper/css";

import "swiper/css/pagination";
import "swiper/css/scrollbar";
Welcome.propTypes = {
    group: PropTypes.object.isRequired,
};

function Welcome({ group }) {
    const swiperRef = useRef();
    return (
        <Stack
            flexDirection='column'
            alignItems='center'
            sx={{
                height: "calc(100vh - 55px)",
                width: "calc(100vw - 64px)",
                padding: "30px 20px",
            }}
        >
            <Typography sx={{ fontSize: "24px", marginBottom: "20px" }}>
                Welcome to group <strong>{group.name}</strong>!
            </Typography>
            <div style={{ width: "100%", maxWidth: "400px" }}>
                <Typography sx={{ fontSize: "16px" }}>
                    Discover utilities to help you work and take notes with colleagues and friends
                    optimized for your computer.
                </Typography>
            </div>
            <Box sx={{ width: "100%", height: "calc(100vh - 55px - 100px)" }}>
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    loop={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                      }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className='mySwiper'
                >
                    <SwiperSlide>
                        <img src={process.env.PUBLIC_URL + "/assets/chat-group.jpg"} alt='' />
                        <Typography
                            sx={{
                                color: "#007AFF",
                                fontWeight: 500,
                                fontSize: "20px",
                                marginTop: "10px",
                            }}
                        >
                            Group chat with colleagues
                        </Typography>
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={process.env.PUBLIC_URL + "/assets/reminder-group.jpg"} alt='' />
                        <Typography
                            sx={{
                                color: "#007AFF",
                                fontWeight: 500,
                                fontSize: "20px",
                                marginTop: "10px",
                            }}
                        >
                            Daily note reminder
                        </Typography>
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={process.env.PUBLIC_URL + "/assets/note-group.jpg"} alt='' />
                        <Typography
                            sx={{
                                color: "#007AFF",
                                fontWeight: 500,
                                fontSize: "20px",
                                marginTop: "10px",
                            }}
                        >
                            Quick and convenient to notes
                        </Typography>
                    </SwiperSlide>
                    <IconButton
                        sx={{
                            position: "absolute",
                            zIndex: "10",
                            left: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                        onClick={() => swiperRef.current.slidePrev()}
                    >
                        <ArrowBackIosNew fontSize='large' color='lightBlue' />
                    </IconButton>
                    <IconButton
                        sx={{
                            position: "absolute",
                            zIndex: "10",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                        onClick={() => swiperRef.current.slideNext()}
                    >
                        <ArrowForwardIos fontSize='large' color='lightBlue' />
                    </IconButton>
                </Swiper>
            </Box>
        </Stack>
    );
}

export default Welcome;
