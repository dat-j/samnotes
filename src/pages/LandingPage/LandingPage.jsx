import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// api
import userApi from "../../api/userApi";
import noteApi from "../../api/noteApi";
import { checkJWT } from "../../constants/function";
//icons
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CloudIcon from "@mui/icons-material/Cloud";
import SellIcon from "@mui/icons-material/Sell";
import PeopleIcon from "@mui/icons-material/People";
import HistoryIcon from "@mui/icons-material/History";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import InfoIcon from "@mui/icons-material/Info";
import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";

import {
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import styled from "@emotion/styled";
import Footer from "../../components/Footer";

import { enqueueSnackbar } from "notistack";
//styles
import classNames from "classnames/bind";
import styles from "./LandingPage.module.scss";
import GuestCreateForm from "../../components/GuestCreateForm";
import axios from "axios";
const cx = classNames.bind(styles);

const diffTime = (lastDate) => {
  const milliseconds = Math.floor(new Date() - new Date(lastDate));

  let sec = Math.floor(milliseconds / 1000);
  let min = Math.floor(sec / 60);
  if (!min) return sec + "seconds ago";
  let hour = Math.floor(min / 60);
  if (!hour) return min + " minutes ago";
  let day = Math.floor(hour / 24);
  if (!day) return hour + " hours ago";
  return day + " days ago";
};

export default function LandingPage() {
  const [menu, setMenu] = useState(false);
  const [listUserMostNote, setUserMostNote] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [newNotes, setNewNotes] = useState([]);
  const [modal, setModal] = useState(false);
  const [largeNote, setLargeNote] = useState(-1);
  const [theme, setTheme] = useState(true);
  const [listUserOnline, setlistUserOnline] = useState([]);

  // useEffect(() => {
  //   userApi.getNewUsers().then((res) => setNewUsers(res.data.slice(0, 5)));
  //   userApi.userOnline().then((res) => {
  //     const status = res.users.filter((user) => user.statesLogin === 1);
  //     setlistUserOnline(status);
  //   });
  // }, []);

  const list_user_online = async () => {
    const response = axios.get(`https://samnote.mangasocial.online/users-online`)
    setlistUserOnline((await response).data.users)
  }

  useEffect(() => {  
    list_user_online();
  }, [])

  const list_last_user = async () => {
    const response = axios.get('https://samnote.mangasocial.online/lastUser')
    setNewUsers((await response).data.data)
  }

  useEffect(() => {
    list_last_user()
  },[])

  useEffect(() => {
    setTimeout(() => {
      noteApi.getNumberNote().then((data) => {
        setUserMostNote(data.data);
      });
    }, 5000);
  }, [listUserMostNote]);

  const list_public_note = async () => {
      const response = await axios.get(`https://samnote.mangasocial.online/notes_public`)
      setNewNotes(response.data.public_note)
  }

  useEffect(() => {
    list_public_note()
  }, [])

  // useEffect(() => {
  //   noteApi.getNumberNote().then((data) => {
  //     setUserMostNote(data.data);
  //   });
  // }, [listUserMostNote]);

  const changeTheme = (val) => {
    setTheme(val);
  };

  return (
    <div className={cx("wrapper", { light: theme })}>
      <div className={cx("header")}>
        <div className={cx("logo")}>
          <Link to='/'>
            <img src='assets/logo_chua_tach_nen.png' alt='Cloudnote' />
            SAMNOTES
          </Link>
        </div>
        <CustomizedSwitches handleChange={changeTheme} theme={theme} />
        <div
          className={cx("toggle", { hidden: menu })}
          onClick={() => {
            setMenu((mn) => !mn);
          }}
        >
          {menu ? <CloseIcon /> : <MenuIcon />}
        </div>
        <div className={cx("menu", { hidden: !menu })}>
          <div className={cx("item")}>
            <Link to={checkJWT() ? "/login" : "/about"}>Manager My Note</Link>
          </div>
          {/* <div className={cx("item")}>
            <Link to='/upload'>Upload</Link>
          </div> */}
          <Link target='_blank' to={"https://thinkdiff.us/"}>
            <div className={cx("item")}>Contact Us</div>
          </Link>
          <div className={cx("item")}>Help</div>
          <div className={cx("item")}>Blog</div>
          <div className={cx("item")}>Support Forum</div>
          {!checkJWT() || (
            <>
              <div className={cx("item", "login")}>
                <Link to='/login'>Log in</Link>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={cx("body")}>
        <section>
          <div className={cx("title")}>{"The simplest way to\n keep notes"}</div>
          <div className={cx("text")}>
            {
              "All your notes, synced on all your devices. Get Samnotes now for iOS, Android or in your browser."
            }
          </div>
          <button className={cx("btn")}>
            {checkJWT ? (
              <div onClick={() => setModal(true)}>Create Public Notes</div>
            ) : (
              <Link to='/register'>Sign up now</Link>
            )}
          </button>

          <div className={cx("positive-users")}>
            <div className={cx("sort")}>Member</div>
            <div
              onClick={() => {
                window.location.assign("/");
              }}
              className={cx("refresh")}
            >
              Refresh
            </div>
            <div className={cx("list")}>
              {listUserMostNote &&
                listUserMostNote.map((item, index) => {
                  return (
                    <div className={cx("list-item")} key={index}>
                      <div className={cx("index")}>{index + 1}</div>
                      <Link className={cx("name")} to={`profile/${item.idUser}`}>
                        {item.name}
                      </Link>
                      <div className={cx("count")}></div> {item.nbnote} notes
                    </div>
                  );
                })}
            </div>
          </div>

          <div className={cx("news-title")}>Lastest Public Notes</div>
          <div className={cx("lastest-notes")}>
            <div className={cx("list")}>
              {newNotes?.map((item, index) => (
                <div className={cx("note")} key={index}>
                  <div className={cx("index")}>{index + 1}</div>
                  <div className={cx("type")}>{item.type}</div>
                  <div className={cx("title")}>{item.title}</div>
                  <div className={cx("date")}>{diffTime(item.update_at)}</div>
                  <div className={cx("author")}>{item.author}</div>
              </div>
              ))}
            </div>
          </div>
          
          <div className={cx("news-title")}>New Users</div>
          <div className={cx("new-users")}>
            <div className={cx("users")}>
              {newUsers &&
                [...newUsers].map((user, index) => {
                  return (
                    <Link to={`profile/${user.id}`}>
                      <div
                        className={cx("user")}
                        key={index}
                        style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}
                      >
                        <div
                          className={cx("avatar")}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <img src={user.linkAvatar} alt='' width={40} height={40} />
                          
                        </div>
                        <div className={cx("name")}>{user.name}</div>
                        <div className={cx("date")}>{diffTime(user.createAt)}</div>
                        <div className={cx("mail")}>{user.user_name}</div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
          <div className={cx("online-users")}>
            <div className={cx("title")}>Online</div>
            <div className={cx("list")}>
              {listUserOnline.map((user, index) => {
                return (
                  <Link to={`/profile/${user.user_id}`} key={index}>
                    <div className={cx("list-item")} >
                      <div className={cx("avatar")}>
                        <img src={user.url_avatar} alt='' width={40} height={40} />
                      </div>

                      <div className={cx("name")}>{user.user_name}</div>
                      <div className={cx("time")}>Onlines</div>
                      <div className={cx("status", "active")}></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
        <section>
          <div className={cx("title")}>{"Comprehensive underneath, \nsimple on the surface"}</div>
          <div className={cx("group")}>
            <div className={cx("group-item")}>
              <div className={cx("title")}>
                <div className={cx("icon")}>
                  <CloudIcon />
                </div>
                <span>Use it everywhere</span>
              </div>
              <div className={cx("content")}>
                Notes stay updated across all your devices, automatically and in real time. There's
                no “sync” button: It just works.
              </div>
            </div>
            <div className={cx("group-item")}>
              <div className={cx("title")}>
                <div className={cx("icon")}>
                  <SellIcon />
                </div>
                <span>Stay organized</span>
              </div>
              <div className={cx("content")}>
                Add tags to find notes quickly with instant searching.
              </div>
            </div>
            <div className={cx("group-item")}>
              <div className={cx("title")}>
                <div className={cx("icon")}>
                  <PeopleIcon />
                </div>
                <span>Work together</span>
              </div>
              <div className={cx("content")}>
                Share a to-do list, post some instructions, or publish your notes online.
              </div>
            </div>
            <div className={cx("group-item")}>
              <div className={cx("title")}>
                <div className={cx("icon")}>
                  <HistoryIcon />
                </div>
                <span>Go back in time</span>
              </div>
              <div className={cx("content")}>
                Notes are backed up with every change, so you can see what you noted last week or
                last month.
              </div>
            </div>
            <div className={cx("group-item")}>
              <div className={cx("title")}>
                <div className={cx("icon")}>
                  <TextSnippetIcon />
                </div>
                <span>Markdown support</span>
              </div>
              <div className={cx("content")}>
                Write, preview, and publish your notes in Markdown format.
              </div>
            </div>
            <div className={cx("group-item")}>
              <div className={cx("title")}>
                <div className={cx("icon")}>
                  <InfoIcon />
                </div>
                <span>It's free</span>
              </div>
              <div className={cx("content")}>
                Apps, backups, syncing, sharing - it's all completely free.
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className={cx("title")}>{"What people are saying"}</div>

          <div className={cx("group")}>
            <div className={cx("item")}>
              <div className={cx("item-container")}>
                <p>If you're not using Samnotes, you're missing out.</p>
                <div className={cx("author")}>TechCrunch</div>
              </div>
            </div>

            <div className={cx("item")}>
              <div className={cx("item-container")}>
                <p>
                  If you're looking for a cross-platform note-taking tool with just enough frills,
                  it's hard to look beyond Samnotes.
                </p>
                <div className={cx("author")}>MacWorld</div>
              </div>
            </div>

            <div className={cx("item")}>
              <div className={cx("item-container")}>
                <p>
                  If you want a truly distraction-free environment then you can't do better than
                  Samnotes for your note-taking needs.
                </p>
                <div className={cx("author")}>Zapier</div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className={cx("title")}>{"Available on all your devices"}</div>
          <div className={cx("text")}>
            Download Samnotes for any device and stay in sync - all the time, everywhere.
          </div>
          <div className={cx("downloads")}>
            <a
              href='https://apps.apple.com/us/app/sam-notes-sticky-remind/id6445824669'
              className={cx("item")}
              target='blank'
            >
              <div className={cx("icon")}>
                <AppleIcon />
              </div>
              <div className={cx("text")}>
                <div className={cx("default")}>Download on the</div>
                <div className={cx("brand")}>App Store</div>
              </div>
            </a>
            <a
              href='https://play.google.com/store/apps/details?id=com.thinkdiffai.cloud_note&fbclid=IwAR0pBFRnXwGQVRDDoYR-1mOMLLIyo5vFdy2g4iBoceAha02uFPNnwix919I'
              className={cx("item")}
              target='blank'
            >
              <div className={cx("icon")}>
                <AndroidIcon />
              </div>
              <div className={cx("text")}>
                <div className={cx("default")}>Download on the</div>
                <div className={cx("brand")}>Google play</div>
              </div>
            </a>
          </div>
        </section>
      </div>

      <div className={cx("footer")}>
        <div className={cx("items")}>
          <div className={cx("item")}>Contact Us</div>
          <div className={cx("item")}>Help</div>
          <div className={cx("item")}>Blog</div>
          <div className={cx("item")}>Developers</div>
          <div className={cx("item")}>Term & Conditions</div>
          <div className={cx("item")}>Privacy</div>
          <div className={cx("item")}>Press</div>
          <div className={cx("item")}>Privacy Notice for California Users</div>
        </div>
        <div className={cx("copy")}>&copy; Automatic</div>
      </div>

      {modal && (
        <div className={cx("modal")}>
          <div className={cx("overlay")} onClick={() => setModal(false)}></div>
          <GuestCreateForm clear={() => setModal(false)} />
        </div>
      )}

      {largeNote >= 0 && (
        <Note
          clearLarge={() => {
            setLargeNote(-1);
          }}
          note={newNotes[largeNote]}
          large={true}
        />
      )}
    </div>
  );
}

function Note({ note, active, index, large = false, clearLarge }) {
  const { r, g, b, a } = note.color;
  const containerRef = useRef(null);
  const noteId = note.idNote;

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const textRef = useRef(null);
  const clipboard = () => {
    navigator.clipboard.writeText("http://samnote.mangasocial.online/note/" + noteId);
    enqueueSnackbar("Copied to Clipboard", { variant: "success" });
    handleClose();
    console.log("Clipboard");
  };
  function handleKeyDown(event) {
    if (event.which == 17 && event.key === "a") {
      event.preventDefault();

      selectText();
    }
  }

  function selectText() {
    const textNode = textRef.current;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  return (
    <div
      className={cx("large-note", { large: large })}
      style={{
        backgroundColor: `rgba(${r},${g},${b},${a})`,
        "--index": index,
      }}
      ref={containerRef}
    >
      {large && (
        <div
          className={cx("overlay")}
          onClick={(e) => {
            if (!e.target.contains(containerRef.current)) clearLarge();
          }}
        ></div>
      )}
      <div className={cx("title")}>
        {note.title}
        <span>{diffTime(note.createAt)}</span>
      </div>
      {(note.type === "text" || note.type === "image") && (
        <div onKeyDown={handleKeyDown}>
          <div ref={textRef} className={cx("content")}>
            {note.data}
          </div>
        </div>
      )}
      {note.metaData && (
        <div className={cx("image")}>
          <img src={note.metaData} alt='' />
        </div>
      )}
      {note.type === "checklist" &&
        note.data.map((item, index) => (
          <div key={index}>
            <input type='checkbox' disabled checked={item.status} />
            {item.content}
          </div>
        ))}
      <Button
        sx={{ marginTop: "30px", width: "10%" }}
        variant='contained'
        onClick={handleClickOpen}
      >
        Share
      </Button>
      {note.username && (
        <Link to={`/profile/${note.idUser}`}>
          <p
            style={{
              position: "absolute",
              color: "#fff",
              right: 25 + "px",
              bottom: 25 + "px",
              background: "#1976d2",
              padding: 7 + "px",
              cursor: "pointer",
              borderRadius: 8 + "px",
            }}
          >
            {note.username}
          </p>
        </Link>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Share</DialogTitle>
        <DialogContent>
          <TextField
            id='name'
            type='text'
            fullWidth
            variant='standard'
            disabled
            value={"http://samnote.mangasocial.online/note/" + noteId}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={clipboard}> COPY URL</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function CustomizedSwitches({ handleChange, theme }) {
  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          // backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
          backgroundColor: "#8796A5",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      // backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
      backgroundColor: "#003892",
      width: 32,
      height: 32,
      "&:before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: "#8796A5",
      // backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      borderRadius: 20 / 2,
    },
  }));

  return (
    <FormGroup sx={{ justifyContent: "center" }}>
      <FormControlLabel
        control={
          <MaterialUISwitch
            sx={{ m: 1 }}
            onChange={(e) => handleChange(e.target.checked)}
            checked={theme}
          />
        }
      />
    </FormGroup>
  );
}
