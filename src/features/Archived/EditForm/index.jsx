import { KeyboardArrowRight } from "@mui/icons-material";
import { Box, Drawer, IconButton, LinearProgress } from "@mui/material";
import dayjs from "dayjs";
import { DateTime } from "luxon";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import noteApi from "../../../api/noteApi";
import PinnedIcon from "../../../components/CustomIcons/PinnedIcon";
import CheckListBox from "../../../components/FieldNote/CheckListFieldBox";
import TextFieldBox from "../../../components/FieldNote/TextFieldBox";
import ImageFieldBox from "../../../components/FieldNote/ImageFieldBox";
import ToolsNote from "../../../components/ToolsNote";
import "./EditForm.css";
EditForm.propTypes = {
  dataItem: PropTypes.object.isRequired,
  handleDelNote: PropTypes.func.isRequired,
  construct: PropTypes.string.isRequired,
  setArchivedData: PropTypes.func.isRequired,
  full: PropTypes.bool,
};

function getList(list, type) {
  if (type === "text") {
    return list;
  }
  if (type === "checklist") {
    return list.map((item) => ({ ...item, status: !!item.status, id: item.id }));
  }
}

export default function EditForm({
  datas,
  dataItem,
  handleDelNote,
  setArchivedData,
  clear,
  toggleNote,
  limitedData,
}) {
  const [loadedPage, setLoadedPage] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [drawerEdit, setDrawerEdit] = useState(false);
  const [pinned, setPinned] = useState(() => dataItem ? dataItem.pinned : false);
  const [data, setData] = useState(getList(dataItem.data, dataItem.type));
  const [colorNote, setColorNote] = useState(dataItem.color);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [options, setOptions] = useState({
    dueAt: typeof dataItem.dueAt !== "object" ? dayjs(dataItem.dueAt) : dataItem.dueAt,
    remindAt: typeof dataItem.remindAt !== "object" ? dayjs(dataItem.remindAt) : dataItem.remindAt,
    lock: dataItem.lock,
    share: dataItem.share,
    notePublic: dataItem.notePublic,
  });
  //pined
  const handlePined = () => {
    setPinned(!pinned);
    // const currentDateTime = DateTime.now()
    //   .setZone("Asia/Ho_Chi_Minh")
    //   .toLocaleString(DateTime.DATETIME_FULL);
    // setCurrentDateTime(currentDateTime);
    // console.log(currentDateTime);
    pinned == false
      ? enqueueSnackbar("select pinned success", { variant: "success" })
      : enqueueSnackbar("remove pinned success", { variant: "success" });

    noteApi
      .editNote(dataItem.idNote, { ...dataItem, pinned: !pinned, type: dataItem.type })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };
  const handleChangeNote = (color) => {
    setColorNote(color);
  };
  const handleOptionsNote = (param) => {
    setOptions({ ...options, ...param });
  };
  const handleNoteForm = async (value) => {
    const configParam = {
      ...value,
      color: colorNote,
    };
    try {
      setIsSubmitting(true);
      const res = await noteApi.editNote(dataItem.idNote, configParam);
console.log(res);
      setIsSubmitting(false);

      enqueueSnackbar(res.message, { variant: "success" });

      setDrawerEdit(false);
      setArchivedData(dataItem.idNote, res.note);
    } catch (error) {
      setIsSubmitting(false);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  useMemo(() => {
    if (loadedPage) handleNoteForm({ pinned: pinned });
    else setLoadedPage(true);
  }, [pinned]);

  return (
    <Drawer
      variant='persistent'
      className='box-container'
      id='wapperEditNote'
      anchor='right'
      open={drawerEdit}
      sx={{
        position: "relative",
        flexShrink: 0,

        [`& .MuiDrawer-paper`]: {
          display: "block",
          width: "calc(100% - 550px)",
          boxSizing: "border-box",
          height: toggleNote ? 100 + "%" : "calc(100% - 65px)",
          visibility: "visible !important",
          transform: "translateX(0) !important",
          // top: 30 + "px",
          // top: toggleNote ? 220 + "px" : 0,
        },
      }}
    >
      {isSubmitting && <LinearProgress className='pg-load' />}
      <Box sx={{ height: "100%", padding: "10px 10px 0px 10px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <IconButton
            onClick={clear}
            sx={{ position: "absolute", left: "0" }}
            aria-label='close'
            size='medium'
            id="keyboardarrowright"
          >
            <KeyboardArrowRight fontSize='large' />
          </IconButton>

          <img
            style={{
              width: "70px",
            }}
            src='../../../assets/home-icon.png'
            alt='homeicon'
          />
          <span
            style={{
              color: " #6A53CC",
              fontSize: "30px",
              fontWeight: 800,
              marginLeft: "10px",
            }}
          >
            Edit
          </span>
        </Box>
        
        <Box
          className='box-container boxEdit'
          sx={{
            position: "relative",
            // height: "calc((100% - 100px)/2)",
            padding: "10px",
          }}
        >
          <span
            onClick={() => {
              setPinned(!pinned);
            }}
            style={{
              cursor: "pointer",
              position: "absolute",
              top: "10px",
              left: "5px",
            }}
            id="pinnedIcon"
          >
            <PinnedIcon active={Boolean(pinned)} />
          </span>
          {toggleNote === true
            ? limitedData.map((dataItem, index) => {
                if (dataItem) {
                  return (
                    <TextFieldBox
                      className='margin'
                      isSubmitting={isSubmitting}
                      handleNoteForm={handleNoteForm}
                      bg={colorNote || {}}
                      action='Edit'
                      cx={dataItem.data || dataItem.content}
                      tt={dataItem.title}
                      type={"2"}
                      key={index}
                    />
                  );
                } else {
                  return null;
                }
              })
            : null}
          {dataItem.type === "text" && (
            <TextFieldBox
              isSubmitting={isSubmitting}
              handleNoteForm={handleNoteForm}
              bg={colorNote || {}}
              action='Edit'
              cx={dataItem.data || dataItem.content}
              tt={dataItem.title}
              type={"2"}
            />
          )}
          {dataItem.type === "checklist" && (
            <CheckListBox
              isSubmitting={isSubmitting}
              handleNoteForm={handleNoteForm}
              bg={colorNote}
              action='Edit'
              list={data}
              tt={dataItem.title}
              type={"2"}
            />
          )}
          {dataItem.type === "image" && (
            <ImageFieldBox
              isSubmitting={isSubmitting}
              handleNoteForm={handleNoteForm}
              bg={colorNote}
              action='Edit'
              cx={dataItem.data}
              src={dataItem.metaData}
              tt={dataItem.title}
              type={"2"}
            />
          )}
        </Box>
        
        <Box style={{ height: "calc((100% - 50px)/2)", marginTop: "5px" }}>
          <ToolsNote
            type='Edit'
            options={options}
            handleChangeNote={handleChangeNote}
            handleOptionsNote={handleOptionsNote}
            handleDelNote={handleDelNote}
            handleNoteForm={handleNoteForm}
            dataItem={dataItem}
          />
        </Box>
      </Box>
    </Drawer>
  );
}
