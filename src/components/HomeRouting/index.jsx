import { Routes, Route, Navigate, Router } from "react-router-dom";
import { checkJWT } from "../../constants";
import {
  Archived,
  CalendarTable,
  Deleted,
  Setting,
  Explore,
  Screenshot,
  Groups,
} from "../../features";
import Profile from "../../features/Profile";

export default function HomeRouting(props) {
  const {
    usergg,
    data,
    df_nav,
    setDf_nav,
    dataTrash,
    setColorNote,
    setUser,
    options,
    handleEdit,
    handleChangeNote,
    handleDelNote,
    handleEditTrash,
    handleInTrash,
    handleOptionsNote,
  } = props;

  return (
    <Routes>
      <Route path='/' element={<Navigate to={`/about/archived`} />} />

      <Route path='/profile' element={<Profile usergg={usergg} data={data} />} />

      <Route path='/calendar' element={<CalendarTable data={data} />} />
      <Route
        path='/archived'
        element={
          <Archived
            data={data}
            setArchivedData={handleEdit}
            handleDelNote={handleDelNote}
            toolsNote={{
              options: options,
              handleChangeNote: handleChangeNote,
              handleOptionsNote: handleOptionsNote,
            }}
          />
        }
      />
      <Route
        path='/screenshot'
        element={
          <Screenshot data={data} setArchivedData={handleEdit} handleDelNote={handleDelNote} />
        }
      />
      <Route
        path='/deleted'
        element={
          <Deleted data={dataTrash} handleInTrash={handleInTrash} setTrashData={handleEditTrash} />
        }
      />
      <Route
        path='/settings'
        element={
          <Setting
            usergg={usergg}
            setDf_nav={setDf_nav}
            setColorNote={setColorNote}
            setUser={setUser}
          />
        }
      />
      <Route path='/groups' element={<Groups />} />
    </Routes>
  );
}
