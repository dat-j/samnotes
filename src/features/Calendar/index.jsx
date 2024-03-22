import React from "react";
import { useState } from "react";
import { Box, selectClasses } from "@mui/material";
import { Badge, Calendar } from "antd";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { checkJWT, convertColor } from "../../constants";
import EditForm from "../Archived/EditForm";
import ListView from "../Archived/ListView/index";
import Archived from "../Archived";
import "./style.css";
Calendar.propTypes = {
  data: PropTypes.array,
};
Calendar.defaultProps = {
  data: [],
};

const getListData = (value, data) => {
  const rs = [];

  data.forEach((ele) => {
    if (dayjs(value).format("DD/MM/YYYY") === dayjs(ele.createAt).format("DD/MM/YYYY")) {
      rs.push({ color: convertColor(ele.color), content: ele.title });
    }
  });

  return rs;
};

const getMonthData = (value, data) => {
  let count = 0;
  data.forEach((ele) => {
    if (dayjs(value).format("MM/YYYY") === dayjs(ele.createAt).format("MM/YYYY")) {
      count++;
    }
  });
  return (
    count !== 0 && {
      node: (
        <Badge
          className='site-badge-count-109'
          count={count ? count : 0}
          style={{
            backgroundColor: "transparent",
            marginRight: "7px",
          }}
        />
      ),
      count: count,
    }
  );
};

function CalendarTable({ data, handleDelNote, setArchivedData, toolsNote }) {

  const [toggleNote, setToggleNote] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [limitedData, setLimitedData] = useState([]);

  const handleNote = () => {
    setToggleNote(!toggleNote);
  };
  
  const handleDateClick = (value) => {
    const selectedDate = dayjs(value).format("DD/MM/YYYY");
    // if(checkJWT()) {
      
    // }
    const eventsInSelectedDate = data.filter(
      (event) => dayjs(event.createAt).format("DD/MM/YYYY") === selectedDate
    );  
    if(eventsInSelectedDate.length !== 0) {
      setSelectedDateEvents(eventsInSelectedDate);
      setSelectedEvent(eventsInSelectedDate);      
    }
    else {
      setSelectedDateEvents(null);
      setSelectedEvent(null); 
    }

  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    // handleNote();
  };
  const cellRender = (value) => {
    const num = getMonthData(value, data);
    const listData = getListData(value, data);
    return (
      <ul className='events'>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge color={item.color} text={item.content} onClick={() => handleEventClick(item)} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Box
      className='box-container  '
      sx={{
        width: "calc(100vw - 251px)",
        height: "calc(100vh - 65px)",
        position: "absolute",
        top: 0,
        right: 0,
        padding: "10px",
        background: "white",
        borderLeft: "1px solid #fcfcfc",
        overflow: "hidden auto",
        zIndex: 10,
        "& *:not(.basic-text)": {
          fontWeight: "600 !important",
        },
      }}
    >
      {/* <Calendar cellRender={cellRender}/> */}
      <Box>
        <Calendar cellRender={cellRender} onSelect={handleDateClick} />
        {toggleNote === true && (
          <ListView
            limitedData={limitedData}
            toggleNote={toggleNote}
            data={selectedDateEvents}
            setArchivedData={setArchivedData}
            handleDelNote={handleDelNote}
            toolsNote={toolsNote}
          />
        )}
        {selectedEvent && (
          <Archived
            data={selectedEvent}
            handleDelNote={handleDelNote}
            setArchivedData={setArchivedData}
            construct='List'
            clear={() => {
              setSelectedEvent(null);
            }}
            // Các props khác của Archive
          />
        )}
      </Box>
    </Box>
  );
}

export default CalendarTable;

// import React from "react";
// import { useState } from "react";
// import { Box } from "@mui/material";
// import { Badge, Calendar } from "antd";
// import PropTypes from "prop-types";
// import dayjs from "dayjs";
// import { convertColor } from "../../constants";
// import EditForm from "../Archived/EditForm";
// import ListView from "../Archived/ListView/index";

// // import "./style.css"
// Calendar.propTypes = {
//     data: PropTypes.array,
// };
// Calendar.defaultProps = {
//     data: [],
// };

// const getListData = (value, data) => {
//     const rs = [];

//     data.forEach((ele) => {
//         if (dayjs(value).format("DD/MM/YYYY") === dayjs(ele.createAt).format("DD/MM/YYYY")) {
//             rs.push({ color: convertColor(ele.color), content: ele.title });
//         }
//     });

//     return rs;

// };

// const getMonthData = (value, data) => {
//     let count = 0;
//     data.forEach((ele) => {
//         if (dayjs(value).format("MM/YYYY") === dayjs(ele.createAt).format("MM/YYYY")) {
//             count++;
//         }
//     });
//     return (
//         count !== 0 && {
//             node: (
//                 <Badge
//                     className='site-badge-count-109'
//                     count={count ? count : 0}
//                     style={{
//                         backgroundColor: "transparent",
//                         marginRight: "7px",
//                     }}
//                 />
//             ),
//             count: count,
//         }
//     );
// };

// function CalendarTable({ data ,handleDelNote, setArchivedData,toolsNote}) {
//      const [toggleNote, setToggleNote] = useState(false);
// const handleNote = () => {
//   setToggleNote(!toggleNote);
// };
// const [limitedData, setLimitedData] = useState([]);
//     const [drawerEdit, setDrawerEdit] = useState(false);
//     const [selectedNote, setSelectedNote] = useState(null);
//     const cellRender = (value) => {
//         const num = getMonthData(value, data);
//         const listData = getListData(value, data);
//           return (
//             <ul className='events'>
//               {listData.map((item,index) => (
//                 <li key={index}>
//                   <Badge color={item.color} text={item.content} onClick={handleNote}/>
//                 </li>
//               ))}
//             </ul>
//           );
//         };
//     const handleEditClick = (item) => {
//         console.log(11);
//         setSelectedNote(item);
//         setDrawerEdit(true);
//     }
//     return (
//         <Box
//             className={`box-container  ${drawerEdit ? "edit-mode" : ""}`}
//             sx={{
//                 width: "calc(100vw - 251px)",
//                 height: "calc(100vh - 65px)",
//                 position: "absolute",
//                 top: 0,
//                 right: 0,
//                 padding: "10px",
//                 background: "white",
//                 borderLeft: "1px solid #fcfcfc",
//                 overflow: "hidden auto",
//                 zIndex: 10,
//                 "& *:not(.basic-text)": {
//                     fontWeight: "600 !important",
//                 },
//             }}
//         >
//             <Calendar cellRender={cellRender}/>
//             {toggleNote === true && (
//             <ListView
//               limitedData={limitedData}
//               toggleNote={toggleNote}
//               data={data}
//               setArchivedData={setArchivedData}
//               handleDelNote={handleDelNote}
//               toolsNote={toolsNote}
//             />)}
//             {/* {drawerEdit && selectedNote && (
//                     <EditForm
//                         dataItem={selectedNote}
//                         handleDelNote={handleDelNote}
//                         setArchivedData={setArchivedData}
//                         construct="List"
//                         clear={() => {
//                             setSelectedNote(null);
//                             setDrawerEdit(false);
//                         }}
//                     // Các props khác của EditForm
//                     />
//                 )} */}
//         </Box>
//     );
// }

// export default CalendarTable;
