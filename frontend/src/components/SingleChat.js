import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./style.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  const [typing, setTyping] = useState(false);
  const [isTyping, setisTyping] = useState(false);

  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      perserveAspectRatio: "xMidYmid slice",
    },
  };

  const fetchMessage = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!!!",
        description: "failed to Load message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);

        socket.emit("new message", data);

        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!!!",
          description: "failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setisTyping(true));
    socket.on("stop typing", () => setisTyping(false));
  }, []);

  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

 
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain)
        }

      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });
  

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing indicator
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing)
        socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}>
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessage={fetchMessage}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg="blackAlpha.700"
            width={"100%"}
            height={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}>
            {/* messages here */}
            {loading ? (
              <Spinner
                size={"xl"}
                width={20}
                height={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl
              id="inputBox"
              onKeyDown={sendMessage}
              isRequired
              mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                _focus={{ background: "#fff" }}
                variant={"filled"}
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"100%"}>
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click on a user to Start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
