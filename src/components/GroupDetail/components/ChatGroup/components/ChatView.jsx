import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Box, Stack } from "@mui/material";
import LayoutMe from "./Layout/LayoutMe";
import LayoutOther from "./Layout/LayoutOther";
import { useSelector } from "react-redux";

ChatView.propTypes = {
  data: PropTypes.array,
};
ChatView.defaultProps = {
  data: [],
};

function ChatView({ data }) {
  const user =
    useSelector((state) => state.user.current) || JSON.parse(localStorage.getItem("user"));
  const messagesEndRef = useRef(null);

  const sortedData = [...data].sort((a, b) => a.id - b.id);


  const scrollToBottom = () => {
    if (sortedData[sortedData.length - 1]?.idSend !== user.id) return;
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [sortedData]);

  

  return (
    <Stack
      flex='1'
      sx={{
        backgroundColor: "rgb(238,240,241)",
        overflow: "hidden scroll",
        padding: "15px",
      }}
    >
      {sortedData.map((item, idx) => {
        return (
          <Box key={item.id}>
            {item.idSend === user.id ? (
              <LayoutMe
                data={item}
                next={data[idx + 1]?.idSend || -1}
                prev={data[idx - 1]?.idSend || -1}
              />
            ) : (
              <LayoutOther
                data={item}
                next={data[idx + 1]?.idSend || -1}
                prev={data[idx - 1]?.idSend || -1}
              />
            )}
          </Box>
        );
      })}
      <div ref={messagesEndRef}></div>
    </Stack>
  );
}

export default ChatView;
