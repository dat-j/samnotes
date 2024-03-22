import axiosClient from "./axiosClient";
const userApi = {
  register(data) {
    const url = `/register`;
    return axiosClient.post(url, data);
  },
  login(data) {
    const url = "/login";
    return axiosClient.post(url, data);
  },
  refreshToken() {
    return axiosClient.post("/refesh-token");
  },
  update(data, id) {
    const url = "/user/" + id;
    return axiosClient.patch(url, data);
  },
  delete(id, data) {
    const url = "/user/" + id;
    return axiosClient.post(url, data);
  },
  getAll(id) {
    const url = "/allUsers/" + id;
    return axiosClient.get(url);
  },
  lock2(id, data) {
    const url = "/create-pass-2/" + id;
    return axiosClient.post(url, data);
  },
  open2(id, data) {
    const url = "/open-pass-2/" + id;
    return axiosClient.post(url, data);
  },
  getNewUsers() {
    const url = "/lastUser";
    return axiosClient.get(url);
  },
  getSearchUsers(param) {
    const url = `/profiles_search/user?key=${param}`;
    return axiosClient.get(url);
  },
  profile(id) {
    const url = "/profile/" + id;
    return axiosClient.get(url);
  },
  search(key) {
    const url = "/notes_search?key=" + key;
    return axiosClient.get(url);
  },
  userOnline() {
    const url = "/login";
    return axiosClient.get(url);
  },

  updateProfile(userId, data) {
    const url = `/profile/change_Profile/${userId}`;
    return axiosClient.patch(url, data);
  },

  getMessage(id) {
    const url = `/message/chat-unknown/${id}`;
    return axiosClient.get(url);
  },
  changePassword(id, payload) {
    const url = `/login/change_password/${id}`;
    return axiosClient.post(url, payload);
  },
  resetPassword(payload) {
    const url = `/resetPasswork`;
    return axiosClient.options(url, payload);
  },
  logout(id){
    const url=`/logout/${id}`;
    return axiosClient.post(url)
  }
};

export default userApi;
