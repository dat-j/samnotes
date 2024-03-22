import { Button, Typography, TextField, Box, Stack } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import classes from "./style.module.css";
import CheckIcon from "@mui/icons-material/Check";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
const Message = ({ togle, listUserOnline }) => {
  const [toogleOption, setToogleOption] = useState(false);
  const handle_option = () => {
    setToogleOption(!toogleOption);
  };
  return (
    <Box
      className={`${togle === true ? classes.display : classes.display_false} ${classes.boxMess}`}
      sx={{
        border: 1 + "px",
        borderColor: "#DADADA",
        borderStyle: "solid",
        borderRadius: 12 + "px",
        width: 450 + "px",
        // display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        position: "absolute",
        right: 10,
        zIndex: 1500,
      }}
    >
      <Box
        sx={{
          padding: 10 + "px",
        }}
      >
        <Typography
          style={{
            marginLeft: 15 + "px",
            marginTop: 15 + "px",
            marginBottom: 15 + "px",
            fontWeight: 600,
          }}
          variant='h5'
        >
          Messager
        </Typography>
        <input
          className={classes.inputMessage}
          style={{
            width: 90 + "%",
            height: 50 + "px",
            marginBottom: 5 + "px",
            marginLeft: 10 + "px",
            backgroundColor: "#DADADA",
            border: "none",
            paddingLeft: 5 + "px",
          }}
          label='Tìm kiếm'
          placeholder='Tìm kiếm'
          type='text'
        ></input>
      </Box>
      <hr
        style={{
          backgroundColor: "#DADADA",
          height: 3 + "px",
          border: "none",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: 10 + "px",
          paddingRight: 10 + "px",
          paddingTop: 5 + "px",
          paddingBottom: 5 + "px",
        }}
      >
        <Box
          mt={2}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            padding: 5 + "px",
            "&:hover": {
              backgroundColor: "#ddd",
              borderRadius: 12 + "px",
            },
          }}
        >
          <img
            style={{
              width: 50 + "px",
              height: 50 + "px",
            }}
            src={`${process.env.PUBLIC_URL + "/assets/andanh.png"}`}
            alt=''
          />
          <Link to={"/anonymous"}>
            <Box ml={1} sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                style={{
                  fontSize: 17 + "px",
                  fontWeight: 600,
                }}
                variant='h5'
              >
                Anonymous
              </Typography>
              <p
                className={classes.none}
                style={{
                  fontSize: 16 + "px",
                }}
              >
                You received a messenger from a anomymous one
              </p>
            </Box>
          </Link>
          <Button
            style={{ display: "block", position: "relative" }}
            onClick={handle_option}
            startIcon={<MoreHorizIcon />}
          ></Button>
        </Box>

        <hr
          style={{
            backgroundColor: "#DADADA",
            height: 3 + "px",
            width: 105 + "%",
            border: "none",
            marginTop: 15 + "px",
          }}
        />

        <Typography
          style={{
            marginTop: 10 + "px",
            marginBottom: 10 + "px",
            textAlign: "center",
            cursor: "pointer",
          }}
          variant='h6'
        >
          See all at messenger
        </Typography>
      </Box>
      <Stack
        className={togle === true && toogleOption ? classes.display : classes.display_false}
        style={{
          maxWidth: 200 + "px",
          position: "absolute",
          bottom: -30,
          right: 30,
          backgroundColor: "#fff",
          border: 1 + "px",
          borderColor: "#DADADA",
          borderStyle: "solid",
          borderRadius: 12 + "px",
          padding: 5 + "px",
          zIndex: 12,
        }}
      >
        <Stack
          className='option_message'
          style={{
            cursor: "pointer",
            padding: 5 + "px",
            "&:hover": { backgroundColor: "#DADADA", borderRadius: 12 + "px" },
          }}
          direction='row'
          spacing={0.5}
        >
          <CheckIcon />
          <Link to={"/anonymous"}>
            <Typography>Accept & Reply</Typography>
          </Link>
        </Stack>
        <Stack
          style={{
            cursor: "pointer",
            padding: 5 + "px",
            "&:hover": { backgroundColor: "#DADADA", borderRadius: 12 + "px" },
          }}
          direction='row'
          spacing={0.5}
        >
          <NotificationImportantIcon />
          <Typography>Refuse messenger</Typography>
        </Stack>
        <Stack
          style={{
            cursor: "pointer",
            padding: 5 + "px",
            "&:hover": { backgroundColor: "#DADADA", borderRadius: 12 + "px" },
          }}
          direction='row'
          spacing={0.5}
        >
          <RestoreFromTrashIcon />
          <Typography>Delete</Typography>
        </Stack>
      </Stack>
    </Box>
  );
};
export default Message;
