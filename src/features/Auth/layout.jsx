import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Link, Typography, Grid } from "@mui/material";

import Box from "@mui/material/Box";
import { unwrapResult } from "@reduxjs/toolkit";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import InputField from "./../../components/FormControls/InputField";
import PasswordField from "./../../components/FormControls/PasswordField";
import useWindowDimensions from "./../../customHook/WindowDimensions";
import { login } from "./userSlice";

import jwtDecode from "jwt-decode";
import StorageKeys from "./../../constants/storage-keys";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login/index.scss";
import images from "./../../assets/images";
import Login from './Login'
import Register from './Register';
import Forgot from './Forgot';


import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';


const options = [
    <a href='' className="">ABOUT SAMNOTE</a>,
    <a href='/feature' className="">FEATURE</a>,
    <a href='' className="">FOR INDIVIDUAL</a>,
    <a href='' className="">FOR GROUP</a>,
    <a href='/help' className="">HELP</a>
];

export default function AuthLayout() {
    const location = useLocation();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const open = Boolean(anchorEl);
    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <div className='flex justify-between w-screen h-[80px] bg-white p-5 items-center'>
                <a href='' className="flex items-center">
                    <img className='logo' src={images.logo} />
                    <p className="text-3xl font-bold text-black">SAMNOTE</p>
                </a>
                <div className="max-md:hidden">
                    <ul className=' whitespace-nowrap max-w-[60vw] navbar-list-item'>
                        <li>
                            <a href='' className="">ABOUT SAMNOTE</a>
                        </li>
                        <li>
                            <a href='/feature' className="">FEATURE</a>
                        </li>
                        <li>
                            <a href='' className="">FOR INDIVIDUAL</a>
                        </li>
                        <li>
                            <a href='' className="">FOR GROUP</a>{" "}
                        </li>
                        <li>
                            <a href='/help' className="">HELP</a>
                        </li>
                    </ul>
                </div>
                <div className="flex items-center gap-5">
                    <button className="max-[400px]:hidden h-[35px] flex items-center font-semibold text-[#3A4BE0] border-spacing-x-3 border-[1px] rounded-xl border-[#3A4BE0] text-sm px-3 py-2">
                        Download
                    </button>
                    <button onClick={handleClickListItem} className="md:hidden">menu</button>
                </div>
                <Menu
                    id="lock-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'lock-button',
                        role: 'listbox',
                    }}
                >
                    <MenuItem
                        key={-1}
                        selected={-1 === selectedIndex}
                    >

                        <a href="/download" className="">Download app</a>
                    </MenuItem>
                    {options.map((option, index) => (
                        <MenuItem
                            key={index}
                            selected={index === selectedIndex}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </div >
            <Box
                sx={{
                    height: "100dvh",
                    width: "100vw",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${images.bgrLogin})`,
                }}
            >
                <Box height='100%'>
                    <div className="flex max-md:flex-col items-center justify-around max-md:justify-stretch h-full">

                        {/* SAMNOTE describe */}
                        <div className="justify-center flex md:w-1/2 max-md:h-1/3">
                            <div className="w-[90%] flex items-center">
                                <img
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        marginRight: "8px",
                                    }}
                                    src={images.logo}
                                />
                                <Box>
                                    <Typography
                                        sx={{
                                            color: "#fff",
                                            fontSize: "2rem",
                                            fontWeight: "700",
                                        }}
                                    >
                                        SAMNOTE
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: "#fff",
                                            fontSize: "1.8rem",
                                            fontWeight: "700",
                                        }}
                                    >
                                        Create Free Notes, Calendar Reminders, Group Chat, Share Notes With AI
                                    </Typography>
                                </Box>
                            </div>
                        </div>

                        {/* login/register/forgot form container */}
                        <div className="items-stretch max-md:items-start flex justify-center">
                            <div className='box-container w-[70%] min-[400px]:min-w-[400px] max-w-[1500px] max-h-[380px] bg-white shadow-xl py-[15px] px-[35px] overflow-auto rounded-lg'>

                                {location.pathname == "/login" ? <Login /> : location.pathname == "/register" ? <Register /> : <Forgot />}
                            </div>
                        </div>
                    </div>
                </Box>
            </Box>
            {/* footer */}
            <div className="flex sm:gap-0 md:gap-5 max-sm:flex-col px-2 py-5">
                <div className="flex max-md:justify-around gap-5 items-center max-sm:w-full w-3/4">
                    {/* logo */}
                    <div className="flex gap-3 items-center">
                        <img className='logo' src={images.logo} />
                        <Typography
                            sx={{
                                fontSize: "1.3rem",
                                fontWeight: "500",
                            }}
                        >
                            SAMNOTE
                        </Typography>
                    </div>

                    <Typography
                        sx={{
                            fontSize: "1.2rem",
                            fontWeight: "550",
                        }}
                    >
                        Now we have mobile version
                    </Typography>
                </div>
                <Button
                    className="max-sm:w-full w-1/4"
                    sx={{
                        height: "35px",
                        color: "#3A4BE0",
                        fontSize: "0.9rem",
                        border: "1px solid #3A4BE0",
                        borderRadius: "12px",
                        mt: "7px",
                        "&:hover": {
                            background: "transparent",
                        },
                    }}
                >
                    Download
                </Button>
            </div>
        </>
    )
}