import { Navigate, Route, Routes, Outlet, useLocation } from "react-router-dom";
import "./App.css";
import { LandingPage } from "./pages/LandingPage";
import Home from "./components/home";
import Login from "./features/Auth/Login";
import Register from "./features/Auth/Register";
import ImageUploader from "./components/ImageUploader/ImageUploader";
import { checkJWT } from "./constants";
import GroupDetail from "./components/GroupDetail";
import { Explore } from "./features";
import Note from "./components/Note";
import Anonymous from "./features/Anonymous/Anonymous";
import Profile_orther from "./features/Profile_orther/Profile_orther";
import Test from "./pages/Test/Test";
import AuthLayout from './features/Auth/layout';
import MessagePage from "./features/Message/Message";
function App() {
  const RequireLogin = () => {
    return !checkJWT() ? <Outlet /> : <Login />;
  };

  if (localStorage.getItem("show") !== "false") {
    localStorage.setItem("show", true);
  }

  return (
    <div>
      <Routes>
        <Route path='/' element={<LandingPage />}></Route>
        {/* <Route
          path='/'
          element={checkJWT() ? <Navigate to='/login' replace /> : <Navigate to='/home' replace />}
        /> */}
        <Route path='/profile/:id' element={<Profile_orther />} />
        <Route element={<RequireLogin />}>
          <Route exact path='/about/explore' element={<Explore />} />
          <Route path='/about/*' element={<Home />} />
          <Route path='/upload' element={<ImageUploader />} />
          <Route path='/group/:idGroup/*' element={<GroupDetail />} />
          <Route path='/note/:noteId' element={<Note />} />
          <Route path="/message" element={<MessagePage />} />
          <Route path='/anonymous' element={<Anonymous />} />
        </Route>

        <Route path='/login' element={checkJWT() ? <AuthLayout /> : <Navigate to='/about' replace />} />
        <Route
          path='/register'
          element={checkJWT() ? <AuthLayout /> : <Navigate to='/about' replace />}
        />
        <Route
          path='/forgot'
          element={checkJWT() ? <AuthLayout /> : <Navigate to='/about' replace />}
        />
        <Route path='/test' element={<Test />} />
      </Routes>
    </div>
  );
}

export default App;
