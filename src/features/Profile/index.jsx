import { Link, useParams } from "react-router-dom";
import { Box, createTheme, Typography, Button, Stack, TextField } from "@mui/material";
import rectangleImage from "./img/Rectangle 1.png";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import messImg from "./img/messImg.svg";
import React, { useEffect, useState } from "react";
import classes from "../Groups/styles.module.css";
import "./index.scss";
import classNames from "classnames";
import userApi from "../../api/userApi";
import { useSelector } from "react-redux";
import Message from "../../components/Message/Message";
import { profileUser } from "../../features/Auth/userSlice";
import { checkJWT } from "../../constants";
import ListView from "../Archived/ListView/index";
import ListNoteRender from "src/components/OtherProfile/ListNoteRender";
import { FaCamera } from "react-icons/fa6";
function Profile({ usergg, data, handleDelNote, setArchivedData, toolsNote }) {
	const theme = createTheme({
		components: {
			MuiTypography: {
				defaultProps: {
					variantMapping: {
						h1: "h2",
						h2: "h2",
						h3: "h2",
						h4: "h2",
						h5: "h2",
						h6: "h2",
						subtitle1: "h2",
						subtitle2: "h2",
						body1: "span",
						body2: "span",
					},
				},
			},
		},
	});
	const dispatch = useDispatch();
	useEffect(() => {
		document.querySelectorAll(" .content ").forEach((item) => {
			item.addEventListener("click", function (e) {
				if (item.classList.contains("content")) {
					item.classList.remove("content");
					item.classList.remove("title");
					item.classList.add("expanded");
					item.classList.add("title-expand");
				} else {
					item.classList.remove("expanded");
					item.classList.remove("title-expand");
					item.classList.add("title");

					item.classList.add("content");
				}
			});
		});
		document.querySelectorAll(".title  ").forEach((item) => {
			item.addEventListener("click", function (e) {
				if (item.classList.contains("title")) {
					item.classList.remove("title");
					item.classList.add("title-expand");
				} else {
					item.classList.remove("title-expand");
					item.classList.add("title");
				}
			});
		});
	}, []);

	const handle_message = () => {
		set_togle_Message(!togle_Message);
	};
	const user =
		useSelector((state) => state.user.current) || JSON.parse(localStorage.getItem("user"));

	const [selected, setSelected] = useState(0);
	const [profile, setProfile] = useState([]);
	const [profileInfo, setProfileInfo] = useState([]);
	const [limitedDataPrv, setLimitedDataPrv] = useState([]);
	const [limitedDataPbl, setLimitedDataPbl] = useState([]);
	useEffect(() => { console.log(limitedDataPbl) }, [limitedDataPbl])
	const [toggleData, setToggleData] = useState([]);
	const [maxRecordsToShow, setMaxRecordsToShow] = useState(12);
	const [togle_Message, set_togle_Message] = useState(false);
	const [userOnline, setUserOnline] = useState([]);
	const [toggleNote, setToggleNote] = useState(false);
	const [searchUser, setSearchUser] = useState("");
	const [listSearchUser, setListSearchUser] = useState([]);
	const [listNote, setListNote] = useState([]);

	const ConvertTypeNoteToComponent = ({ note }) => {
		switch (note.type) {
			case "screenshot":
				return (
					<div
						style={{
							height: "70%",
							width: "30%",
							overflow: "hidden",
							display: "grid",
							placeItems: "center",
							position: "relative",
						}}
					>
						<img
							style={{ objectFit: "cover", height: "80%", width: "80%" }}
							src={note.metaData}
							alt='note img'
						/>
					</div>
				);
			case "text":
				return <p className='content'>{note.data}</p>;
			case "checkList":
				return note.data.map((e) => (
					<div>
						<p
							style={{
								fontSize: "22px",
								fontWeight: "600",
								width: "200px",
							}}
							key={e.id}
						>
							{e.content}
						</p>
					</div>
				));
			default:
				return <></>;
		}
	};

	const handleNote = (id, noteArr) => {
		setToggleData(noteArr);
		setSelected(noteArr.findIndex((e) => e.idNote === id));
		setToggleNote(!toggleNote);
	};
	useEffect(() => {
		(async () => {
			const res = await userApi.profile(user.id);
			// const res = await dispatch(profileUser(user.id))
			let sorted = res.note.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));

			setProfileInfo(res.user);
			console.log(res.user);

			setLimitedDataPrv(sorted.filter((e) => !Boolean(e.notePublic)).slice(0, maxRecordsToShow));
			setLimitedDataPbl(sorted.filter((e) => Boolean(e.notePublic)).slice(0, maxRecordsToShow));
		})();
		userApi.userOnline().then((res) => {
			const status = res.users.filter((user) => user.statesLogin === 1);
			setUserOnline(status);
		});
	}, []);

	///search user
	useEffect(() => {
		userApi.getSearchUsers(searchUser).then((data) => {
			const newlistSearchUser = data.search_user.filter(
				(user) =>
					user.name.toLocaleLowerCase().includes(searchUser.toLocaleLowerCase()) ||
					user.gmail.toLocaleLowerCase().includes(searchUser.toLocaleLowerCase())
			);

			setListSearchUser(newlistSearchUser);
		});
	}, [searchUser]);
	const handleShowMore = () => {
		const newRecordsToShow = maxRecordsToShow + 4;

		if (newRecordsToShow <= 50) {
			setMaxRecordsToShow(newRecordsToShow);
			setLimitedDataPbl(profile.slice(1, newRecordsToShow));
		}
	};

	return (
		<div className={`${classes.root} RootProfile`}>
			<div className={classNames()} style={{ backgroundColor: "#f2f2f2" }}>
				<div className='i' style={{ position: "relative" }}>
					{/* profile background image*/}
					<img
						className='avaProfle'
						style={{ width: "100%", aspectRatio: "2.21" }}
						src={
							user.AvtProfile ||
							usergg.picture ||
							"https://quantrithcs.vinhphuc.edu.vn/UploadImages/thcstthoason/anh-phong-canh-dep-nhat-the-gioi.jpg"
						}
						alt='note'
					/>
					{/* profile top option */}
					<div className="absolute top-[5%] right-[5%] flex gap-5 px-5 py-2 rounded-sm bg-[rgba(0, 0, 0, 0.2)] items-center"
						style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
					>
						{/* hello text */}
						<div className="flex flex-col gap-2 text-black items-end">
							<p className="text-2xl font-bold text-slate-200">hello {user.name}</p>
							<p className="text-slate-200">{new Date().getDay() + "/" + new Date().getMonth() + 1 + "/" + new Date().getFullYear()}</p>
						</div>
						{/* missing calendar icon */}
					</div>
				</div>

				{/* profile detail box*/}
				<div className="bg-transparent relative mx-[3%]">
					<Box
						className='gapProfile'
						sx={{
							display: "flex",
							gap: "30px",
							alignItems: "center",
							position: "relative",
							top: "-21px",
							padding: "0 3%",
						}}
					>
						{/* profile avatar */}
						<div className="relative w-28 aspect-square group">
							<img className="rounded-full w-28 aspect-square" src={
								user.Avarta ||
								usergg.picture ||
								"https://i.pinimg.com/736x/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.jpg" ||
								profileInfo.Avarta
							} />
							<div className="absolute h-1/2 w-full flex justify-center items-center text-2xl bg-white bg-opacity-55 rounded-b-full bottom-0 opacity-0 group-hover:opacity-90">
								<FaCamera />
							</div>
						</div>
						{/* profile name */}
						<Box>
							<Typography variant='h5' fontWeight={500}>
								{user.name || usergg.name}
							</Typography>
							<Typography className='none' variant='h6' fontWeight={400}>
								{usergg.email || profileInfo.createAccount}
							</Typography>
							<Typography variant='h6' fontWeight={400}>
								{user.gmail}
							</Typography>
						</Box>
					</Box>


					{/* <div className='SearchName'>
            {listSearchUser.map((user) => {
              return (
                <div className='textSearch'>
                  <Link to={`/profile/${user.id}`}>
                    {" "}
                    <p style={{}}>{user.name || user.gmail}</p>{" "}
                  </Link>
                </div>
              );
            })}
          </div> */}
					{/* <Box
            sx={{
              display: "grid",

              gridTemplateColumns: "repeat(1, 1fr)",
            }}
          >
            {toggleNote === true ? (
              <ListView
                limitedData={toggleData}
                data={toggleData}
                defaultSelect={selected}
                setArchivedData={setArchivedData}
                handleDelNote={handleDelNote}
                toolsNote={toolsNote}
                clear={() => setToggleNote(false)}
              />
            ) : (
              <>
                <Box
                  // className={toggleNote === true ? "box_note_hidden" : "box_note_diplay"}
                  className='NoteMoblie'
                  sx={{
                    width: "72%",
                    marginRight: "14%",
                    minHeight: "630px",
                    backgroundColor: "rgba(162, 221, 159, 1)",
                    backgroundImage:
                      "linear-gradient(90deg, rgba(162, 221, 159, 1), rgba(238, 146, 196, 1))",
                    borderRadius: "32px",
                    marginLeft: "14%",
                    padding: "57px 44px",
                  }}
                >
                  <Typography sx={{ color: "#fff", fontSize: "24px", fontWeight: "600" }}>
                    Latest PublicNote
                  </Typography>

                  <div
                    className='wrap-record'
                    style={{ height: maxRecordsToShow <= 50 ? "auto" : "477px" }}
                  >
                    {limitedDataPbl &&
                      limitedDataPbl.map((limitedData, index) => {
                        return (
                          <>
                            <div
                              style={{ cursor: "pointer", maxHeight: "150px" }}
                              className='record'
                              key={index}
                              onClick={() => {
                                handleNote(limitedData.idNote, limitedDataPbl);
                              }}
                            >
                              <p style={{ width: "50px" }} className='number'>
                                {index + 1}
                              </p>
                              <p className='title'>{limitedData.title} </p>

                              <ConvertTypeNoteToComponent note={limitedData} />

                              <p className='date-post'>{limitedData.createAt}</p>
                            </div>
                          </>
                        );
                      })}
                  </div>

                  {profile.length > maxRecordsToShow && (
                    <Button sx={{ marginLeft: "40%" }} variant='text' onClick={handleShowMore}>
                      View more
                    </Button>
                  )}
                </Box>
              </>
            )}
          </Box> */}

					<div className="flex max-xl:flex-col-reverse gap-5">
						<div className="xl:w-2/3 w-full min-h-96 h-fit">
							<ListNoteRender listData={limitedDataPbl} user={user} />
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
				</div>
			</div>
		</div>
	);

}

