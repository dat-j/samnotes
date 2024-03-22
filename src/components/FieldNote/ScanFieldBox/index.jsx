import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Tesseract from "tesseract.js";
import axios from "axios";

import {
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { convertColor } from "../../../constants";
import useDebounce from "../../../customHook/useDebounce";

ScanFieldBox.propTypes = {
  bg: PropTypes.object.isRequired,
  handleNoteForm: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  cx: PropTypes.string,
  tt: PropTypes.string,
  action: PropTypes.string.isRequired,
};
ScanFieldBox.defaultProps = {};

function ScanFieldBox({ bg, handleNoteForm, isSubmitting, cx = "", tt = "", action, type }) {
  const [scanBy, setScanBy] = useState("file");
  const [scanLanguage, setScanLanguage] = useState("vie");
  const [fileUrl, setFileUrl] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(tt);
  const [content, setContent] = useState(cx);
  const { enqueueSnackbar } = useSnackbar();

  const handleChangeContent = (e) => {
    const val = e.target.value;
    setContent(val);
  };
  const handleChangeTitle = (e) => {
    const val = e.target.value;
    setTitle(val);
  };

  const cxDebounce = useDebounce(content, 500) || cx;
  const ttDebounce = useDebounce(title, 500) || tt;
  const fileUrlDebounce = useDebounce(fileUrl, 500) || null;

  const handleSubmit = () => {
    if (ttDebounce.trim() === "" || cxDebounce.trim() === "") {
      enqueueSnackbar("Please fill in note!", { variant: "error" });
      return;
    }
    const note = {
      title: ttDebounce,
      color: bg,
      type: "text",
      data: cxDebounce,
      metaData: url,
    };
    if (action === "Create") {
      setTitle("");
      setContent("");
    }
    handleNoteForm(note);
  };

  useEffect(() => {
    if (action !== "Edit") return;
    if (cxDebounce === cx && ttDebounce === tt) return;
    handleSubmit();
  }, [cxDebounce, ttDebounce, action]);

  const imgRef = useRef(null);
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
        backgroundColor: `${convertColor(bg)}`,
        padding: "7px",
        borderRadius: "5px",
        boxShadow:
          " 0px 0px 1px rgba(3, 4, 4, 0.5), 0px 8px 12px rgba(3, 4, 4, 0.36), inset 0px 0px 0px 1px rgba(188, 214, 240, 0.04)",
        marginTop: "10px",
        width: type === "scan" ? "calc(100vw - 300px)" : "100%",
        minHeight: "200px",
      }}
    >
      <Box className='note-title'>
        <TextField
          fullWidth
          id='text-title'
          label=''
          value={title}
          onChange={handleChangeTitle}
          placeholder="Note's Title"
          variant='standard'
          autoComplete='off'
        />
        <Button
          disabled={isSubmitting}
          onClick={handleSubmit}
          variant='text'
          className='note-create'
          sx={{ color: "black" }}
        >
          {action}
        </Button>
      </Box>
      <Box>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <FormControl>
            <InputLabel id='demo-simple-select-label'>Age</InputLabel>
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

export default ScanFieldBox;