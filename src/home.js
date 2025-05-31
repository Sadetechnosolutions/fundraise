import react from "react";  
import Navbar from "./navbar";
import Section from "./section";
import FundraisingList from "./fundraisinglist";
import Footer from "./footer";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";

const Home = ()=>{

    const info = [
        {
            id:1,
            heading:'Awareness & Engagement',
            description:`To inform and engage potential donors and supporters about the charity's mission and the cause it supports. Utilize various channels such as social media.`

        },
        {
            id:2,
            heading:'Donation Collection',
            description:`Set up a secure and user-friendly online donation platform that accepts multiple payment methods and allows for both one-time and recurring donations.
`

        },
        {
            id:3,
            heading:'Impact and Accountability',
            description:`Allocate funds to specific projects and initiatives that align with the charity's mission, ensuring that resources are used efficiently and effectively.`

        }
    ]

    const Navigate = useNavigate()

    const openDonate = ()=>{
        Navigate('/Donate')
    }
    return(
<div>
    <Navbar />
    <div className="flex flex-col gap-10">
    <Section />
    <FundraisingList />
    
    <div className="flex flex-col medium:flex-row w-full items-center medium:p-16 px-6 gap-8 medium:gap-40">
        <img className="medium:h-[30rem] rounded-lg" src="volunteer.jpg" />
<div className="medium:w-1/3 flex flex-col gap-4">
  <span className="medium:text-4xl text-2xl font-[700] leading-snug">
    Join Hands to make sure that humanity still thrives in unity.
  </span>
  <span>
    Discover the inspirational stories of individuals and communities transformed their lives
  </span>
    <span>
    Our success stories highlight the real-life impact of your donations and the resilience of those we help
  </span >
<button className="flex items-center gap-2 bg-background rounded-full w-max py-2 px-4">
    <span className="text-white">Learn more</span><Icon icon="grommet-icons:link-next" width="16" height="16"  style={{color: '#fff'}} />
  </button>
</div>

                <div className="flex medium:w-1/3 flex-col gap-2">
{info.map((data)=>(
 <div key={data.id} className="flex shadow-lg p-4 rounded-md flex-col gap-2">
<span className="text-lg font-[600]">
{data.heading}
</span>
<span>
    {data.description}
</span>
          </div>
)    )     }
        </div>
    </div>
    <div className="medium:h-96 h-64 bg-background bg-opacity-95 flex flex-col gap-2 items-center justify-center">
        <span className="text-white font-[600] text-xs">"BE VOLUNTEERS"</span>
        <span className="text-white text-sm medium:text-2xl sl:text-4xl w-5/6 medium:w-1/3 text-center "> Join and help us build a better world a better future for all.</span>
        <button onClick={openDonate} className="bg-white rounded-md medium:font-[600] hover:text-background text-xs cursor-pointer p-2 medium:py-2 medium:px-4">Donate now</button>
    </div>
    <Footer />
    </div>
</div>
    )
}





export default Home;