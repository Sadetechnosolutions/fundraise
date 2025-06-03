import react,{useEffect, useState} from "react";
import TextField from '@mui/material/TextField';
import Modal from 'react-modal';
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Signup = ()=>{
  const navigate = useNavigate()
  const [phonenumber,setPhoneNumber] = useState('')
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [user,setUser] = useState({ name: '', email: '', phoneNumber:'', password:'', confirmPassword:'' });
  const [siginOtp,showSigninOtp] = useState(false);
  const [seconds, setSeconds] = useState(300)

  const openLogin = ()=>{
    navigate('/Login')
  }

        const login = async ()=>{
        const payload={
          phoneNumber:phonenumber,
        }
        try{
          const response = await fetch(`https://api-fundraiser.sadetechnosolutions.com/api/fund-raiser/register-mobile`,{
            method:'POST',
              headers: {
    "Content-Type": "application/json", // <-- this is required
  },
            body:JSON.stringify(payload)
          })
          if(response.ok){
            console.log('')
            handleOpenOtp()
          }
          else{
            console.log('error in posting data')
          }
        }
        catch(error){
          console.error(error)
        }
      }
      const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            // Move focus to the previous input if the current input is empty and backspace is pressed
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };
              const handleOTPChange = (e, index) => {
          const { value } = e.target;
          // Ensure the value is a single digit or empty
          if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            // Move focus to the next input if a value is entered
            if (value && index < otp.length - 1) {
              document.getElementById(`otp-${index + 1}`).focus();
            }
          }
        };

        const handleOpenOtp = ()=>{
          showSigninOtp(true)
        }

        const handlecloseotp = ()=>{
    setUser({ name: '', email: '', phoneNumber: '', password: '', confirmPassword: '' });
    showSigninOtp(false);
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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.some(field => field === '')) {
      return;
    }
      const otpString = otp.join("");
const userdata = {
  input:phonenumber,
  otp:otpString
}
    try {

      const response = await fetch(`https://api-fundraiser.sadetechnosolutions.com/api/fund-raiser/verify-otp-register`, {
        method: 'POST',
          headers: {
    "Content-Type": "application/json", // <-- this is required
  },
                body: JSON.stringify(userdata),
      });
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        navigate('/')
        handlecloseotp()
        setPhoneNumber('')
        setOtp(Array(6).fill(''));
      } 
      else {
        console.error('Failed to submit data:', await response.text());
        setOtp(Array(6).fill(''));
      }
    } catch (error){
      console.error('Error submitting data:', error);
    }
  };

    return(
        <div className="medium:min-h-screen full-mobile-height bg-background flex items-center justify-center">
        <div className="w-5/6 flex">
        <div className="hidden medium:flex w-1/2">

        </div>
        <div className="medium:w-1/2 w-full  gap-6 medium:gap-10 bg-white medium:h-[30rem] flex flex-col items-center justify-center p-6 rounded-lg">
        <div className="flex flex-col gap-1 medium:gap-4 justify-center w-full medium:w-5/6">
        <span className=" text-lg font-[600]">Lets get Started</span>
        {/* <div>
<TextField
  label="Your Name"
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
        </div> */}
<div>
<TextField
  type="tel"
  onChange={(e)=>{setPhoneNumber(e.target.value)}}
  value={phonenumber}
  label="Phone Number"
  variant="standard"
  fullWidth
  sx={{
    '& .MuiInput-underline:before': {
      borderBottom: '2px solid #e0e0e0', // Use actual color code instead of 'gray-100'
    },
    '& .MuiInput-underline:hover:before': {
      borderBottom: '2px solid #e0e0e0',
    },
    '& .MuiInput-underline:after': {
      borderBottom: '2px solid #e0e0e0',
    },
  }}
  InputLabelProps={{
    sx: {
      top: '5px',
      fontSize: '14px',
    },
  }}
/>

</div>
</div>
<div className="flex flex-col gap-2 w-full items-center">


<button onClick={login}  className="medium:p-2.5 p-1.5 bg-background rounded-md w-full medium:w-5/6">
    <span className="text-white text-sm medium:text-base font-[600]">Signup</span>
</button>
<span>or</span>
            <GoogleOAuthProvider clientId="20674305043-s7vcprhkf5pks7mp3t99qd46qgvo73vq.apps.googleusercontent.com">
      <div className="w-5/6">
        <GoogleLogin
          onSuccess={credentialResponse => {
            const jwt = credentialResponse.credential;
            // Send this to your Spring Boot backend
            fetch("https://api-fundraiser.sadetechnosolutions.com/api/fund-raiser/google-register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: jwt })
            })
              .then(res => res.json())
              .then(data => {console.log("Backend Response:", data)

                localStorage.setItem("token", data.token);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem('UserId',data.id)
              });

              navigate('/')
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </GoogleOAuthProvider>
</div>
<span className="text-sm medium:text-base">Already have an account <span onClick={openLogin} className="text-background font-[600] underline cursor-pointer">Login</span></span>
        </div>
        </div>  

                <Modal
  style={{
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      backgroundColor: 'transparent',
      transform: 'translate(-50%, -50%)',
      width:'100%',
      overflow: 'hidden',
      border: 'none',
      display:'flex',
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center'
    },
  }}
  isOpen={siginOtp}
  onRequestClose={handlecloseotp}
>
  <div className='relative bg-white shadow-lg rounded-md w-full h-64 medium:h-72 medium:w-1/4' >
    <div className="absolute flex justify-between items-center top-0 w-full h-12 cursor-pointer px-4 py-2 rounded-md border border-gray-300 bg-background text-white-800 mb-2 text-white font-semibold">
      <p className='text-xl'>Enter your OTP</p>
      <Icon className='w-6 h-6' onClick={handlecloseotp} icon="ic:baseline-close" />
    </div>
    <div className='flex flex-col items-center justify-center h-full pt-12'>
      <div className='flex flex-col items-center gap-4'>
    <div className='rounded-full w-8 h-8 medium:w-10 medium:h-10 flex items-center justify-center bg-gray-200'><Icon className="w-5 h-5 medium:w-6 medium:h-6" icon="material-symbols:mail-outline" /></div>

        <div className='flex gap-2'>
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              className='px-3 py-2 text-sm border w-12 border-gray rounded-md focus:border-gray text-center'
              type='text'
              maxLength='1'
              onChange={(e) => handleOTPChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              value={value}
              placeholder='0'
            />
          ))}
        </div>
        <div className='flex w-80 items-center justify-between'>
        <button className='px-4 py-2 bg-gray-100 shadow-md rounded-md'>Resend OTP</button>
        <button
          className="cursor-pointer px-4 py-2 border border-gray-300 bg-background text-white-800 text-white font-semibold rounded-md"
          onClick={handleVerifyOtp}
          type='submit'
        >
          Submit
        </button>
        </div>
        <span><span> {seconds > 0 ? `Time left: ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}` : 'Time’s up!'}</span>
        </span>
      </div>
    </div>
  </div>
</Modal>
        </div>
    )
}

export default Signup;