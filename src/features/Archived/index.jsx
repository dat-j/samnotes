import { FormatListBulleted, GridViewOutlined } from "@mui/icons-material";
import { Box, Button, Grid } from "@mui/material";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import NoteImage from "../../components/NoteImage";
import NoteItem from "../../components/NoteItem";
import NoteItemLock from "../../components/NoteItemLock";
import SearchInput from "../../components/SearchInput";
import ListView from "./ListView";
import classes from "./styles.module.css";
import EditForm from "./EditForm";
import { profileUser, updateProfile } from "../Auth/userSlice";
import { useDispatch } from "react-redux";

import FilterListIcon from "@mui/icons-material/FilterList";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { Tab } from "@mui/material";

import { TabContext, TabList, TabPanel } from "@mui/lab";

import React, { useEffect, useState, useRef } from "react";

import LoopIcon from '@mui/icons-material/Loop';
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import DetailsIcon from "@mui/icons-material/Details";
import "./style.scss";
import noteApi from "../../api/noteApi";

Archived.propTypes = {
  data: PropTypes.array.isRequired,
  handleDelNote: PropTypes.func.isRequired,
  setArchivedData: PropTypes.func.isRequired,
};
Archived.defaultProps = {};

function Archived({ data, handleDelNote, setArchivedData, toolsNote, clear }) {
  const [value, setValue] = useState("");
  const [dataFilter, setDataFilter] = useState([]);
  const [construct, setConstruct] = useState("List");
  const { view } = useSelector((state) => state.settings);
  const [selectedNote, setSelectedNote] = useState(null);
  const [drawerEdit, setDrawerEdit] = useState(false);
  const [originalData, setOriginalData] = useState([]);

  const handleSearchItemClick = async (noteId) => {
    let getNote = data.filter((e) => e.idNote === noteId)[0];
    setSelectedNote(getNote);
    // setDrawerEdit((prevState) => true);
  };

  const user =
    useSelector((state) => state.user.current) || JSON.parse(localStorage.getItem("user"));

  const [infoUser, setInfoUser] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const res = await dispatch(profileUser(user.id));
      if (res.payload && res.payload.Avarta) {
        const updatedInfoUser = res.payload;
        setInfoUser(updatedInfoUser);
      }
    })();
  }, []);

  useEffect(() => {
    if (value.trim() === "") {
      setDataFilter(data);
    } else {
      const newData = data.filter((item) => {
        if (item.type === "checklist") {
          for (const x of item.data) {
            return item.title.includes(value) || x.content.includes(value);
          }
        }
        return item.title.includes(value) || item.data.includes(value);
      });
      setDataFilter(newData || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    setDataFilter(data);
  }, [data]);
  const [isTabsOpen, setIsTabsOpen] = useState(false);
  const [tabValue, setTabValue] = useState("1");

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const overlayRef = useRef(null);

  const toggleTabs = () => {
    setIsTabsOpen(!isTabsOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isTabsOpen && overlayRef.current && !overlayRef.current.contains(event.target)) {
        setIsTabsOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isTabsOpen]);
  function getColorObjectFromColorName(colorName) {
    return colorMapping[colorName] || null;
  }
  const [filteredData, setFilteredData] = useState(dataFilter);

  const [sortByLatest, setSortByLatest] = useState(true);
  // console.log(filteredData);

  const handleOverlayClick = (event) => {
    const isInsideTabContext = event.target.closest(".tabbb");
    const isInsideTabPanel = event.target.closest(".MuiTabPanel-root");
    if (!isInsideTabContext && !isInsideTabPanel) {
      setIsTabsOpen(false);
    }
    const selectedColorElement = event.target.closest(".color");

    if (selectedColorElement) {
      const colorName = selectedColorElement.classList[1];
      const clickedColor = getColorObjectFromColorName(colorName);
      const filteredData = filterDataByColor(clickedColor);
      console.log("danh sach loc:", filteredData);

      setFilteredData(filteredData);

      setIsTabsOpen(false); // Đóng menu khi chọn màu
    }
  };
  const colorMapping = {
    pink: { r: 255, g: 125, b: 125, a: 0.87 },
    orange: { r: 255, g: 188, b: 125, a: 0.87 },
    green1: { r: 211, g: 226, b: 140, a: 1 },
    green2: { r: 211, g: 239, b: 130, a: 1 },
    green3: { r: 165, g: 239, b: 130, a: 1 },
    green4: { r: 130, g: 239, b: 187, a: 1 },
    green5: { r: 143, g: 210, b: 239, a: 0.87 },
    purple: { r: 130, g: 147, b: 239, a: 1 },
  };
  const compareColors = (color1, color2) => {
    return (
      color1.r === color2.r &&
      color1.g === color2.g &&
      color1.b === color2.b &&
      color1.a === color2.a
    );
  };
  const filterDataByColor = (clickedColor) => {
    if (!clickedColor) {
      console.log(1);
      return dataFilter; // Trả về danh sách ban đầu nếu không có màu được chọn
    }
    return dataFilter.filter((item) => {
      return compareColors(item.color, clickedColor);
    }); // Lọc danh sách theo màu
  };

  const handleSortByLatest = () => {
    const sortedData = [...dataFilter]
      .slice(-50)
      .sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
    setFilteredData(sortedData);
    console.log(filteredData);
    setIsTabsOpen(false);
  };
  const handleSortByOldest = () => {
    const sortedData = [...dataFilter]
      .slice(0, 50)
      .sort((a, b) => new Date(a.createAt) - new Date(b.createAt));
    console.log(sortedData.reverse());
    setFilteredData(sortedData.reverse());
    setIsTabsOpen(false); //
  };
  const [sortAscending, setSortAscending] = useState(true);
  const handleSortByAlphabetically = () => {
    const dataToSort = [...filteredData];

    const sortedData = dataToSort.sort((a, b) => {
      if (sortAscending) {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

    setFilteredData(sortedData);

    setIsTabsOpen(false);
    setSortAscending(!sortAscending);
  };
  const handleToggleView = (newView) => {
    setIsTabsOpen(false); // Đóng menu khi chọn chế độ

    if (newView === "Grid" && construct !== "Grid") {
      setConstruct("Grid");
    } else if (newView === "List" && construct !== "List") {
      setConstruct("List");
    }
  };

  const sortedAndFilteredData = filteredData.length > 0
    ? filteredData.slice(-50).sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
    : dataFilter.slice(-50).sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
  // console.log(dataFilter);
  const handleRefresh = () => {
    handleSortByLatest();
  };

  return (
    <div className={'w-[calc(100vw-250px)] ml-[250px] max-lg:w-[calc(100vw-210px)] h-[90dvh] max-lg:ml-[210px]'}>
      <div className='flex justify-between h-[50px] items-center'>
        {selectedNote && (
          <EditForm
            dataItem={selectedNote}
            handleDelNote={handleDelNote}
            setArchivedData={setArchivedData}
            construct='List'
            clear={() => {
              setSelectedNote(null);
            }}
            selectedNote={selectedNote}
          />
        )}

        <div className='w-full h-full flex gap-3 pl-2 items-center'>
          <button className='text-white bg-slate-700 h-9 rounded-lg hover:shadow-lg flex gap-2 items-center px-2 py-1 font-semibold text-lg text-nowrap'
            onClick={(e) => {
              e.stopPropagation();
              toggleTabs();
            }}
          >
            {
              construct === "Sort By" ? (
                <FilterListIcon
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleTabs();
                  }}
                />
              ) : (
                <FilterListIcon />
              )
            }
            Sort By
          </button>
          <button
            className={'text-white bg-slate-700 h-9 rounded-lg hover:shadow-lg flex items-center px-2 py-1 font-semibold text-lg text-nowrap'}
            onClick={handleRefresh}
          >
            {construct === "Refresh" ? <LoopIcon /> : <LoopIcon />}
          </button>
          {isTabsOpen && (
            <div className='overlay' ref={overlayRef} onClick={handleOverlayClick}>
              <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    className='tabbb'
                    onChange={handleChange}
                    aria-label='lab API tabs example'
                    centered
                  >
                    <Tab label='Color' value='1' />
                    <Tab label='SORT' value='2' />
                    <Tab label='View' value='3' />
                  </TabList>
                </Box>
                <Box className='bb'>
                  <TabPanel className='flex-color' value='1'>
                    <div className='color pink'></div>
                    <div className='color orange'></div>
                    <div className='color green1'></div>
                    <div className='color green2'></div>
                    <div className='color green3'></div>
                    <div className='color green4'></div>
                    <div className='color green5'></div>
                    <div className='color purple'></div>
                  </TabPanel>



                  <TabPanel className="nn" value="2">
                    <div className="custom-tab" onClick={handleSortByLatest}><AccessTimeIcon /> By lastest record</div>
                    <div className="custom-tab" onClick={handleSortByOldest}><MoreTimeIcon /> By oldest record</div>
                    {/* <div className="custom-tab" onClick={handleSortByAlphabetically}><SortByAlphaIcon/> By alphabetically</div> */}
                    {/* <div className="custom-tab"><NotificationsActiveIcon/> By reminder time</div> */}
                  </TabPanel>
                  <TabPanel className="nn" value="3">
                    <div className="custom-tab" onClick={() => handleToggleView("List")}><FormatListNumberedRtlIcon /> List</div>
                    <div className="custom-tab" onClick={() => handleToggleView("Grid")}><GridViewOutlined /> Grid</div>

                  </TabPanel>

                </Box>
              </TabContext>
            </div>
          )}
        </div>
        <SearchInput setValue={setValue} onSearchItemClick={handleSearchItemClick} />
      </div>
      {/* end header */}

      {view === "Side" && construct === "List" ? (
        <ListView
          data={sortedAndFilteredData}
          setArchivedData={setArchivedData}
          handleDelNote={handleDelNote}
          toolsNote={toolsNote}
          clear={clear}
        />
      ) : (
        <div
          className={classNames({
            [classes.feature]: true,
            "box-container": true,
          })}
        >
          <Grid
            className={classes.grid}
            container
            sx={{
              "&>.MuiGrid-item": {
                width: "100%",
              },
            }}
            spacing={{ xs: 1, sm: 2, md: 2, lg: 2 }}
          >
            {sortedAndFilteredData.map((item) => (
              <>

                {item.type !== "screenshot" && (
                  <Grid
                    key={item.idNote}
                    item
                    xs={24}
                    sm={12}
                    md={4}
                    lg={construct === "Grid" ? 3 : 4}
                  >
                    {item.lock ? (
                      <>
                        {item?.flag === true ? (
                          <>
                            {item.type === "image" ? (
                              <NoteImage
                                construct={construct}
                                dataItem={item}
                                setArchivedData={setArchivedData}
                                handleDelNote={handleDelNote}
                              />
                            ) : (
                              <NoteItem
                                construct={construct}
                                dataItem={item}
                                setArchivedData={setArchivedData}
                                handleDelNote={handleDelNote}
                              />
                            )}
                          </>
                        ) : (
                          <NoteItemLock
                            construct={construct}
                            handle={setArchivedData}
                            dataItem={item}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        {item.type === "image" ? (
                          <NoteImage
                            construct={construct}
                            dataItem={item}
                            setArchivedData={setArchivedData}
                            handleDelNote={handleDelNote}
                          />
                        ) : (
                          <NoteItem
                            construct={construct}
                            dataItem={item}
                            setArchivedData={setArchivedData}
                            handleDelNote={handleDelNote}
                          />
                        )}
                      </>
                    )}
                  </Grid>
                )}
              </>
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
}

export default Archived;
