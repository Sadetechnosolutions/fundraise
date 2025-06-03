import React, { useEffect,useCallback, useState } from "react";
import Navbar from "./navbar";
import { NavLink, useNavigate } from "react-router-dom";

const MyFundraisers = ()=>{
    const Navigate = useNavigate()
        const [fund,setFunds] = useState()

    const fetchFundraisers = useCallback(async () => {


    try {
      const token = localStorage.getItem('token');
         const userId = localStorage.getItem('UserId');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const response = await fetch(`https://api-fundraiser.sadetechnosolutions.com/api/fund-raiser/patient-info?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
       setFunds(data)
      } else {
        console.error('Failed to fetch user Image:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user Image:', error);
    }
  },[]);

  useEffect(()=>{
    fetchFundraisers();
  },[])

        const BasicProgressBar = ({ progress }) => {
        return (
          <div className="w-[29rem] py-2 max-w-md mx-auto">
            <div className="bg-gray-200 rounded-full h-2 w-full relative">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
              <span className="absolute bottom-[-1.5rem] right-0 text-sm text-black">
                {progress}%
              </span>
              <span className="absolute bottom-[-1.5rem] left-0 text-sm text-black">
               27 days left
              </span>
            </div>
          </div>
        );
      };
  

    return(
        <div>
            <Navbar />
            <div className="h-screen flex flex-col items-center -center">
                <span className="p-2 medium:p-4 text-lg medium:text-2xl font-[600]">My Fundraisers</span>
            <div className="medium:w-1/2 w-full flex flex-col h-96 p-4 medium:p-16">
            {fund?.map((funds)=>(
      <NavLink to={`/fundraisers/${funds.basicInfo.id}/${funds.basicInfo.patientName}`}>

          <div key={funds.basicInfo.id} className="flex flex-col border-b-2 p-4 gap-2 w-full medium:flex-row justify-between">
            <div className="flex flex-col gap-6 medium:gap-16 medium:flex-row it justify-between w-full">

       
            <div className="flex flex-col">
            <img className="medium:w-36 medium:h-36 h-48 rounded-md" src={`https://api-fundraiser.sadetechnosolutions.com/api/fund-raiser${funds.basicInfo.patientImage}`} alt={`https://api-fundraiser.sadetechnosolutions.com/api/fundraiser${funds.basicInfo.patientImage}`} />
            </div>
                        <div className="flex flex-col w-full">
                             <span className="text-lg medium:text-xl text-background font-[600]">{funds.description.descriptionHeading}</span>
            <span className=" medium:text-base text-gray-800 font-[600]">{funds.basicInfo.patientName}</span>
                                        <div className="flex flex-col medium:w-3/4">
                            <div className="flex items-center justify-between">
                                             <span>Raised 0</span>
                                                         <span>100000</span>
                            </div>
                            <div className="w-full mb-2 flex justify-left">
<BasicProgressBar progress='0' />
                            </div>
            </div>
            
            </div>
                 </div>
    

             </div>
               </NavLink>
            ))}
            </div>
            </div>

        </div>
    )
}

export default MyFundraisers
