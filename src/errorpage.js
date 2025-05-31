import React from "react";
import { NavLink } from "react-router-dom";

const Errorpage = ()=>{
    return(
<div className="h-screen flex flex-col bg-white gap-6 items-center justify-center">
    <div className="flex flex-col items-center">
<span className="font-[800] text- text-[14rem] leading-none inline-block overflow-hidden">
  4<span className="text-background">0</span>4
</span>

<span className="text w-72 text-center">Page not found, We are unable to find the page you are looking for</span>

    </div>
<NavLink to='/'>
<button className="py-2 px-4 font-[500] text-white rounded-full bg-background border-2 border text-sm">Return to Home</button>

</NavLink>
</div>
    )

}

export default Errorpage;