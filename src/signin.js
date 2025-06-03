import {useEffect} from "react";
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";

const Signin = ()=>{
  const navigate = useNavigate()
  const Signup = ()=>{
    navigate('/Signup')
  }
      useEffect(() => {
      const setVh = () => {
        // This sets the CSS variable --vh to be equal to 1% of the current viewport height
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
      };
    
      setVh();
      window.addEventListener('resize', setVh);
      return () => window.removeEventListener('resize', setVh);
    }, []);
    return(
        <div className="medium:h-screen full-mobile-height bg-background flex items-center justify-center">
        <div className="w-5/6 flex">
        <div className="hidden medium:flex w-1/2">

        </div>
        <div className="medium:w-1/2 w-full  gap-6 medium:gap-10 bg-white medium:h-[30rem] flex flex-col items-center justify-center p-6 rounded-lg">
        <div className="flex flex-col gap-1 medium:gap-4 justify-center w-full medium:w-5/6">
        <span className=" text-lg font-[600]">Welcome</span>
<div>
<TextField
  label="Email"
  variant="standard"
  fullWidth
  sx={{
    '& .MuiInput-underline:before': {
      borderBottom: '2px solid gray-100', // Customize this
    },
    '& .MuiInput-underline:hover:before': {
      borderBottom: '2px solid gray-100',
    },
    '& .MuiInput-underline:after': {
      borderBottom: '2px solid gray-100', // Focused state
    },
  }}
    InputLabelProps={{
    sx: {
      top: '5px', // Pull label closer
      fontSize: '14px',
    },
  }}
/>
</div>
<div>
<TextField
  label="Password"
  variant="standard"
  fullWidth
  sx={{
    '& .MuiInput-underline:before': {
      borderBottom: '2px solid gray-100', // Customize this
    },
    '& .MuiInput-underline:hover:before': {
      borderBottom: '2px solid gray-100',
    },
    '& .MuiInput-underline:after': {
      borderBottom: '2px solid gray-100', // Focused state
    },
  }}
    InputLabelProps={{
    sx: {
      top: '5px', // Pull label closer
      fontSize: '14px',
    },
  }}
/>
</div>
</div>
<button className="medium:p-2 p-1.5 bg-background rounded-full w-full medium:w-5/6">
    <span className="text-white text-sm medium:text-base font-[600]">Login</span>
</button>
<span className="text-sm medium:text-base">Dont have an account <span onClick={Signup} className="text-background font-[600] underline cursor-pointer">Signup</span></span>
        </div>
        </div>
        </div>
    )   
}

export default Signin;