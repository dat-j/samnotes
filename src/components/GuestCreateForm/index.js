import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useDebounce from "../../customHook/useDebounce";

import axios from "axios";
import noteApi from "../../api/noteApi";

import Tesseract from "tesseract.js";
import { convertColor } from "../../constants";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ShareIcon from "@mui/icons-material/Share";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  InputAdornment,
  Input,
} from "@mui/material";

import dayjs from "dayjs";
import { colorBucket } from "../../constants/color_bucket";
import { useSnackbar } from "notistack";
import { DateTimePicker } from "@mui/x-date-pickers";

import classNames from "classnames/bind";
import styles from "./GuestCreateForm.module.scss";
const cx = classNames.bind(styles);

export default function GuestCreateForm({ clear }) {
  const [showTypes, setShowTypes] = useState(false);

  // params for craeting note
  const user = useSelector((state) => state.user.current);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("text");
  const [color, setColor] = useState("color_1");
  const [data, setData] = useState("");
  const [metaData, setMetaData] = useState("");
  const [idFolder, setIdFolder] = useState("1")
  const [linkNoteShare, setLinkNoteShare] = useState("")

  const [dueAt, setDueAt] = useState(null);
  const [reminder, setReminder] = useState(null);
  const [lock, setLock] = useState(null);
  const [share, setShare] = useState(null);
  const [pinned, setPinned] = useState(false);

  // handle Lock Dialog
  const [showPassword, setShowPassword] = useState(false);
  const [openLock, setOpenLock] = useState(false);
  const [valueLock, setValueLock] = useState(lock);
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
      setLock(valueLock);
    } else {
      setLock(null);
    }
  };
  const handleRemoveLock = () => {
    setOpenLock(false);
    setValueLock("");
    setLock(null);
  };
  //

  const { enqueueSnackbar } = useSnackbar();
  const [shareLink, setShareLink] = useState('');
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [error, setError] = useState('');
  const [isNoteCreated, setIsNoteCreated] = useState(false);

  const createNote = async () => {
    let params = {
      color: colorBucket[color],
      data,
      dueAt:
        typeof dueAt === "object" && dueAt ? dayjs(dueAt).format("DD/MM/YYYY hh:mm A Z") : dueAt,
      remindAt:
        typeof reminder === "object" && reminder
          ? dayjs(reminder).format("DD/MM/YYYY hh:mm A Z")
          : reminder,
      lock,
      notePublic: 1,
      pinned,
      share,
      title,
      type,
      idFolder,
      linkNoteShare
    };

    console.log("param: ", params)
    if (type === "image") params = { ...params, metaData };

    try {
      const res = await noteApi.createNote(user.id, params);
      console.log("this is createNote:", user.id)
      const noteId = res.note.idNote;
      const shareLink = `https://samnote.mangasocial.online/note/${noteId}`
      setShareLink(shareLink);
      enqueueSnackbar("Note was created successfully", { variant: "success" });
      setIsNoteCreated(true);
    } catch (err) {
      console.log(err)
      console.log("message: ", err.message)
      setError(`Failed to create note: ${err.message}. Please try again.`);
      enqueueSnackbar(`Error ${err.message}`);

    }
  };


  const handleShare = async () => {
    if (isNoteCreated) {
      try {

        setIsSharePopupOpen(true);
        setError('');

      } catch (err) {
        setError('Failed to create note. Please try again.');
        enqueueSnackbar(err.message, { variant: "error" });
        console.log(err)
      }
    }
  };

  const closeSharePopup = () => {
    setIsSharePopupOpen(false);
  }

  const copyToClipboard = (text) => {
    if (isNoteCreated) {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      enqueueSnackbar('Link copied to clipboard', { variant: 'success' });
    }
  };

  const imageUpload = async (e) => {
    const files = e.target.files;
    const formData = new FormData();
    let imgbb = {};
    if (files.length !== 0) {
      formData.append("image", files[0]);

      imgbb = await axios.post(
        "https://api.imgbb.com/1/upload?key=a07b4b5e0548a50248aecfb194645bac",
        formData
      );
    }
    const url = imgbb?.data.data.url || null;
    setMetaData(url);
  };

  return (
    <div
      className={cx("wrapper")}
      style={{
        backgroundColor: `rgba(${colorBucket[color].r},${colorBucket[color].g},${colorBucket[color].b},${colorBucket[color].a})`,
      }}
    >
      <div className={cx("overlay")}></div>
      <div className={cx("close-btn")} onClick={clear}>
        &times;
      </div>
      <div className={cx("type")}>
        <div className={cx("title")} onClick={() => setShowTypes((sh) => !sh)}>
          {type[0].toUpperCase()}
          {type.slice(1)}
        </div>
        <div className={cx("type-items")}>
          {showTypes &&
            ["Text", "Checklist", "Image", "Scan"].map((item, index) => (
              <div
                className={cx("item", { chosen: type === item.toLowerCase() })}
                key={index}
                onClick={() => {
                  setType(item.toLowerCase());
                  setShowTypes(false);
                  setData(null);
                }}
              >
                {item}
              </div>
            ))}
        </div>
      </div>
      <div className={cx("title")}>
        <input
          type='text'
          tabIndex={1}
          placeholder="Note's title"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className={cx("content")}>
        {(type === "text" || type === "image") && (
          <textarea
            name=''
            tabIndex={2}
            placeholder='Type note here!'
            rows={10}
            onChange={(e) => setData(e.target.value)}
          ></textarea>
        )}
        {type === "image" && (
          <>
            <label htmlFor='inputfile'>
              {metaData ? <img src={metaData} alt='' /> : "Select image here"}
            </label>
            <input type='file' id='inputfile' onChange={imageUpload} hidden />
          </>
        )}
        {type === "checklist" && (
          <div className={cx("items")}>
            <Checklist updateData={(checklist) => setData(checklist)} />
          </div>
        )}
        {type === "scan" && <Scan content={data} setContent={setData} setUrl={setMetaData} />}
      </div>
      <button tabIndex={3} onClick={createNote}>
        Create
      </button>

      <div className={cx("options")}>
        <div className={cx("colors")}>
          {Object.keys(colorBucket).map((key, index) => {
            const { r, g, b, a } = colorBucket[key];
            return (
              <div
                className={cx("color", { selected: color === key })}
                style={{ "--bgc": `rgba(${r},${g},${b},${a})` }}
                onClick={() => setColor(key)}
                key={index}
              ></div>
            );
          })}
        </div>
        <div className={cx("others")}>
          <div className={cx("item", { show: reminder })}>
            <div className={cx("icon")}>
              <NotificationsActiveIcon />
            </div>
            <div className={cx("name")}>Reminder</div>
            <div className={cx("picker")}>
              <DateTimePicker
                sx={{
                  backgroundColor: "#fff",
                }}
                views={["year", "month", "day", "hours", "minutes", "seconds"]}
                label='Reminder'
                value={reminder}
                onChange={(newValue) => setReminder(newValue)}
              />
            </div>
            {reminder && (
              <div className={cx("clear-btn")} onClick={() => setReminder(null)}>
                &times;
              </div>
            )}
          </div>
          <div
            className={cx("item")}
            onClick={handleShare}
          >
            <div className={cx("icon")}>
              <ShareIcon />
            </div>
            <div className={cx("name")}>Share</div>
          </div>

          {isSharePopupOpen && (
            <div className={cx('popup-wrapper')}>
              <div className={cx('share-link')}>{shareLink}</div>
              <Button
                style={{ marginRight: '10px', padding: '5px 10px', fontSize: '14px', borderRadius: '20px', color: '#000', backgroundColor: '#aaf', height: '40px' }}
                classname={cx('copy-link')}
                onClick={() => copyToClipboard(shareLink)}>
                copy
              </Button>
              <Button
                style={{ marginRight: '10px', padding: '5px 10px', fontSize: '14px', borderRadius: '20px', color: '#000', backgroundColor: '#aaf', height: '40px' }}
                onClick={closeSharePopup}>Close</Button>
            </div>
          )}

          <div className={cx("item")} onClick={() => setOpenLock(true)}>
            <div className={cx("icon")}>
              <LockIcon />
            </div>
            <div className={cx("name")}>Lock</div>
          </div>
          <div className={cx("item", { show: dueAt })}>
            <div className={cx("icon")}>
              <CalendarMonthIcon />
            </div>
            <div className={cx("name")}>Due at</div>
            <div className={cx("picker")}>
              <DateTimePicker
                sx={{
                  backgroundColor: "#fff",
                }}
                views={["year", "month", "day", "hours", "minutes", "seconds"]}
                label='Due at'
                value={dueAt}
                onChange={(newValue) => setDueAt(newValue)}
              />
            </div>
            {dueAt && (
              <div className={cx("clear-btn")} onClick={() => setDueAt(null)}>
                &times;
              </div>
            )}
          </div>
          <div className={cx("item")}>
            <div className={cx("icon")}>
              <PublicIcon />
            </div>
            <div className={cx("name")}>Public</div>
          </div>
        </div>
      </div>
      <Dialog
        open={openLock}
        onClose={handleCloseLock}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <DialogContent>
          <DialogContentText>
            To protect your notes, lock them carefully. <b>Notice:</b> We have not yet provided any
            method to recover your password when you forget it. Thanks
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
    </div>
  );
}

