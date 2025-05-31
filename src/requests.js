import React,{useState,useEffect,useCallback} from "react";
import { NavLink } from "react-router-dom";

const Request = ()=>{
    const [funds,setFunds] = useState()
    const fetchRequest = useCallback(async () => {

    try {
      const token = localStorage.getItem('token');
         const userId = localStorage.getItem('UserId');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const response = await fetch(`http://localhost:9090/api/fund-raiser/get-patient-details-status/PENDING`, {
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
    fetchRequest();
  },[])

    return(
    <div className="w-full flex flex-col items-center justify-center">
        <div className="medium:w-1/2 bg-blck p-4 w-full">
            {funds?.map((funds)=>(

<NavLink to={`/requestdetails/${funds.basicInfo.id}`}>
<div className="flex flex-col  border-b-2 p-4">
          <div key={funds.basicInfo.id} className="flex flex-col gap-2 w-full medium:flex-row items-center justify-between">
            <div className="flex flex-col gap-6 medium:gap-16 medium:flex-row items-cener justify-between w-full">

       
            <div className="flex flex-col">
            <img className="medium:w-36 medium:h-36 h-48 rounded-md" src={`http://localhost:9090/api/fund-raiser${funds.basicInfo.patientImage}`} alt={`http://localhost:9090/api/fundraiser${funds.basicInfo.patientImage}`} />
            </div>
                        <div className="flex flex-col w-full">
                             <span className="text-lg medium:text-xl text-background font-[600]">{funds.description.descriptionHeading}</span>
            <span className=" medium:text-base text-gray-800 font-[600]">{funds.basicInfo.patientName}</span>
                                        <div className="flex flex-col medium:w-3/4">
                            <div className="flex items-center justify-between">
                                             <span>Raised 0</span>
                                                         <span>100000</span>
                            </div>

            </div>

            </div>
                 </div>

             </div>
             <div className="flex items-center w-full bg-lack justify-between">
                <span></span>
<button className="w-full medium:w-max  py-1 px-3 text-center bg-background rounded-md"><span className="text-white">View</span></button>
             </div>
</div>

               </NavLink>
            ))}
        </div>
     <div>
        {funds? '' : <span>No requests</span>}     
        </div>
    </div>
    )
}

export default Request;