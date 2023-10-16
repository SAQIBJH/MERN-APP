import React, { useState } from "react";
import {
  FormControl,
  VStack,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router";

const SignUp = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setloading] = useState(false);
  const toast = useToast();

  const [formData, setformData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "",
  });
  function changeHandler(e) {
    const { name, value } = e.target;
    setformData((prevformdata) => {
      return { ...prevformdata, [name]: value };
    });
  }

  const postDetails = async (pic) => {
    setloading(true);
    if (pic === undefined) {
      toast({
        title: "Please select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setloading(false);
      return;
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "saqibsld");
      await fetch("https://api.cloudinary.com/v1_1/saqibsld/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          
          setformData((prevformdata) => ({
            ...prevformdata,
            pic: data.url.toString(),
          }));

          setloading(false);
          toast({
            title: "Image Uploaded Successfully...",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
        });
    } else {
      toast({
        title: "Please select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setloading(false);
      return;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // if any of field not exist simply return with pop up message
    setloading(true);
    const { name, email, password, confirmPassword, pic } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill all field",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      setloading(false);
      return;
    }

    // checking both password match or not
    if (password !== confirmPassword) {
      toast({
        title: "password doesn't match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    // if all true we will store this in our database
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      

      toast({
        title: "Registration is Successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);

      // after successfull submission
      navigate("/chats");
      // history.push("/chats");
    } catch (err) {
      toast({
        title: "Error occured!!",
        description: err.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setloading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired mb={"5px"}>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input
          placeholder="john"
          name="name"
          type="text"
          id="name"
          value={formData.name}
          onChange={changeHandler}
        />
      </FormControl>

      {/* email */}
      <FormControl id="email" mb={"5px"} isRequired>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          placeholder="abc@example.com "
          name="email"
          type="email"
          id="email"
          value={formData.email}
          onChange={changeHandler}
        />
      </FormControl>

      {/* password */}
      <FormControl id="password" isRequired mb={"5px"}>
        <FormLabel htmlFor="password">Password</FormLabel>

        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="*******"
            name="password"
            id="password"
            value={formData.password}
            onChange={changeHandler}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShow((prev) => !prev)}>
              {show ? "Hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* confirm password */}

      <FormControl id="confirmpassword" isRequired mb={"5px"}>
        <FormLabel htmlFor="confirmpassword">Confirm Password</FormLabel>

        <InputGroup>
          <Input
            type={showConfirm ? "text" : "password"}
            placeholder="*******"
            name="confirmPassword"
            id="confirmpassword"
            value={formData.confirmPassword}
            onChange={changeHandler}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowConfirm((prev) => !prev)}>
              {showConfirm ? "Hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      {/* pic */}
      <FormControl id="pic" mb={"5px"}>
        <FormLabel htmlFor="pic">Upload Your Picture</FormLabel>
        <Input
          name="pic"
          type="file"
          id="name"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        width={"100%"}
        mt={15}
        backgroundColor={"blue.500"}
        // _hover={"blue.600"}
        onClick={(e) => submitHandler(e)}
        isLoading={loading}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
