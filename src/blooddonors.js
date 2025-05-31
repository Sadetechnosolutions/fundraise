import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Navbar from "./navbar";

const Blooddonors = ()=>{
    return(
        <div>
<Navbar />

<div className="w-screen h-48 medium:h-96 bg-gradient-to-tr from-blood-start to-blood-end ">
  <img
    className="w-full opacity-20 h-full object-cover"
    src="blooddonation.jfif"
    alt="Blood donation"
  />
</div>
<div className="w-full flex flex-col gap-8 p-4 medium:p-16">
<div className="flex w-full flex-col medium:flex-row justify-between gap-4">
  {/* First Dropdown */}
<div className="relative medium:w-1/3">
  <select className="h-12 w-full rounded-lg border-2 border-b px-3 pr-10 text-gray-700 appearance-none">
    <option value="">Select Location</option>
    <option value="x">Option X</option>
    <option value="y">Option Y</option>
    <option value="z">Option Z</option>
  </select>
  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
    ▼
  </div>
</div>

<div className="relative medium:w-1/3">
  <select className="h-12 w-full rounded-lg border-2 border-b px-3 pr-10 text-gray-700 appearance-none">
    <option value="">Select Blood Group</option>
    <option value="x">Option X</option>
    <option value="y">Option Y</option>
    <option value="z">Option Z</option>
  </select>
  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
    ▼
  </div>
</div>


  {/* Search Button */}
  <button className="h-12 medium:w-1/4 bg-background rounded-lg text-white transition">
    Search
  </button>
</div>
<div className="flex flex-col gap-2">
<div className="p-4 rounded-md gap-4 shadow-lg flex flex-col">
    <div className="flex justify-between">


    <div className="flex gap-3 items-center">
<img src="logoimg.jpg" className="w-8 h-11  rounded-full" />
<div className="flex flex-col">
<span className="medium:text-lg font-[600]">Jaffer</span>
<span className="text-sm medium:text-base">Chennai</span>
</div>

    </div>
    <div className="px-4 border-2 border-background inline-flex items-center gap-1 rounded-full h-8">
      <Icon
        icon="twemoji:drop-of-blood"
        className="w-4 h-4 block"
      />
      <span className="text-sm font-medium">A+ve</span>
    </div>

        </div>
        <div className="flex flex-col medium:flex-row medium:justify-between gap-2">
            <div className="flex flex-col gap-2">
<span className="flex items-center gap-2"><Icon icon="carbon:phone-filled" width="20" height="20"  style={{color: '#484848'}} /><span className="text-sm medium:text-base">8072303608</span></span>
<span className="flex items-center gap-2"><Icon icon="akar-icons:location" width="20" height="20"  style={{color: '#484848'}} /><span className="text-sm medium:text-base">Round East, Anna Nagar</span></span>
           </div>
           <button className="w-full medium:w-24 medium:h-10 h-10 rounded-md bg-active">
        <span className="text-white text-sm medium:text-base flex items-center justify-center gap-2"><Icon icon="logos:whatsapp-icon" width="20" height="20" />Share</span>
       </button>
       </div>

</div>
</div>
</div>
        </div>
    )
}

export default Blooddonors;