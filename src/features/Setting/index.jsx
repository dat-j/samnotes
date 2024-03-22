import { LoginOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import classNames from "classnames";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userApi from "../../api/userApi";
import BoxDoubleContent from "../../components/BoxDoubleContent";
import ColorBox from "../../components/ColorBox";
import CheckIcon from "../../components/CustomIcons/CheckIcon";
import { colorBucket } from "../../constants";
import { Update, logOut } from "../Auth/userSlice";
import classes from "./styles.module.css";
import { Image } from "antd";
import { profileUser, updateProfile } from "../Auth/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../Auth/userSlice";
import StorageKeys from "../../constants/storage-keys";
import { checkJWT } from "../../constants";
import { logoutUser } from "../Auth/userSlice";
Settings.propTypes = {
  setDf_nav: PropTypes.func.isRequired,
  setColorNote: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

const configColorBox = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  margin: "0 auto",
  border: "1px solid black",
};
function diff(color, otherColor) {
  if (color.r || undefined !== otherColor.r) {
    return false;
  }
  if (color.g !== otherColor.g) {
    return false;
  }
  if (color.b !== otherColor.b) {
    return false;
  }
  return true;
}

function Settings({ usergg, setDf_nav, setColorNote, setUser }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const user =
    useSelector((state) => state.user.current) || JSON.parse(localStorage.getItem("user"));
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const [selectedAvatarProfile, setSelectedAvatarProfile] = useState(null);

  const [screen, setScreen] = useState(user.df_screen);

  const [color, setColor] = useState(() => {
    for (const key in colorBucket) {
      if (diff(colorBucket[key], user.df_color)) {
        return key;
      }
    }
  });

  const handleLogOut = async () => {
    try {
    //   const action = logOut();
    //   await dispatch(action);

    //   // enqueueSnackbar("You will log out after 1s", { variant: "success" });
    //   // setTimeout(() => {
    //   //   // window.location.reload(true);
    //   //   window.location.assign("/");
    //   // }, 1000);
    // } catch {
    //   enqueueSnackbar("error", { variant: "error" });
    // }
   const a= await dispatch(logoutUser());
   console.log(a);

     enqueueSnackbar("You will log out after 1s", { variant: "success" });
      setTimeout(() => {
        // window.location.reload(true);
        window.location.assign("/");
      }, 1000);
    } catch {
      enqueueSnackbar("error", { variant: "error" });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [valueLock, setValueLock] = useState("");
  const [openLock, setOpenLock] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [valueLock2, setValueLock2] = useState("");
  const [openLock2, setOpenLock2] = useState(false);
  const [valueChangePass, setValueChangePass] = useState("");
  const [valueChangePassNew, setValueChangePassNew] = useState("");
  const [toogleLable, setToogleLable] = useState(false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowPassword = () => {
    setShowPassword((x) => !x);
  };
  const handleCloseLock = () => {
    setOpenLock(false);
  };
  const handleMouseDownPassword2 = (event) => {
    event.preventDefault();
  };
  const handleClickShowPassword2 = () => {
    setShowPassword2((x) => !x);
  };
  const handleCloseLock2 = () => {
    setOpenLock2(false);
  };
  const handleCreateP2 = () => {
    setOpenLock2(true);
  };
  const handleEditP2 = () => {
    return;
  };

  async function uploadToImgBB(imageData) {
    const apiKey = "75a856b5b33ad8e19d09ffe21758a1cf";

    const formData = new FormData();
    formData.append("image", imageData);

    const response = await fetch("https://api.imgbb.com/1/upload?key=" + apiKey, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data && data.data && data.data.url) {
      return data.data.url;
    } else {
      throw new Error("Failed to upload image to ImgBB");
    }
  }
  const [editedName, setEditedName] = useState(user.name || usergg.name);

  const handleEditProfile = async () => {
    if (checkJWT()) {
      return window.location.assign("/login");
    }
    const updatedData = {};
    const formData = new FormData();
    formData.append("Avarta", selectedAvatar);
    formData.append("AvtProfile", selectedAvatarProfile);

    if (selectedAvatarProfile) {
      const imgUrl = await uploadToImgBB(selectedAvatarProfile);
      updatedData.AvtProfile = imgUrl;
    }
    if (selectedAvatar) {
      const imgUrl2 = await uploadToImgBB(selectedAvatar);
      updatedData.Avarta = imgUrl2;
    }
    if (editedName) {
      updatedData.name = editedName;
    }
    if (Object.keys(updatedData).length === 0) {
      // Không có trường nào được cập nhật
      return;
    }
    const dataToUpdate = {
      userId: user.id,
      ...updatedData,
    };
    console.log(updatedData);

    console.log("dataToUpdate", dataToUpdate);
    const response = await dispatch(updateProfile(dataToUpdate));

    console.log(response);
    if (response) {
      localStorage.setItem(StorageKeys.USER, JSON.stringify(response.payload));
      console.log("Updated user profile:", response.payload);
      dispatch(updateUser(response.payload));
      console.log(response.payload);
      enqueueSnackbar("Profile update success", { variant: "success" });
    } else {
      console.log("sai");
      enqueueSnackbar("Profile update failed ", { variant: "error" });
    }
  };
  const handleChangeAvt = () => {
    const inputFile = document.getElementById("input-file-avt");
    inputFile.click();
  };
  const handleFileChangeAvt = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedAvatar(file);
    }
  };

  const handleChangeAvtProfile = () => {
    const inputFileAvatar = document.getElementById("input-file-avtprofile");
    inputFileAvatar.click();
  };
  const handleFileChangeAvtProfile = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedAvatarProfile(file);
    }
  };

  const handleOkLock2 = async () => {
    try {
      const res = await userApi.lock2(user.id, { password_2: valueLock2 });
      enqueueSnackbar("Create password 2 successfully", { variant: "success" });
      dispatch(Update({ password_2: res.password_2 }));
      setUser({ ...user, password_2: res.password_2 });
      setOpenLock2(false);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };
  const handleOkLock = async () => {
    try {
      await userApi.delete(user.id, { password: valueLock });
      handleLogOut();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };
  const CustomMenuScreen = () => (
    <FormControl className='stand-select' variant='standard' sx={{ m: 1, minWidth: 80 }}>
      <Select
        id='screen-select'
        value={screen ? screen.toLowerCase() : ""}
        onChange={handleChangeScreen}
        autoWidth
      >
        <MenuItem value={"calendar"}>Calendar</MenuItem>
        <MenuItem value={"archived"}>Archived</MenuItem>
        <MenuItem value={"deleted"}>Deleted</MenuItem>
        <MenuItem value={"settings"}>Settings</MenuItem>
      </Select>
    </FormControl>
  );

  <BoxDoubleContent
    content_1={<span style={{ fontWeight: 600 }}>Gmail:</span>}
    content_2={user.gmail}
  />;
  const handleChangeScreen = async (e) => {
    setScreen(e.target.value);
    try {
      await userApi.update({ screen: e.target.value }, user.id);
      dispatch(Update({ df_screen: e.target.value }));
      setDf_nav(e.target.value);
      setUser({ ...user, df_screen: e.target.value });
    } catch (error) {
      console.log(error);
    }
  };
  const handleChangeColor = async (e) => {
    setColor(e.target.value);
    try {
      await userApi.update({ color: colorBucket[e.target.value] }, user.id);
      dispatch(Update({ df_color: colorBucket[e.target.value] }));
      setColorNote(colorBucket[e.target.value]);
      setUser({ ...user, df_color: colorBucket[e.target.value] });
    } catch (error) {
      console.log(error);
    }
  };
  ///hanlde changer pass
  const handleChangePassword = () => {
    const inputChangePassword = document.querySelector(".inputChangePassword");
    const editChangePassword = document.querySelector(".editChangePassword");
    editChangePassword.style.display = "none";
    inputChangePassword.style.display = "block";
  };
  useEffect(() => {}, [valueChangePass]);
  const handleCofimPassword = () => {
    userApi
      .changePassword(user.id, {
        ...user,
        password: valueChangePass,
        new_password: valueChangePassNew,
      })
      .then((data) => {
        if (data == "password is not correct") {
          return enqueueSnackbar("xác nhận không thành công vui lòng nhập lại mật khẩu", {
            variant: "error",
          });
        }
        enqueueSnackbar("xác nhận thành công vui lòng check email or spam", {
          variant: "success",
        });
        setToogleLable(!toogleLable);
        console.log(data);
      })
      .catch((e) => {
        enqueueSnackbar("xác nhận không thành công vui lòng nhập lại mật khẩu", {
          variant: "error",
        });
      });
  };
  return (
    <div
      className={classNames({
        [classes.root]: true,
        "box-container": true,
      })}
    >
      <Button
        onClick={handleLogOut}
        variant='text'
        endIcon={<LoginOutlined />}
        sx={{ position: "absolute", right: "10px", top: "10px" }}
      >
        Log out
      </Button>
      <Dialog open={openLock} onClose={handleCloseLock}>
        <DialogContent>
          <FormControl fullWidth sx={{ marginTop: "10px" }} variant='standard'>
            <InputLabel htmlFor='lock-password'>Password</InputLabel>
            <Input
              autoFocus
              id='lock-password'
              type={showPassword ? "text" : "password"}
              value={valueLock}
              onChange={(e) => setValueLock(e.target.value)}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLock}>Cancel</Button>
          <Button onClick={handleOkLock}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openLock2} onClose={handleCloseLock2}>
        <DialogContent>
          <FormControl fullWidth sx={{ marginTop: "10px" }} variant='standard'>
            <InputLabel htmlFor='lock-password'>Password 2</InputLabel>
            <Input
              autoFocus
              id='lock-password'
              type={showPassword2 ? "text" : "password"}
              value={valueLock2}
              onChange={(e) => setValueLock2(e.target.value)}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword2}
                    onMouseDown={handleMouseDownPassword2}
                  >
                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLock2}>Cancel</Button>
          <Button onClick={handleOkLock2}>Save</Button>
        </DialogActions>
      </Dialog>
      <Grid
        container
        className={classes.grid}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 2, lg: 2 }}
      >
        <Grid item xs={24} sm={12} md={6} lg={6}>
          <Box sx={{ mb: 3 }}>
            <span className={classes.mainText}>Account</span>
            <BoxDoubleContent
              content_1={<span style={{ fontWeight: 600 }}>Avatar:</span>}
              content_2={
                <div className='avt'>
                  {selectedAvatar ? (
                    <Image
                      style={{ borderRadius: "50%" }}
                      width={50}
                      height={50}
                      src={
                        URL.createObjectURL(selectedAvatar) ||
                        usergg.Avarta ||
                        "https://i.pinimg.com/736x/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.jpg"
                      }
                      alt='Selected Avatar'
                    />
                  ) : (
                    <Image
                      style={{ borderRadius: "50%" }}
                      width={50}
                      height={50}
                      src={user.Avarta}
                      alt='Selected Avatar'
                    />
                  )}

                  <Button onClick={handleChangeAvt}>Choose</Button>
                  <input
                    type='file'
                    id='input-file-avt'
                    style={{ display: "none" }}
                    onChange={handleFileChangeAvt}
                  />
                </div>
              }
            />
            <BoxDoubleContent
              content_1={<span style={{ fontWeight: 600 }}>Name:</span>}
              // content_2={infoUser.name}
              content_2={
                <TextField
                  id='outlined-basic'
                  variant='outlined'
                  value={editedName || usergg.name}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              }
            />
            <BoxDoubleContent
              content_1={<span style={{ fontWeight: 600 }}>Cover image:</span>}
              content_2={
                <div className='avt'>
                  {selectedAvatarProfile ? (
                    <Image
                      style={{ borderRadius: "50%" }}
                      width={50}
                      height={50}
                      src={
                        URL.createObjectURL(selectedAvatarProfile) ||
                        usergg.AvtProfile ||
                        "https://i.pinimg.com/736x/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.jpg"
                      }
                      alt='Selected Avatar'
                    />
                  ) : (
                    <Image
                      style={{ borderRadius: "50%" }}
                      width={50}
                      height={50}
                      src={user.AvtProfile}
                      alt='Selected Avatar'
                    />
                  )}

                  <Button onClick={handleChangeAvtProfile}>Choose</Button>
                  <input
                    type='file'
                    id='input-file-avtprofile'
                    style={{ display: "none" }}
                    onChange={handleFileChangeAvtProfile}
                  />
                </div>
              }
            />
            <BoxDoubleContent
              content_1={<span style={{ fontWeight: 600 }}>Gmail:</span>}
              content_2={usergg.email || user.gmail}
            />
            <BoxDoubleContent
              content_1={<span style={{ fontWeight: 600 }}>PassWord Change:</span>}
              content_2={
                <div>
                  <div className='editChangePassword' style={{}} onClick={handleChangePassword}>
                    ****** <Button onClick={handleEditP2}>Edit</Button>
                  </div>
                  <div
                    className='inputChangePassword'
                    style={{ display: "none" }}
                    onClick={handleChangePassword}
                  >
                    <TextField
                      label={"xác nhận mật khẩu cũ"}
                      value={valueChangePass}
                      onChange={(e) => setValueChangePass(e.target.value)}
                    ></TextField>

                    <TextField
                      label={"nhập mật khẩu mới"}
                      value={valueChangePassNew}
                      onChange={(e) => setValueChangePassNew(e.target.value)}
                    ></TextField>
                    <Button onClick={handleCofimPassword}>Xác Nhận</Button>
                  </div>
                </div>
              }
            />
            <BoxDoubleContent
              content_1={<span style={{ fontWeight: 600 }}>Password 2:</span>}
              content_2={
                user?.password_2 ? (
                  <div>
                    ****** <Button onClick={handleEditP2}>Edit</Button>
                  </div>
                ) : (
                  <>
                    <Button onClick={handleCreateP2}>Create</Button>
                  </>
                )
              }
              customHeight='30px'
            />
            <BoxDoubleContent
              content_1={
                <Button
                  variant='contained'
                  onClick={handleEditProfile}
                  size='small'
                  sx={{ marginTop: "15px" }}
                >
                  Update Profile
                </Button>
              }
              // content_2={
              //   <Button
              //     variant='contained'
              //     onClick={() => {
              //       setOpenLock(true);
              //     }}
              //     size='small'
              //     sx={{ marginTop: "15px" }}
              //   >
              //     Delete Account
              //   </Button>
              // }
            />
          </Box>
          <Divider variant='middle' sx={{ maxWidth: "500px", minWidth: "300px" }} />

          <Box sx={{ mt: 3, mb: 3 }}>
            <span className={classes.mainText}>General</span>
            <BoxDoubleContent
              content_1={<span style={{ fontWeight: 600 }}>Default screen:</span>}
              content_2={<CustomMenuScreen />}
              customHeight='40px'
            />
            <BoxDoubleContent
              content_1={<span style={{ fontWeight: 600 }}>Default color:</span>}
              // content_2={<CustomMenuColor />}
              customHeight='40px'
            />
          </Box>
          <Divider variant='middle' sx={{ maxWidth: "500px", minWidth: "300px" }} />
          <Box sx={{ mt: 3 }}>
            <span className={classes.mainText}>Online Sync & Backup</span>
            <BoxDoubleContent
              content_1={<span style={{ fontWeight: 600 }}>Sync on lauch:</span>}
              content_2={<CheckIcon />}
              customHeight='30px'
            />
            <BoxDoubleContent
              content_1={<span style={{ fontWeight: 600 }}>Auto backup:</span>}
              content_2={<CheckIcon />}
              customHeight='30px'
            />
          </Box>
        </Grid>
        <Grid item xs={24} sm={12} md={6} lg={6}></Grid>
      </Grid>
    </div>
  );
}

export default Settings;
