import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";

import { CalendarMonth, DeleteOutline, Lock, Public, Share, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  styled,
  tooltipClasses,
  DialogTitle,
  TextField
} from "@mui/material";

import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { colorBucket } from "../../constants";

import ColorBox from "../ColorBox";
import RemindIcon from "../CustomIcons/RemindIcon";
import { useSnackbar } from "notistack";

import noteApi from "../../api/noteApi";
import { useNavigate , useParams} from "react-router-dom";
import { enqueueSnackbar } from "notistack";

import "./ToolNote.css";

ToolsNote.propTypes = {
  handleChangeNote: PropTypes.func.isRequired,
  handleOptionsNote: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
};

const configColorBox = { width: "24px", height: "24px", borderRadius: "50%", cursor: "pointer" };
const TransparentTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "transparent",
  },
}));
function ToolsNote({
  handleNoteForm,
  handleChangeNote,
  handleDelNote,
  handleOptionsNote,
  options,
  dataItem,
  type = "none",
}) {
  const [popDate, setPopDate] = useState(false);
  const [popRemind, setPopRemind] = useState(false);
  const [dueAt, setDueAt] = useState(options.dueAt);
  const [remindAt, setRemindAt] = useState(options.remindAt);
  const [openLock, setOpenLock] = useState(false);
  const [valueLock, setValueLock] = useState(options.lock);
  const [notePublic, setNotePublic] = useState(options.notePublic);
  // const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [noteData, setNoteData] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const clipboard = (e) => {
    if (dataItem && dataItem.idNote) {
      navigator.clipboard.writeText("http://samnote.mangasocial.online/note/" + dataItem.idNote);
      enqueueSnackbar("Copied to Clipboard", { variant: "success" });
      handleClose();
    } else {
      console.log('err idNote')
    }
  };

  // useEffect(() => {
  //   setDueAt(options.dueAt && dayjs(options.dueAt));
  //   setRemindAt(options.remindAt && dayjs(options.remindAt));
  //   setValueLock(options.lock);
  // }, [options.dueAt, options.remindAt, options.lock]);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowPassword = () => {
    setShowPassword((x) => !x);
  };
  const handleCloseLock = () => {
    setOpenLock(false);
  };

  const handleOkLock = () => {
    setOpenLock(false);
    if (valueLock.length > 0) {
      handleOptionsNote({ lock: valueLock });
    } else {
      handleOptionsNote({ lock: null });
    }
  };
  const handleRemoveLock = () => {
    setOpenLock(false);
    setValueLock("");
    handleOptionsNote({ lock: null });
  };
  const handleClickDate = () => {
    setPopDate(true);
  };
  const handleClickRemind = () => {
    setPopRemind(true);
  };
 
  const warningAlert = () => {
    enqueueSnackbar("Sharing is currently unavailable. Try it in the next update", {
      variant: "warning",
    });
  };
  // Gọi hàm updateNote để gửi yêu cầu cập nhật lên API
  const handleUpdateNote = async () => {
    const data = {
      ...options,
      dueAt:
        typeof dueAt === "object" && dueAt
          ? dayjs(dueAt).format("DD/MM/YYYY hh:mm A Z")
          : dueAt,
      remindAt:
        typeof remindAt === "object" && remindAt
          ? dayjs(remindAt).format("DD/MM/YYYY hh:mm A Z")
          : remindAt,
      notePublic: notePublic,
    };
    try {
      const res = await noteApi.editNote(dataItem.idNote, data);
      console.log(res.note)
      enqueueSnackbar("Note updated successfully", { variant: "success" });
      // navigate("/home");
      // window.location.reload();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  // useEffect(() => {
  //   if (isPublic) {
  //     const fetchPublicNote = async () => {
  //       try {
  //         const response = await noteApi.getPublicNote(noteId);
  //         setNoteData(response.data.Note); 
  //       } catch (error) {
  //         console.error("Error fetching public note:", error);
  //       }
  //     };
  //     fetchPublicNote();
  //   } else {
  //     setNoteData(null); 
  //   }
  // }, [isPublic]);

  const handleNotePublic = async () => {
    try {
      const newNotePublic = notePublic === 0 ? 1 : 0;
      setNotePublic(newNotePublic);
      const response = await noteApi.editNote(dataItem.idNote, { notePublic: newNotePublic });
      if (response && response.note) {
        console.log("notePublic trong response:", response.note.notePublic);
        const updatedNotePublic = response.note.notePublic;
        setNotePublic(updatedNotePublic);
        enqueueSnackbar("Note public status updated successfully", { variant: "success" });
      } else {
        enqueueSnackbar("Failed to update note public status", { variant: "error" });
      }
    } catch (error) {
      console.error("Error updating note public status:", error);
      enqueueSnackbar("Error updating note public status", { variant: "error" });
    }
  };
  
  
  return (
    <div
      className={"box-tool"}
      style={{
        background: "#EAF5F7",
        height: "100%",
        borderRadius: "15px 10px",
        padding: "5px",
      }}
    >
      <Box
        sx={{
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ColorBox handleClick={handleChangeNote} color={colorBucket.color_1} sx={configColorBox} />
        <ColorBox handleClick={handleChangeNote} color={colorBucket.color_2} sx={configColorBox} />
        <ColorBox handleClick={handleChangeNote} color={colorBucket.color_3} sx={configColorBox} />
        <ColorBox handleClick={handleChangeNote} color={colorBucket.color_4} sx={configColorBox} />
        <ColorBox handleClick={handleChangeNote} color={colorBucket.color_5} sx={configColorBox} />
        <ColorBox handleClick={handleChangeNote} color={colorBucket.color_6} sx={configColorBox} />
        <ColorBox handleClick={handleChangeNote} color={colorBucket.color_7} sx={configColorBox} />
        <ColorBox handleClick={handleChangeNote} color={colorBucket.color_8} sx={configColorBox} />
      </Box>
      <List
        className='dislayToolNote'
        sx={{
          overflow: "hidden auto",
          height: "calc(100% - 44px)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <ListItem>
          {remindAt ? (
            <TransparentTooltip
              sx={{
                "& 	.MuiTooltip-popper": {
                  background: "transparent",
                },
              }}
              title={
                <Button
                  onClick={() => {
                    handleOptionsNote({
                      remindAt: null,
                    });
                    setRemindAt(null);
                  }}
                  size='medium'
                  variant='elevated'
                  sx={{
                    color: "black",
                    textTransform: "capitalize",
                    borderRadius: "10px",
                    borderColor: "black",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    backgroundColor: "white",
                    "&:hover": { borderColor: "black", background: "white" },
                  }}
                >
                  Remove Reminder
                </Button>
              }
              placement='top'
            >
              <ListItemButton
                sx={{
                  borderRadius: "10px",
                  "& .Mui-selected": {
                    borderRadius: "10px",
                  },
                }}
                selected={popRemind || Boolean(remindAt)}
                onClick={handleClickRemind}
                className='btn-calendar'
              >
                <ListItemIcon>
                  <RemindIcon />
                </ListItemIcon>
                <ListItemText primary='Reminder' />
              </ListItemButton>
            </TransparentTooltip>
          ) : (
            <ListItemButton
              sx={{
                borderRadius: "10px",
                "& .Mui-selected": {
                  borderRadius: "10px",
                },
              }}
              selected={popRemind || Boolean(remindAt)}
              onClick={handleClickRemind}
              className='btn-calendar'
            >
              <ListItemIcon>
                <RemindIcon />
              </ListItemIcon>
              <ListItemText primary='Reminder' />
            </ListItemButton>
          )}
              <DateTimePicker
                open={popRemind}
                minDateTime={dayjs().set('hour', new Date().getHours() ).set('minute', new Date().getMinutes() + 30).startOf("minute")}
                onAccept={() => {
                  setPopRemind(false);
                  handleOptionsNote({
                    remindAt: remindAt ? dayjs(remindAt).format("DD/MM/YYYY hh:mm A Z") : null,
                  });
                }}
                format="DD/MM/YYYY hh:mm A"
                onClose={() => {
                  setPopRemind(false);
                }}
                value={dayjs(remindAt)}

                sx={{
                  "& .MuiInputBase-input": {
                    padding: "0 !important",
                    border: "none",
                    outline: "none",
                  },
                  "& fieldset": {
                    border: "none",
                  },
                  "& *": {
                    cursor: "pointer",
                  },
                  cursor: "pointer",
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  right: "15px",
                }}
                onChange={(newValue) => {
                  if(( new Date(new Date().getTime() + (30 * 60)) ) < new Date(dayjs(newValue))) setRemindAt(newValue);
                }}
              />

        </ListItem>
        <ListItem>
          <ListItemButton
            sx={{
              borderRadius: "10px",
              "& .Mui-selected": {
                borderRadius: "10px",
              },
            }}
            variant='contained'
            onClick={handleClickOpen}
            // onClick={() => {
            //   shareNoteId(dataItem.idNote);
            // }}
          >
            <ListItemIcon>
              <Share />
            </ListItemIcon>
            <ListItemText primary='Share' />
          </ListItemButton>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Share</DialogTitle>
            <DialogContent>
              <TextField
                id='name'
                type='text'
                fullWidth
                variant='standard'
                disabled
                value={"http://samnote.mangasocial.online/note/" + (dataItem && dataItem.idNote)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={clipboard}> COPY URL</Button>
            </DialogActions>
          </Dialog>
        </ListItem>
        <ListItem>
          <ListItemButton
            selected={Boolean(valueLock)}
            sx={{
              borderRadius: "10px",
              "& .Mui-selected": {
                borderRadius: "10px",
              },
            }}
            onClick={() => setOpenLock(true)}
          >
            <ListItemIcon>
              <Lock />
            </ListItemIcon>
            <ListItemText primary='Lock' />
          </ListItemButton>
          <Dialog open={openLock} onClose={handleCloseLock}>
            <DialogContent>
              <DialogContentText>
                To protect your notes, lock them carefully. <b>Notice:</b> We have not yet provided
                any method to recover your password when you forget it. Thanks
              </DialogContentText>
              <FormControl fullWidth sx={{ marginTop: "10px" }} variant='standard'>
                <InputLabel htmlFor='lock-password'>Lock by password</InputLabel>
                <Input
                  id='lock-password'
                  type={showPassword ? "text" : "password"}
                  value={valueLock || ""}
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
              <Button onClick={handleRemoveLock}>Remove</Button>
              <Button onClick={handleCloseLock}>Cancel</Button>
              <Button onClick={handleOkLock}>Ok</Button>
            </DialogActions>
          </Dialog>
        </ListItem>
        <ListItem sx={{ position: "relative" }}>
          {dueAt ? (
            <TransparentTooltip
              title={
                <Button
                  onClick={() => {
                    handleOptionsNote({
                      dueAt: null,
                    });
                    setDueAt(null);
                  }}
                  size='medium'
                  sx={{
                    color: "black",
                    textTransform: "capitalize",
                    borderRadius: "10px",
                    borderColor: "black",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    backgroundColor: "white",
                    "&:hover": { borderColor: "black", background: "white" },
                  }}
                  variant='elevated'
                >
                  Remove Due at
                </Button>
              }
              placement='top'
            >
              <ListItemButton
                selected={popDate || Boolean(dueAt)}
                onClick={handleClickDate}
                className='btn-calendar'
                sx={{
                  borderRadius: "10px",
                  "& .Mui-selected": {
                    borderRadius: "10px",
                  },
                }}
              >
                <ListItemIcon>
                  <CalendarMonth />
                </ListItemIcon>

                <ListItemText primary='Due at' />
              </ListItemButton>
            </TransparentTooltip>
          ) : (
            <ListItemButton
              selected={popDate || Boolean(dueAt)}
              onClick={handleClickDate}
              className='btn-calendar'
              sx={{
                borderRadius: "10px",
                "& .Mui-selected": {
                  borderRadius: "10px",
                },
              }}
            >
              <ListItemIcon>
                <CalendarMonth />
              </ListItemIcon>
              <ListItemText primary='Due at' />
            </ListItemButton>
          )}

          <DateTimePicker
            open={popDate}
            minDateTime={dayjs().set('hour', new Date().getHours()).set('minute', new Date().getMinutes()).startOf("minute")}
            onAccept={() => {
              setPopDate(false);
              handleOptionsNote({
                dueAt: dueAt ? dayjs(dueAt).format("DD/MM/YYYY hh:mm A Z") : null,
              });
            }}
            format={dueAt ? "DD/MM/YYYY hh:mm A" : ""}
            onClose={() => {
              setPopDate(false);
            }}
            value={dayjs(dueAt)}
            sx={{
              "& .MuiInputBase-input": {
                padding: "0 !important",
                border: "none",
                outline: "none",
              },
              "& fieldset": {
                border: "none",
              },
              "& *": {
                cursor: "pointer",
              },
              cursor: "pointer",
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              right: "15px",
            }}
            onChange={(newValue) => {
              if( new Date()  < new Date(dayjs(newValue))) setDueAt(newValue);
            }}
          />
        </ListItem>

        <ListItem>
          <ListItemButton
            sx={{
              borderRadius: "10px",
              "& .Mui-selected": {
                borderRadius: "10px",
              },
            }}
            onClick={handleNotePublic}
          >
            <ListItemIcon>{notePublic ? <Public /> : <Lock />}</ListItemIcon>
            <ListItemText primary={notePublic ? "Public" : "Private"} />
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton
            sx={{
              borderRadius: "10px",
              "& .Mui-selected": {
                borderRadius: "10px",
              },
            }}
            onClick={() => {handleDelNote(dataItem.idNote, "move")}}
          >
            <ListItemIcon>{<DeleteOutline />}</ListItemIcon>
            <ListItemText primary={"Delete"} />
          </ListItemButton>
        </ListItem>

        <ListItem>
          <Button sx={{ marginLeft: "20px" }} variant='contained' onClick={() => {
            handleNoteForm({      
              ...options,
              dueAt:
                typeof dueAt === "object" && dueAt
                  ? dayjs(dueAt).format("DD/MM/YYYY hh:mm A Z")
                  : dueAt,
              remindAt:
                typeof remindAt === "object" && remindAt
                  ? dayjs(remindAt).format("DD/MM/YYYY hh:mm A Z")
                  : remindAt,
              notePublic: notePublic
            });
          }}>
            Update Note
          </Button>
        </ListItem>
      </List>
    </div>
  );
}

export default ToolsNote;
