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
import { useNavigate } from "react-router";


const Login = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });
  const [loading, setloading] = useState(false);
  const toast = useToast();
  


  function changeHandler(e) {
    const { name, value } = e.target;
    setformData((prevformdata) => {
      return { ...prevformdata, [name]: value };
    });
  }

  const submitHandler = async(e) => {
    e.preventDefault();
    setloading(true);
    const { email, password } = formData;
    if (!email || !password) {
      toast({
        title: "Please fill all input field",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setloading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "content-type":"application/json"
        }
      }

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

          toast({
            title: "Login Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
      
      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);
      navigate("/chats");

      

    } catch (err) {
          toast({
            title: "error occured",
            description:err.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
      setloading(false);
    }

   };

  return (
    <VStack spacing="5px">
      {/* email */}
      <FormControl id="emailadd" mb={"5px"} isRequired>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          placeholder="Enter email address... "
          name="email"
          type="email"
          id="emailadd"
          value={formData.email}
          onChange={changeHandler}
        />
      </FormControl>
      {/* password */}
      <FormControl id="password" isRequired mb={"5px"}>
        <FormLabel htmlFor="pass">Password</FormLabel>

        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password..."
            name="password"
            id="pass"
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
      <Button
        width={"100%"}
        mt={15}
        backgroundColor={"blue.500"}
        isLoading={loading}
        onClick={(e) => submitHandler(e)}>
        Log In
      </Button>
      <Button
        variant={"solid"}
        colorScheme="red"
        width={"100%"}
        mt={15}
        onClick={() => {
          setformData({
            email: "guest@example.com",
            password: "123456",
          });
        
        }}>
        Get Guest User Credentials
      </Button>
      
    </VStack>
  );
};

export default Login;
