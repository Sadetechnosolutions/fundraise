
import { NavLink } from "react-router-dom";

const Section = ()=>{
    return(
        <div style={{ height: 'calc(100vh - 6rem)' }} className="bg-background relative px-6 medium:px-16 py-6 medium:py-0 flex flex-col medium:flex-row gap-6 ">
          <div className="flex flex-col justify-center gap-6 sl:w-1/2">      
<span className="sl:text-5xl med:text-4xl text-xl text-white font-[600]">Make a Difference Today, Help Us Change Lives.</span>
<span className="text-white sl:text-2xl text-base font-[500] ">Your support empowers families, feeds children, and builds futures. Every donation counts.</span>
<div className="flex items-center gap-6">
<NavLink to='/donate'><button className="bg-white py-2 px-4 text-sm  sl:text-lg text-background font-[700] rounded-full w-max">Donate now</button></NavLink>
<button className="bg-background border-2 border-white py-2 px-4 text-sm sl:text-lg text-white font-[700] rounded-full w-max">Learn more</button>
</div>
  </div>
  <div>

  </div>
        </div>
    )
}

export default Section;