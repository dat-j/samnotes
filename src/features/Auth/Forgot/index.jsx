import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Link, Typography, Grid } from "@mui/material";

import Box from "@mui/material/Box";
import { unwrapResult } from "@reduxjs/toolkit";
import { useSnackbar } from "notistack";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import InputField from "../../../components/FormControls/InputField";
import PasswordField from "../../../components/FormControls/PasswordField";
import useWindowDimensions from "../../../customHook/WindowDimensions";
import { resetPassword, updatePassword } from "../userSlice";

import jwtDecode from "jwt-decode";
import StorageKeys from "../../../constants/storage-keys";
import { useNavigate, useLocation } from "react-router-dom";
import images from "../../../assets/images";
import axios from 'axios'

function Forgot() {

    const location = useLocation();
    const window = useWindowDimensions();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const getResetCodeObject = yup
        .object()
        .shape({
            gmail: yup
                .string()
                .required("Please enter your gmail"),
        })
        .required();

    const form = useForm({
        defaultValues: {
            gmail: "",
        },
        resolver: yupResolver(getResetCodeObject),
    });

    // const newPasswordForm = useForm({
    //     defaultValues: {
    //         password: "",
    //         rePassword: ""
    //     },
    //     resolver: yupResolver(newPasswordObject)
    // })

    /**
     * 
     * @param {*} values 
     */
    const handleGetResetCode = async (values) => {
        try {
            const action = resetPassword(values);
            // test api
            // const resultAction = axios.post("https://samnote.mangasocial.online/resetPasswork",{
            //     gmail: values.gmail
            // })

            const resultAction = await dispatch(action);
            console.log(resultAction);
            unwrapResult(resultAction);
            enqueueSnackbar("email send successfully", { variant: "success" });
            // setTimeout(() => {
            //     if (location.pathname === "/login") navigate("/home");
            //     else document.location.reload();
            // }, 1000);
        } catch (e) {
            enqueueSnackbar(e.message, { variant: "error" });
        }
    }

    const handleConfirmCode = (values) => {
        console.log(values)
    }

    const handleUpdatePasswordDone = async (values) => {
        try {
            const action = updatePassword(values);

            const resultAction = await dispatch(action);
            console.log(resultAction);
            unwrapResult(resultAction);

            enqueueSnackbar("password change successfully", { variant: "success" });
            setTimeout(() => {
                if (location.pathname === "/login") navigate("/home");
                else document.location.reload();
            }, 1000);
        } catch (e) {
            enqueueSnackbar(e.message, { variant: "error" });
        }
    };
    const handleSuccess = (credentialResponse) => {
        // Xử lý kết quả đăng nhập thành công

        localStorage.setItem(StorageKeys.TOKEN, JSON.stringify(credentialResponse.credential));
        let tok = localStorage.getItem(StorageKeys.TOKEN);
        const UserGoogle = jwtDecode(credentialResponse.credential);
        localStorage.setItem(StorageKeys.USER, JSON.stringify(UserGoogle));
        if (!tok) {
            return;
        }
        enqueueSnackbar("Logged in successfully", { variant: "success" });
        setTimeout(() => {
            navigate("/home");
        }, 1000);
    };

    const handleFailure = (response) => {
        console.log(response);
        // Xử lý kết quả đăng nhập thất bại ở đây
    };

    /**
     * Send code to the target gmail
     */
    const handleSendCode = () => {

    }

    return (
        <Box sx={{ display: "flex" }}>
            <Box
                sx={{
                    flex: "1 1",
                    padding: "0 10px 0 15px",
                    maxWidth: "500px",
                    margin: "0 auto",
                }}
            >
                <form
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                    onSubmit={form.handleSubmit(handleGetResetCode)}
                >

                    <InputField label='User name or gmail ' name='gmail' form={form} />
                    {/* <Box sx={{
                            display: "flex",
                            gap: "20px"
                        }}>
                            <Button
                                size='large'
                                sx={{ marginTop: 1, color: "#fff", backgroundColor: "#3A4BE0", flexShrink: 0, marginBlock: "15px" }}
                                type="submit"

                            >
                                Get code
                            </Button>

                            <InputField label='Enter code' name='code' form={form} />

                        </Box> */}
                    <button className="px-2 py-1 text-2xl text-white bg-[#3A4BE0] w-full mt-1">
                        Confirm
                    </button>
                </form>


                {/* {
                    !isGettingCode &&
                    <form
                        onSubmit={newPasswordForm.handleSubmit(handleUpdatePasswordDone)}
                    >
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px"
                        }}>

                            <input type="hidden" value={currentMailState.gmail} name="gmail" />
                            <PasswordField name='Password' label='password' form={newPasswordForm} />
                            <PasswordField name='rePassword' label='Retype password' form={newPasswordForm} />
                        </Box>
                        <Button
                            size='large'
                            sx={{ marginTop: 1, color: "#fff", backgroundColor: "#3A4BE0" }}
                            type='submit'
                        >
                            Change password
                        </Button>
                    </form>
                } */}


                <Box sx={{ textAlign: "center", marginTop: "26px" }}>
                    <Link href='/login' underline='hover' color='#000' fontWeight='600'>
                        Back to login
                    </Link>
                </Box>
            </Box>
        </Box >
    )
}

export default Forgot;