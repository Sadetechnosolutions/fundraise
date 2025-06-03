import React,{useState,useEffect,useCallback} from "react";
import { useParams } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import { Icon } from "@iconify/react/dist/iconify.js";

const FundraiserInfo = ()=>{
      const { id, name } = useParams();
            const fundDetails = [{
        id:1,
        topic:'topic',
        heading:'Help Mozhivalan fight Leukemia, needs Bone Marrow Transplant',
        description:'Hello, my name is Namrata and this fund raiser has been created to support my son and',
        amount:'Raised 1,90,000',
        supporters:'43 supporters',
        fundraiser:'Sharan',
        percentage:40
      },
      {
        id:2,
        topic:'topic',
        heading:'Help Mozhivalan fight Leukemia, needs Bone Marrow Transplant',
        description:'Hello, my name is Namrata and this fund raiser has been created to support my son and',
        amount:'Raised 1,90,000',
        supporters:'43 supporters',
        fundraiser:'Anitha',
        percentage:21
      },
      {
        id:3,
        topic:'topic',
        heading:'Help Mozhivalan fight Leukemia, needs Bone Marrow Transplant',
        description:'Hello, my name is Namrata and this fund raiser has been created to support my son and',
        amount:'Raised 1,90,000',
        supporters:'43 supporters',
        fundraiser:'Vikash',
        percentage:68
      },
      {
        id:4,
        topic:'topic',
        heading:'Help Mozhivalan fight Leukemia, needs Bone Marrow Transplant',
        description:'Hello, my name is Namrata and this fund raiser has been created to support my son and',
        amount:'Raised 1,90,000',
        supporters:'43 supporters',
        fundraiser:'Tharun',
        percentage:7
      },
      {
        id:5,
        topic:'topic',
        heading:'Help Mozhivalan fight Leukemia, needs Bone Marrow Transplant',
        description:'Hello, my name is Namrata and this fund raiser has been created to support my son and',
        amount:'Raised 1,90,000',
        supporters:'43 supporters',
        fundraiser:'Megha',
        percentage:27
      },
      {
        id:6,
        topic:'topic',
        heading:'Help Mozhivalan fight Leukemia, needs Bone Marrow Transplant',
        description:'Hello, my name is Namrata and this fund raiser has been created to support my son and',
        amount:'Raised 1,90,000',
        supporters:'43 supporters',
        fundraiser:'Sharan',
        percentage:94
      },
]

const tabs = ["About", "Update", "Documents"];
  const [activeIndex, setActiveIndex] = useState(0);
  const [fund,setFunds] = useState()

      const fetchFundraisers = useCallback(async () => {
      try {
        const token = localStorage.getItem('token');
           const userId = localStorage.getItem('UserId');
        if (!token) {
          console.error('No token found in localStorage');
          return;
        }
        const response = await fetch(`https://api-fundraiser.sadetechnosolutions.com/api/fund-raiser/get-detailed-information-of-fund-raiser/${id}`, {
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


const fundraiser = fund;



      const BasicProgressBar = ({ progress }) => {
        return (
          <div className="w-full mb-8 max-w-md mx-auto">
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

  if (!fundraiser) {
    return <div>Fundraiser not found.</div>;
  }
    return(
     <div>
        <Navbar />
        <div>
        <div className="w-full flex justify-center p-4">
  <span className="medium:text-2xl font-[600] text-center">{fundraiser.heading}</span>
        </div>
                <div className="w-full flex justify-center">    
            <div className="w-5/6 gap-8 medium:flex justify-center ">
                <div className="medium:w-2/3 flex flex-col">
               <img className="w-full" src={`/bg.png`} />


  <div className="flex space-x-12 p-2">
      {tabs.map((tab, idx) => {
        const isActive = idx === activeIndex;
        return (
          <button
            key={tab}
            onClick={() => setActiveIndex(idx)}
            className={`
              pb-1
              ${isActive 
                ? "border-b-2 border-background text-background font-[600]" 
                : "border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700"}
              focus:outline-none
            `}
          >
            {tab}
          </button>
        );
      })}
    </div>
    {activeIndex===0 && <div>
        <p>{fundraiser.description?.descriptionHeading}</p>
        </div>}
            {activeIndex===1 && <div>
  {fundraiser.description?.reportsImages?.map((img, index) => (
    <img
      key={index}
      src={`https://api-fundraiser.sadetechnosolutions.com/api/fund-raiser${img}`}
      alt={`Report ${index + 1}`}
      className="w-48 h-auto border rounded"
    />
  ))}
        </div>}
                </div>
<div className="medium:w-1/4 sticky top-0 overflow-y-auto shadow-lg p-4 bg-white">
<div className="flex flex-col gap-1 items-center py-2 w-full">
  <span className="text-background text-4xl font-[600]">1,10,000</span>
  <span className="text-gray-600">raised of 10,00,000</span>
</div>
<BasicProgressBar progress={11} />
  <button className="w-full p-2 h-12 rounded-md bg-background">
    <span className="text-white">Donate</span>
  </button>

  <div className="flex items-center gap-4 mt-4">
    <button className="w-full p-2 h-12 rounded-md bg-fb">
      <span className="text-white flex items-center gap-2 justify-center font-semibold">
        <Icon icon="ion:logo-facebook" width="25" height="25" /> Share
      </span>
    </button>
    <button className="w-full p-2 h-12 rounded-md bg-whatsapp">
      <span className="text-white flex items-center gap-2 justify-center font-semibold">
        <Icon icon="logos:whatsapp-icon" width="22" height="22" /> Share
      </span>
    </button>
  </div>
   <img className="h-72 w-full" src={`/qr.jpg`} />
</div>
                   </div>
    </div>
    </div>
    <Footer />
     </div>
    )
}

export default FundraiserInfo;