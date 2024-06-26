import axiosClient from "./axiosClient";

const noteApi = {
  createNote(idUser, data) {
    const url = `/notes/${idUser}`;
    return axiosClient.post(url, data);
  },
  getNotes(idUser) {
    const url = `/notes/${idUser}`;
    return axiosClient.get(url);
  },
  getLastestNotes() {
    const url = "/notes_public";
    return axiosClient.get(url);
  },
  getPublicNote(id) {
    const url = "/note-share/" + id;
    return axiosClient.get(url);
  },
  delTruncNote(idNote) {
    const url = `/trunc-notes/${idNote}`;
    return axiosClient.delete(url);
  },
  delMoveTrash(idNote) {
    const url = `/notes/${idNote}`;
    return axiosClient.delete(url);
  },
  getTrash(idUser) {
    const url = `/trash/${idUser}`;
    return axiosClient.get(url);
  },
  restoreTrash(idNote) {
    const url = `/trash-res/${idNote}`;
    return axiosClient.post(url);
  },
  editNote(idNote, param) {
    const url = `/notes/${idNote}`;
    return axiosClient.patch(url, param);
  },
  tick(idData) {
    const url = `/tick/${idData}`;
    return axiosClient.patch(url);
  },
  openNote(idNote, data) {
    const url = `/open-note/${idNote}`;
    return axiosClient.post(url, data);
  },
  patch(idNote, data) {
    const url = `/notes/${idNote}`;
    return axiosClient.post(url, data);
  },
  getNumberNote() {
    const url = "/numbernote";
    return axiosClient.get(url, () => {
      setTimeout(30000)
    });
  },
};

export default noteApi;
