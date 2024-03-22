import { useState, useRef, useEffect, useContext } from "react";
import styled from "@emotion/styled";
import { ShareNoteContext } from "./home";
import { enqueueSnackbar } from "notistack";
import { DialogActions } from "@mui/material";

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  padding: 32px 16px;
  color: #fff;
  background-color: #000c;
  border-radius: 12px;
  display: flex;
  align-items: center;
  z-index: 100;
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #000;
  border-radius: 12px;
  padding: 20px;
  padding-left: 0;
  border: 1px solid #999;
`;

const Input = styled.input`
  border: none;
  outline: none;
  margin: 0 20px;
  padding: 8px 12px;
  font-size: 18px;
  width: 100%;
  box-sizing: border-box;
  background-color: transparent;
  color: #fff;
  float: left;

  &:placeholder {
    color: #fffd;
  }

  &:selection {
    color: #fac;
  }
`;

const Button = styled.button((props) => ({
  border: "none",
  outline: "none",
  backgroundColor: props.bgc,
  color: "#333",
  padding: "8px",
  borderRadius: "20px",
  fontWeight: 600,
  cursor: "pointer",
}));


const CloseButton = styled.span((props) => ({
  border: "none",
  outline: "none",
  backgroundColor: props.bgc,
  color: "#7d2424",
  padding: "5px",
  borderRadius: "15px",
  fontWeight: 600,
  cursor: "pointer",
  margin : "5px",
}));

const SharePopup = ({ noteId }) => {
  const [bgc, setBgc] = useState("#aaf");
  const [text, setText] = useState("");
  const [id, setId] = useState(noteId);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const shareNoteId = useContext(ShareNoteContext);

  const clipboard = (e) => {
    inputRef.current.select();
    inputRef.current.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(inputRef.current.value).then(() => {
      enqueueSnackbar("Copied to Clipboard", { variant: "success" });
    });

    shareNoteId(null);
  };

  useEffect(() => {
    setId(noteId);
    setText(`https://samnote.mangasocial.online/note/${noteId}`);
  }, [noteId]);

  const handleCloseCancel = () => {
    shareNoteId(null);
  };

  return (
    noteId && (
      <Wrapper ref={wrapperRef}>
        <InputWrapper>
          <Input value={text} ref={inputRef} />
          <Button
            bgc={bgc}
            onMouseDown={() => setBgc("#88f")}
            onMouseUp={() => setBgc("#aaf")}
            onClick={clipboard}
            onChange={(e) => setText(e.target.value)}
          >
            Copy
          </Button>
          <CloseButton 
           bgc={bgc}
           onClick={handleCloseCancel}>Cancel</CloseButton>
        </InputWrapper>
      </Wrapper>
    )
  );
};

export default SharePopup;
