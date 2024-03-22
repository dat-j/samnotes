import { useState, useEffect } from "react";
import noteApi from "../../api/noteApi";
import Archived from "../Archived";
import SideBar from "../../components/SideBar";

export default function Explore({ handleDelNote, setArchivedData, toolsNote }) {
  const [notes, setNotes] = useState([]);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [check, setcheck] = useState(false);

  useEffect(() => {
    // noteApi.getLastestNotes().then((lastestNotes) => {
    //   console.log(lastestNotes);
    //   setNotes(lastestNotes.notes);
    // });

    noteApi.getNotes(10).then((res) => {
      setcheck(!check);
      setNotes(res.notes);

      const NotesPined = notes.filter((note, index) => note.pinned == 1 || note.pinned == true);
      setPinnedNotes(NotesPined);
    });
  }, [check]);

  return (
    <>
      <SideBar />
      pinnedNotes && (
      <Archived
        data={pinnedNotes}
        setArchivedData={setArchivedData}
        handleDelNote={handleDelNote}
        toolsNote={{ options: { type: "View" } }}
      />
      )
    </>
  );
}
