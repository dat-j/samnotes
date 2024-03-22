import React, { useCallback } from "react";
import axios from "axios";
import classes from "./styles.module.css";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import SideBar from "../../components/SideBar";
import { checkJWT } from "../../constants";
import ListView from "../Archived/ListView";
import StorageKeys from "../../constants/storage-keys";
import jwtDecode from "jwt-decode";
import { Box, createTheme, Typography, Button, Stack, TextField } from "@mui/material";
import InputField from "../../components/FormControls/InputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'
import ListNoteRender from '../../components/OtherProfile/ListNoteRender';
import FlexMenuListButton from "../../components/OtherProfile/FlexMenuListButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shadcn/ui/dropdown-menu"
import { useOnClickOutside } from "../../customHook/useOnClickOutside";

function Profile_orther({ data, handleDelNote, setArchivedData, toolsNote }) {
  const user =
    useSelector((state) => state.user.current) || JSON.parse(localStorage.getItem("user"));

    
  const [otherProfile, setOtherProfile] = useState({});
  const [note, setNote] = useState([]);
  const [startIndex, setStartIndex] = useState(5);
  const [toggleNote, setToggleNote] = useState(false);
  const [limitedData, setLimitedData] = useState([]);
  const { id } = useParams();
  const handleOpenDrawer = (param) => {
    // setType(param);
    // setDrawerNew(true);
    // setOptions({ ...options, dueAt: null, remindAt: null, lock: null, notePublic: true });
    // setColorNote(user.df_color);
  };

  // const usergg = jwtDecode(localStorage.getItem(StorageKeys.TOKEN));

  

  useEffect(() => {
    const api_profile = async () => {
      const result = await axios({
        method: "GET",
        url: `https://samnote.mangasocial.online/profile/${id}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return result.data;
    };
    api_profile().then((data) => {
      setOtherProfile(data.user);
      setLimitedData(data.note.slice(2, startIndex));
      // setUser(data.user);
      // setUserName(data.user.name);
      // setGmailUser(data.user.gmail);
      setNote(data.note);
    });
  }, []);

  // useEffect(() => {
  //   if(otherProfile){
  //     axios.get(`https://samnote.mangasocial.online/profiles_search?key=${otherProfile.userId}`).then(data => {
  //       set
  //     })

  //   }
  // },[otherProfile])

  // useEffect(() => {
  //   if (id == user.id) {
  //     //push to home/profile
  //   }
  // }, [id, user])

  const handle_viewMore = () => {
    setStartIndex((startIndex) => startIndex + 5);
  };
  const handleToggle = () => {
    setToggleNote(!toggleNote);
  };
  return (
    <>
      <SideBar />
      <div className={`${classes.wapper_profile}`}>
        {/* header profile */}
        <div className='wapper_profile_box'>
          <div className={`${classes.wapper_profile_contain}`}>
            <img className={`${classes.wapper_profile_img}`} src={otherProfile.AvtProfile}></img>
          </div>
        </div>


        {/* main profile */}
        <div className="m-auto translate-y-[-12px]">
          <div className="flex justify-between">
            <div className="flex ml-[5%] items-center  gap-5">
              <img className="w-[80px] h-[80px] rounded-full" src={otherProfile.Avarta} />
              <div>
                <p className="font-bold text-xl">{otherProfile.name}</p>
                <p className="">join at {otherProfile.createAccount}</p>
              </div>
            </div>
            <div className="flex items-center mr-[5%] text-2xl font-bold">
              <DropdownMenu>
                <DropdownMenuTrigger>...</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Action</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem><Link to={'/message/'}>Message</Link></DropdownMenuItem>
                  <DropdownMenuItem>Add to group</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-[20px] min-h-[200px]">
            {/*profile content */}
            <div className="">
              {/* {Note.slice(0, startIndex).map((val, index) => {
                  const lastindex = Note.slice(0, startIndex).length - 1;
                  return (
                    <div
                      onClick={handleToggle}
                      key={index}
                      style={{
                        cursor: "pointer",
                        justifyContent: "start",
                        gap: 10 + "px",
                        backgroundColor: "#FFFFFF",
                        paddingTop: 12 + "px",
                        paddingBottom: 12 + "px",
                        paddingLeft: 24 + "px",
                        paddingRight: 24 + "px",
                        borderBottom: 1 + "px solid",
                        borderBottomColor: "#818181",
                      }}
                      className={
                        index == 0
                          ? classes.styleFist
                          : index == lastindex
                            ? classes.styleLast
                            : "" + `${classes.wapper_content}`
                      }
                    >
                      <h2>{index + 1}</h2>
                      <p
                        style={{
                          margin: 5 + "px",
                        }}
                      >
                        {userName}
                      </p>
                      <p className={`${classes.profile_text}`}>{"" + val.data}</p>
                      <div
                        className={`${classes.none}`}
                        style={{
                          position: "absolute",
                          right: 170 + "px",
                          cursor: "pointer",
                        }}
                      >
                        <p>{val.createAt}</p>
                      </div>
                    </div>
                  );
                })} */}
            </div>
            <div className="flex max-xl:flex-col-reverse gap-5">
              <div className="xl:w-2/3 w-full min-h-96 h-fit">
                <ListNoteRender listData={note} user={otherProfile} />
              </div>
              <div className="bg-[#fff4ba] rounded-[12px] py-[12px] border-[1px solid #E81313] w-[96%] mx-[2%] xl:w-1/3 px-5 mr-5">
                <div className="flex justify-between mb-[10px] items-center">
                  <p style={{
                    color: "#888",
                    fontFamily: "Roboto",
                    fontSize: "22px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "28.687px",
                    letterSpacing: "-0.532px"
                  }}>Scratch Path</p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                {/* content */}
                <div>
                  <p style={{
                    color: "#000",
                    fontFamily: "Roboto",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28.687px",
                    letterSpacing: "-0.532px"
                  }}>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint, sequi? Corporis, eum enim? Quod in est quae necessitatibus vero, temporibus incidunt, fugit aliquid, deleniti provident officia cumque itaque asperiores neque.
                  </p>
                </div>
              </div>
            </div>


            {/* new recorded infomation */}
            <div className="flex flex-col gap-3 px-5 py-3">

              {/* title */}
              <div className="flex justify-between items-center">
                <p>NEW RECORDED INFOMATION</p>
                <p>...</p>
              </div>
              {/* flex menu button list*/}
              <FlexMenuListButton />
            </div>
          </div>

          {/* end main profile */}
        </div>


      </div>
    </>
  );
}
export default Profile_orther;



{/* {toggleNote === true ? (
                  <ListView
                    limitedData={limitedData}
                    toggleNote={toggleNote}
                    data={data}
                    setArchivedData={setArchivedData}
                    handleDelNote={handleDelNote}
                    toolsNote={toolsNote}
                  />
                ) : (
                  Note.slice(0, startIndex).map((val, index) => {
                    const lastindex = Note.slice(0, startIndex).length - 1;
                    return (
                      <div
                        onClick={handleToggle}
                        key={index}
                        style={{
                          cursor: "pointer",
                          justifyContent: "start",
                          gap: 10 + "px",
                          backgroundColor: "#FFFFFF",
                          paddingTop: 12 + "px",
                          paddingBottom: 12 + "px",
                          paddingLeft: 24 + "px",
                          paddingRight: 24 + "px",
                          borderBottom: 1 + "px solid",
                          borderBottomColor: "#818181",
                        }}
                        className={
                          index == 0
                            ? classes.styleFist
                            : index == lastindex
                            ? classes.styleLast
                            : "" + `${classes.wapper_content}`
                        }
                      >
                        <h2>{index + 1}</h2>
                        <p
                          style={{
                            margin: 5 + "px",
                          }}
                        >
                          {userName}
                        </p>
                        <p className={`${classes.profile_text}`}>{"" + val.data}</p>
                        <div
                          style={{
                            position: "absolute",
                            right: 170 + "px",
                            cursor: "pointer",
                          }}
                        >
                          <p>{val.createAt}</p>
                        </div>
                      </div>
                    );
                  })
                )} */}