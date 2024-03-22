import {
  AddPhotoAlternateOutlined,
  CalendarMonth,
  DeleteOutline,
  Inventory2Outlined,
  ListAltOutlined,
  PeopleOutline,
  Screenshot,
  SettingsOutlined,
  TextSnippetOutlined,
  Visibility,
  VisibilityOff,
  GridView,
  DocumentScannerOutlined,
  AccountCircle,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
} from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PropTypes from "prop-types";
import React, { useState } from "react";
import classes from "./styles.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import userApi from "../../api/userApi";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { checkJWT } from "../../constants";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import HomeIcon from "@mui/icons-material/Home";
import "../../pages/LandingPage/LandingPage.module.scss";
import GuestCreateForm from "../GuestCreateForm";
import classNames from "classnames/bind";
import styles from "../../pages/LandingPage/LandingPage.module.scss";
import { Link } from 'react-router-dom';
SideBar.propTypes = {
  handleOpenDrawer: PropTypes.func.isRequired,
  drawerNew: PropTypes.bool.isRequired,
};

function SideBar({ usergg, handleOpenDrawer, drawerNew }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCreate = (type) => {
    handleClose();
    handleOpenDrawer(type);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const user =
    useSelector((state) => state.user.current) || JSON.parse(localStorage.getItem("user"));

  const [showPassword2, setShowPassword2] = useState(false);
  const [valueLock2, setValueLock2] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const [openLock2, setOpenLock2] = useState(false);
  const handleMouseDownPassword2 = (event) => {
    event.preventDefault();
  };
  const handleClickShowPassword2 = () => {
    setShowPassword2((x) => !x);
  };
  const handleCloseLock2 = () => {
    setOpenLock2(false);
  };
  const handleOkLock2 = async () => {
    try {
      if (checkJWT()) {
        return window.location.assign("/login");
      }
      await userApi.open2(user.id, { password_2: valueLock2 });
      navigate("/about/screenshot");
      setOpenLock2(false);
    } catch (error) {
      enqueueSnackbar("Password 2 not true", { variant: "error" });
    }
  };
  const dark = { color: "#fff" };
  const icons = [
    <HomeIcon style={dark} />,
    <EditCalendarIcon style={dark} />,
    <GridView style={dark} />,
    // <CalendarMonth style={dark} />,
    <Inventory2Outlined style={dark} />,
    <Screenshot style={dark} />,
    <DeleteOutline style={dark} />,
    // <SettingsOutlined style={dark} />,
    <PeopleOutline style={dark} />,
  ];

  const cx = classNames.bind(styles);
  const [modal, setModal] = useState(false);
  const handleNav = (nav) => {
    if (checkJWT()) {
      return window.location.assign("/login");
    }
    // if (pathname.split("/")[2] === nav) return;
    // navigate(`/home/${nav}`);
    if (nav === "create notes") {
      setModal(true);
    }
    if (nav === "about") {
      // Chuyển hướng đến trang màn hình home
      navigate("/");
    } else {
      navigate(`/about/${nav}`);
    }
  };

  const handleProfileClick = (nav) => {
    if (checkJWT()) {
      window.location.assign("/login");
    }
    navigate("/about/profile/");
  };

  const handleSettingsClick = (nav) => {
    if (checkJWT()) {
      window.location.assign("/login");
    }
    navigate("/about/settings/");
  };

  return (
    <div className={classes.sidebar}>
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
          <Button onClick={handleOkLock2}>Open</Button>
        </DialogActions>
      </Dialog>
      <Box className='nav'>
        <List>
          <ListItem sx={{ color: "#fff" }} disablePadding>
            <ListItemButton onClick={handleProfileClick}>
              {user ? (
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "1rem",
                  }}
                  src={
                    user.Avarta ||
                    "https://i.pinimg.com/736x/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.jpg"
                  }
                ></img>
              ) : (
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "1rem",
                  }}
                  src={
                    usergg.picture ||
                    "https://i.pinimg.com/736x/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.jpg"
                  }
                ></img>
              )}

              {user ? (
                <ListItemText
                  className={classes.none}
                  primary={
                    <span style={{ fontWeight: 500, width: "200px", textTransform: "capitalize" }}>
                      {user.name || "user"}
                    </span>
                  }
                />
              ) : (
                <ListItemText
                  className={classes.none}
                  primary={
                    <span style={{ fontWeight: 500, width: "200px", textTransform: "capitalize" }}>
                      {usergg.name || "user"}
                    </span>
                  }
                />
              )}
            </ListItemButton>
            <ListItemIcon className={classes.settingIcon} >
              <ListItemButton onClick={handleSettingsClick}>
              <SettingsOutlined className="max-lg:hidden" sx={{ color: "#fff", fontSize: "30px", marginLeft: "8px" }} />
                </ListItemButton>  
              </ListItemIcon>
          </ListItem>
        </List>
      </Box>
      <div className='btn-new'>
        {/* <Button
          variant='contained'
          onClick={handleClick}
          className={classes.btnNew}
          disabled={drawerNew}
          startIcon={
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M18.0099 8.99L15.0099 5.99M3.49994 20.5C4.32994 21.33 5.66994 21.33 6.49994 20.5L19.4999 7.5C20.3299 6.67 20.3299 5.33 19.4999 4.5C18.6699 3.67 17.3299 3.67 16.4999 4.5L3.49994 17.5C2.66994 18.33 2.66994 19.67 3.49994 20.5Z'
                stroke='white'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M8.5 2.44L10 2L9.56 3.5L10 5L8.5 4.56L7 5L7.44 3.5L7 2L8.5 2.44ZM4.5 8.44L6 8L5.56 9.5L6 11L4.5 10.56L3 11L3.44 9.5L3 8L4.5 8.44ZM19.5 13.44L21 13L20.56 14.5L21 16L19.5 15.56L18 16L18.44 14.5L18 13L19.5 13.44Z'
                stroke='white'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          }
        >
          New
        </Button> */}
        <Menu
          id='new-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={() => handleCreate("text")}>
            <ListItemIcon>
              <TextSnippetOutlined fontSize='small' />
            </ListItemIcon>
            Text
          </MenuItem>
          <MenuItem onClick={() => handleCreate("checklist")}>
            <ListItemIcon>
              <ListAltOutlined fontSize='small' />
            </ListItemIcon>
            Check list
          </MenuItem>
          <MenuItem onClick={() => handleCreate("image")}>
            <ListItemIcon>
              <AddPhotoAlternateOutlined fontSize='small' />
            </ListItemIcon>
            Image
          </MenuItem>
          <MenuItem onClick={() => handleCreate("scan")}>
            <ListItemIcon>
              <DocumentScannerOutlined fontSize='small' />
            </ListItemIcon>
            Scan text
          </MenuItem>
        </Menu>
      </div>

      <Box className='nav' sx={{ marginTop: 4 }}>
        <List>
          {[
            "About",
            "Create notes",
            "Explore",
            // "Calendar",
            "Archived",
            "Screenshot",
            "Deleted",
            // "Settings",
            "Groups",
          ].map((text, index) => (
            <ListItem
              key={text}
              sx={{ color: "white" }}
              disablePadding
              onClick={() => {
                if (text.toLowerCase() === "screenshot") {
                  setOpenLock2(true);
                } else {
                  handleNav(text.toLowerCase());
                }
              }}
            >
              <ListItemButton
                selected={pathname.split("/")[2] === text.toLowerCase() ? true : false}
              >
                <ListItemIcon className={classes.HomeIcon}>{icons[index]}</ListItemIcon>
                <ListItemText
                  className={classes.none}
                  primary={<span style={{ fontWeight: 500 }}>{text}</span>}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      {modal && (
        <div className={cx("modal")}>
          <div className={cx("overlay")} onClick={() => setModal(false)}></div>
          <GuestCreateForm clear={() => setModal(false)} />
        </div>
      )}
      <Box
        className={classes.none}
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 4,
          position: "relative",
        }}
      >
        <img
          style={{ width: "150px", transform: "rotate(15deg)" }}
          src='../../assets/note.png'
          alt='note'
        />
        <span
          style={{
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            fontWeight: "700",
            color: "white",
            fontSize: "16px",
          }}
        >
          Cloud Note
        </span>
      </Box>
    </div>
  );
}

export default SideBar;
