import react from "react";
import { NavLink } from "react-router-dom";

const Section = ()=>{
    return(
        <div style={{ height: 'calc(100vh - 6rem)' }} className="bg-background relative px-6 medium:px-16 py-6 medium:py-0 flex flex-col medium:flex-row gap-6 ">
          <div className="flex flex-col justify-center gap-6">      
<span className="medium:text-5xl text-lg text-white font-[600] medium:w-5/6">Make a Difference Today, Help Us Change Lives.</span>
<span className="text-white medium:text-2xl font-[500] medium:w-5/6">Your support empowers families, feeds children, and builds futures. Every donation counts.</span>
<div className="flex items-center gap-6">
<NavLink to='/donate'><button className="bg-white py-2 px-4 text-sm  medium:text-lg text-background font-[700] rounded-full w-max">Donate now</button></NavLink>
<button className="bg-background border-2 border-white py-2 px-4 text-sm medium:text-lg text-white font-[700] rounded-full w-max">Learn more</button>
</div>
  </div>
  <div>

  </div>
        </div>
    )
}

export default Section;