function Checklist({ updateData }) {
  const [list, setList] = useState([]);
  useEffect(() => {
    updateData(list);
  }, [list]);

  const addEmptyItem = () => {
    setList([...list, { content: "", status: false }]);
  };
  const updateText = (value, index) => {
    const newList = [...list];
    newList[index].content = value;
    setList(newList);
  };
  const updateStatus = (index) => {
    const newList = [...list];
    newList[index].status = !newList[index].status;
    setList(newList);
  };
  const removeItem = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  return (
    <div className={cx("checklist")}>
      {list.length > 0 &&
        list.map((item, index) => {
          return (
            <div className={cx("item")} key={index}>
              <input type='checkbox' checked={item.status} onChange={() => updateStatus(index)} />
              <input
                type='text'
                onChange={(e) => {
                  updateText(e.target.value, index);
                }}
              />
              <div className={cx("remove")} onClick={() => removeItem(index)}>
                &times;
              </div>
            </div>
          );
        })}
      <div className={cx("create-btn")} onClick={addEmptyItem}>
        + Add task
      </div>
    </div>
  );
}

function Scan({ content, setContent, setUrl }) {
  // scan control
  const [scanBy, setScanBy] = useState("file");
  const [scanLanguage, setScanLanguage] = useState("vie");
  const [fileUrl, setFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileUrlDebounce = useDebounce(fileUrl, 500) || null;
  const { enqueueSnackbar } = useSnackbar();

  const imgRef = useRef(null);
  const handleChangeContent = (e) => {
    const val = e.target.value;
    setContent(val);
  };
  useEffect(() => {
    if (!fileUrlDebounce) return;
    setIsLoading(true);

    Tesseract.recognize(`${fileUrlDebounce}`, scanLanguage)
      .then((res) => {
        const {
          data: { text },
        } = res;
        setContent(text);
        setIsLoading(false);
      })
      .catch((err) => enqueueSnackbar(err.message));
  }, [fileUrlDebounce, scanLanguage]);

  return (
    <Box
      sx={{
        padding: "7px",
        borderRadius: "5px",
        boxShadow:
          " 0px 0px 1px rgba(3, 4, 4, 0.5), 0px 8px 12px rgba(3, 4, 4, 0.36), inset 0px 0px 0px 1px rgba(188, 214, 240, 0.04)",
        marginTop: "10px",
      }}
    >
      <Box>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <FormControl>
            <InputLabel id='demo-simple-select-label'>File type</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={scanBy}
              label='Scan with'
              onChange={(e) => {
                setScanBy(e.target.value);
              }}
            >
              <MenuItem value={"file"}>Image file</MenuItem>
              <MenuItem value={"url"}>Image url</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id='demo-simple-select-label'>Language</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={scanLanguage}
              label='Scan with'
              onChange={(e) => {
                setScanLanguage(e.target.value);
              }}
            >
              <MenuItem value={"vie"}>Vietnamese</MenuItem>
              <MenuItem value={"eng"}>English</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {scanBy === "file" ? (
          <Button
            // startIcon={<Add />}
            // onClick={handleUpload}
            variant='outlined'
            sx={{ marginTop: "20px" }}
          >
            <label htmlFor='upload-photo'>Select Image</label>
            <input
              style={{ display: "none" }}
              id='upload-photo'
              name='upload-photo'
              type='file'
              accept='image/*'
              onChange={async (e) => {
                const file = e.target.files[0];
                setFileUrl(URL.createObjectURL(file));
                const imgbb = await axios.post(
                  "https://api.imgbb.com/1/upload?key=a07b4b5e0548a50248aecfb194645bac"
                );
                const url = imgbb?.data.data.url || null;
                setUrl(url);
              }}
              ref={imgRef}
            />
          </Button>
        ) : (
          <TextField
            id='content-textarea'
            fullWidth
            label=''
            value={fileUrl}
            onChange={(e) => {
              setFileUrl(e.target.value);
              setUrl(e.target.value);
            }}
            placeholder='Paste Your Image Url Here!'
            multiline
            variant='standard'
            spellCheck='off'
            sx={{
              paddingTop: "20px",
              overflowY: "scroll",
              "&>textarea": {
                height: "100%",
              },
            }}
          />
        )}
      </Box>
      {isLoading ? (
        "loading..."
      ) : (
        <Box className='note-content'>
          <TextField
            id='content-textarea'
            fullWidth
            label=''
            value={content}
            onChange={handleChangeContent}
            placeholder={"Your note will come here! Don't change it"}
            multiline
            variant='standard'
            spellCheck='off'
            sx={{
              paddingTop: "20px",
              minHeight: "80vh",
              overflowY: "scroll",
              "&>textarea": {
                height: "100%",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}