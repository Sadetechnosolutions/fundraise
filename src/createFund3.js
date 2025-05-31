import React,{useState} from "react";
import Navbar from "./navbar";

const MedicalDescription = ()=>{
    
    return(
    <div>
    <Navbar />
<div className="w-full  bg-[radial-gradient(ellipse=_at_center,_rgba(235,55,63,0.15)_60%,_transparent_100%)] flex justify-center items-center">
<div className="medium:w-1/2 w-full medium:h-[calc(100vh-4rem)] flex items-center justify-center">
<div className="medium:h-[45rem] flex relative flex-col p-8 gap-4 rounded-lg w-full bg-white ">
    <div className="w-full flex justify-center items-center">
<div className="rounded-full w-20 h-20 medium:w-24 medium:h-24 bg-gray-300">

</div>
    </div>
 <div className="flex flex-col bg-white medium:flex-row medium:flex-wrap justify-between medium:gap-6 gap-2 w-full">

<div className="flex flex-col medium:w-2/5 gap-2">
<p className="text-sm medium:text-base">Name of the Cause</p>
<div className="p-5 rounded-md border-2 border-gray">
</div>
</div>
<div className="flex flex-col  medium:w-2/5 gap-2">
<p className="text-sm medium:text-base">Amount</p>
<div className="p-5 rounded-md border-2 border-gray">
</div>
</div>
<div className="flex flex-col  medium:w-2/5 gap-2">
<p className="text-sm medium:text-base">Hospital Name</p>
<div className="p-5 rounded-md border-2 border-gray">
</div>
</div>
<div className="flex flex-col  medium:w-2/5 gap-2">
<p className="text-sm medium:text-base">Hospital Location</p>
<div className="p-5 rounded-md border-2 border-gray">
</div>
</div>
</div>
<div className="flex flex-col gap-2">
<p className="text-sm medium:text-base">Medication</p>
<div className="p-5 rounded-md border-2 border-gray">
</div>
</div>
<div className="w-full absolute right-8 bottom-4">
<button className="bg-background absolute right-0 w-max rounded-full py-1 py-2 px-6"><span className="text-white text-sm medium:text-base">Next</span></button>
</div>
</div>
</div>
</div>
        </div>
    )
}

export default MedicalDescription;