const FourthBox = () => {

	const UserRender = () => {
		return (
			<Box sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				height: '52px',
				gap: '40px'
			}}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
					<svg xmlns="http://www.w3.org/2000/svg" width="53" height="53" viewBox="0 0 53 53" fill="none">
						<path d="M35.1783 4.3457H16.9699C9.06076 4.3457 4.3457 9.06076 4.3457 16.9699V35.1783C4.3457 41.284 7.14867 45.4776 12.081 47.0637C13.5151 47.5635 15.1664 47.8025 16.9699 47.8025H35.1783C36.9818 47.8025 38.6331 47.5635 40.0672 47.0637C44.9995 45.4776 47.8025 41.284 47.8025 35.1783V16.9699C47.8025 9.06076 43.0874 4.3457 35.1783 4.3457ZM44.5432 35.1783C44.5432 39.8282 42.718 42.7615 39.046 43.9783C36.9383 39.8282 31.9408 36.8731 26.0741 36.8731C20.2074 36.8731 15.2316 39.8064 13.1022 43.9783H13.0805C9.45188 42.805 7.60496 39.8499 7.60496 35.2V16.9699C7.60496 10.8425 10.8425 7.60496 16.9699 7.60496H35.1783C41.3057 7.60496 44.5432 10.8425 44.5432 16.9699V35.1783Z" fill="black" />
						<path d="M26.0786 17.3828C21.7763 17.3828 18.2998 20.8594 18.2998 25.1616C18.2998 29.4638 21.7763 32.9621 26.0786 32.9621C30.3808 32.9621 33.8573 29.4638 33.8573 25.1616C33.8573 20.8594 30.3808 17.3828 26.0786 17.3828Z" fill="black" />
					</svg>
					<p style={{
						color: "#000",
						fontFamily: "Roboto",
						fontSize: "28px",
						fontStyle: "normal",
						fontWeight: 700,
						lineHeight: "28.687px",
						letterSpacing: "-0.532px"
					}}>
						User NaN
					</p>
				</Box>
				<Box>
					<p style={{
						color: "#000",
						fontFamily: "Roboto",
						fontSize: "16px",
						fontStyle: "normal",
						fontWeight: 400,
						lineHeight: "28.687px",
						letterSpacing: "-0.532px"
					}}>
						Join at date?
					</p>
				</Box>
			</Box>

		)
	}

	return (
		<Box p={2} sx={{ backgroundColor: "#fff", borderRadius: "12px", padding: "12px 6px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}>
			<Box sx={{
				display: "flex",
				justifyContent: "space-between",
				marginBottom: "10px",
				alignItems: "center"
			}}>
				<p style={{
					color: "#888",
					fontFamily: "Roboto",
					fontSize: "22px",
					fontStyle: "normal",
					fontWeight: 700,
					lineHeight: "28.687px",
					letterSpacing: "-0.532px"
				}}>New User</p>
				{/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
									<path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									<path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
									<path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg> */}
			</Box>
			{/* render user here */}
			<Box sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: "20px",
				overflowY: 'auto',
				maxHeight: "430px"
			}}>
				{UserRender()}
				{UserRender()}
				{UserRender()}
				{UserRender()}
				{UserRender()}
				{UserRender()}
				{UserRender()}
				{UserRender()}
			</Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<p style={{
					color: "#000",
					fontFamily: "Roboto",
					fontSize: "16px",
					fontStyle: "normal",
					fontWeight: 400,
					lineHeight: "28.687px",
					letterSpacing: "-0.532px"
				}}>
					see more
				</p>
			</Box>
		</Box>
	)
}

export default Profile;
