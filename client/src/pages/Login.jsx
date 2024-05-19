import { Heading } from "../components/ui/Heading";
import { SubHeading } from "../components/ui/SubHeading";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { BottomWarning } from "../components/ui/BottomWarning";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from '@chakra-ui/react'
import axios from "axios";

function Signin() {
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    const toast = useToast();
    const navigate = useNavigate();

    const handleChange = (e, setter) => {
        const value = e.target.value;
        console.log(value);
        setter(value);
    }

    async function handleSignin(e) {
        e.preventDefault();
        console.log("Form Values");
        console.log(email);
        console.log(password);
            const response = await axios.post("https://sleep-tracker-six.vercel.app/api/user/login", {
                email: email,
                password: password,
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(async (res) => {
            // console.log(res.data.token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            localStorage.setItem('userId', res.data.user._id);
            localStorage.setItem('token', res.data.token);
            toast({
              title: 'Login Successfull!',
              status: 'success',
              duration: 6000,
              isClosable: true,
            })
            navigate('/dashboard'); 
      }).catch((err) => {
        console.log(err.response.data.error)
        toast({
          title: 'Login Failed!',
          description: err.response.data.error,
          status: 'error',
          duration: 6000,
          isClosable: true,
        })
      })
    }

    return (
        <div className="flex items-center justify-center bg-black h-screen ">
            <div className="flex justify-center">
                <div className="flex flex-col justify-center">
                    <div className=" rounded-3xl bg-white w-80 sm:w-96 text-center p-2 h-max sm:px-4">  
                        <Heading title="Sign-in" />
                        <SubHeading title="Welcome back!" />
                        <form onSubmit={handleSignin}>
                            <Input type={"text"} label="Email" placeholder="Enter your email" onChange={(e) => handleChange(e, setemail)}/>
                            <Input type={"password"} label="Password" placeholder="Enter your password" onChange={(e) => handleChange(e, setPassword)}/>
                            <div className="mt-4">
                                <Button label="Sign In" typeb="submit"/>
                            </div>
                        </form> 
                        <BottomWarning message="Demo account: test1@gmail.com" />
                        <BottomWarning message="Password: password" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signin;