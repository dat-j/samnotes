import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";
import StorageKeys from "../../constants/storage-keys.js";
export const register = createAsyncThunk("user/register", async (payload) => {
  await userApi.register(payload);

  //save local storages
});
export const login = createAsyncThunk("user/login", async (payload) => {
  console.log(payload);

  return { ...payload.user, jwt: payload.jwt };
});

//@kitsuneremi
// payload {gmail, password, new_password}, dùng typescript thì đỡ cực hơn mấy khoản này ;~;
export const updatePassword = createAsyncThunk("user/changePassword", async (payload) => {
  const data = await userApi.changePassword(payload);
  return { ...data.user };
});

//@kitsuneremi
/**
 * @param {Object} payload - Accepts payload {gmail: string}
 */
export const resetPassword = createAsyncThunk("user/resetPassword", async (payload) => {
  const data = await userApi.resetPassword(payload);
  return { data };
});

export const profileUser = createAsyncThunk("profileUser", async (userId) => {
  const data = await userApi.profile(userId);

  localStorage.setItem(StorageKeys.USER, JSON.stringify(data.user));

  return { ...data.user };
});
export const updateProfile = createAsyncThunk("user/updateProfile", async (payload) => {
  const { userId, Avarta, name, AvtProfile } = payload;
  console.log(payload);
  // Gọi API để cập nhật thông tin user
  const updatedData = await userApi.updateProfile(userId, { Avarta, name, AvtProfile });
  console.log(updatedData);
  const user = JSON.parse(localStorage.getItem(StorageKeys.USER)) || {};
  try {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem(StorageKeys.USER, JSON.stringify(updatedUser));
    console.log("Dữ liệu đã được cập nhật và lưu vào local storage.", updatedUser);
  } catch (error) {
    console.error("Lỗi khi cập nhật và lưu dữ liệu vào local storage:", error);
  }

  return updatedData;
});
export const refresh = createAsyncThunk("user/refresh", async () => {
  const rs = await userApi.refresh();

  //save local storages
  localStorage.setItem(StorageKeys.TOKEN, rs.access_token);

  return rs.access_token;
});
export const logoutUser = createAsyncThunk("user/logout", async (_, { getState }) => {
  try {
    const userId = getState().user.current.id;
    console.log(userId);
    const a = await userApi.logout(userId); // Gọi API logout
    console.log(a);
    localStorage.removeItem(StorageKeys.USER);
    localStorage.removeItem(StorageKeys.TOKEN);
    return { id: -1 }; // Cập nhật trạng thái người dùng sau khi logout
  } catch (error) {
    throw new Error("Error logging out");
  }
});
const userSlice = createSlice({
  name: "user",
  initialState: {
    current: JSON.parse(localStorage.getItem(StorageKeys.USER)),
    setting: {},
  },
  reducers: {
    logOut(state) {
      // clear local storage

      localStorage.removeItem(StorageKeys.USER);
      localStorage.removeItem(StorageKeys.TOKEN);
      state.current = { id: 10 };

      // set state
    },
    Update(state, action) {
      const clone = { ...state.current, ...action.payload };
      localStorage.setItem(StorageKeys.USER, JSON.stringify(clone));
      state.current = clone;
    },
    updateUser: (state, action) => {
      console.log("ảnh khi cập nhật trên updateusser", action.payload);
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.current.jwt = action.payload;
      })
      .addCase(profileUser.fulfilled, (state, action) => {
        state.current.profile = action.payload;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {})
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.current = { ...state.current, ...action.payload };
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  },
});

const { actions, reducer } = userSlice;
// export const {  } = userSlice.actions;
export const { logOut, Update, updateUser } = actions;
export default reducer;
