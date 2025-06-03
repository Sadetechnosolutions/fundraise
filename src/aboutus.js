
import Navbar from "./navbar";
import { Icon } from "@iconify/react/dist/iconify.js";

const Aboutus = ()=>{
    return(
        <div>
            <Navbar />
           <div className="flex flex-col w-full items-center gap-16 medium:gap-20">
     
        <div className="flex justify-center h-20 items-end">
             <span className="medium:text-5xl text-2xl font-[700]">Who We Are </span>

        </div>
              
                        <div className="w-5/6 medium:flex-row flex flex-col  gap-6 justify-between">
                        <div className="flex flex-col gap-8 medium:w-1/2">

                        <div className=" medium:w-5/6 flex gap-4">
                        <span className="h w-6 bg-background"></span>
                      <span className="text- medium:text-xl font-[600]">
                        <span className="text-2xl medium:text-3xl">W</span>e are a community of <span className="text-background">changemakers, dreamers <span className="text-black">and </span> 
everyday heroes</span> united by one goal to make help 
accessible to those who need it most.
                        </span>
                        </div>
                        <span className="medium:w-5/6 font-[600] text-lg">
                            At XYZ, we believe that compassion 
knows no boundaries. We are an online fundraising 
platform built to give voice to real stories, amplify urgent 
needs and inspire action that truly transforms lives. 
Whether it’s a child in need of life-saving treatment, a 
student striving for education or a family rebuilding after a 
disaster, we are here to make sure no one faces their 
struggles alone.
                        </span>
                        <span className="text-lg w-full font-[600]">
                            Our strength lies in the power of people. Every fundraiser 
hosted here is backed by a network of supporters who 
believe in empathy, solidarity and the potential of every 
human being to rise with the right support.
                        </span>
                        <span className="font-[600] text-lg">
                             We don’t just raise funds we build hope, restore dignity and 
create second chances.
                        </span>
                           </div>
                        <img  alt="" className="medium:w-1/2 medium:h-96" src='about.png' />
                        </div>



<div className="medium:flex-row flex flex-col gap-6 justify-between w-5/6 items-center">
  <div className="medium:w-1/2 flex flex-col gap-6 sl:gap-12">
                  <div className="sl:text-4xl text-2xl rounded-lg flex justify-center gap-2 items-center font-[630] text-center py-6 shadow-md">
        <span><Icon icon="lucide:target" className="medium:w-11 medium:h-11 h-7 w-7"  style={{color: '#EB373F'}} /></span>  
        <span>Our Mission</span>
      </div>
      <div className="flex items-start gap-2">
<img  alt="" className="w-7 h-7" src="bulletin.png" />
        <span className="sl:text-xl text-gray-700 font-[600] leading-relaxed">
 Our mission is simple yet powerful: To empower change, one donation at a time.
        </span>
      </div>
      <div className="flex items-start gap-2">
<img  alt="" className="w-7 h-7" src="bulletin.png" />
                <span className="sl:text-xl text-gray-700 font-[600] leading-relaxed">
    We are committed to transparency, accountability, and the ethical handling of all contributions.
        </span>
      </div>
      <div className="flex items-start gap-2">
<img  alt="" className="w-7 h-7" src="bulletin.png" />
                <p className="sl:text-xl text-gray-700 font-[600] leading-relaxed">
          Every rupee donated goes directly towards improving lives and creating a lasting impact in the communities we serve.
        </p>
      </div>


  </div>

  <div className="medium:w-1/3">

        <img  alt="" className="w-full " src="about.jpg" />
  </div>


</div>

<div className="medium:flex-row flex flex-col px-8 justify-between medium:w-5/6 items-center">
  <div className="medium:w-1/3">
        <img  alt="" className="" src="about.jpg" />
  </div>

  <div className="medium:w-1/2 flex flex-col gap-6 sl:gap-12">
                  <div className="sl:text-4xl text-2xl rounded-lg flex gap-2 justify-center items-center font-[630] text-center py-6 shadow-md">
                    <Icon icon="fluent:people-community-20-filled" className="medium:w-11 medium:h-11 h-7 w-7" style={{color: '#EB373F'}} />
        Who We Are
      </div>
      <div className="flex itr gap-2">
        <img alt="" className="w-7 h-7" src="bulletin.png" />
        <p className="sl:text-xl text-gray-700 font-[600] leading-relaxed">
        We started this platform with a simple yet powerful belief: 
no one should face life’s toughest battles alone
        </p>
      </div>

      <div className="flex items- gap-2">
          <img  alt="" className="w-7 h-7" src="bulletin.png" />
                          <p className="sl:text-xl text-gray-700 font-[600] leading-relaxed">
        We started this platform with a simple yet powerful belief: 
no one should face life’s toughest battles alone
        </p>
</div>

      <div className="flex items- gap-2">
          <img  alt="" className="w-7 h-7" src="bulletin.png" />
                <p className="sl:text-xl text-gray-700 font-[600] leading-relaxed">
        We started this platform with a simple yet powerful belief: 
no one should face life’s toughest battles alone
        </p>
</div>

  </div>

</div>

<div className="w-5/6 medium:flex-row flex flex-col justify-center">
  <div className="flex flex-col gap-4 w-full">
    <div className="medium:flex-row flex flex-col   items-stretch gap-16 justify-between">
      {/* Title */}
      <div className="medium:text-4xl text-lg w-full med:w-[calc(46%-0.5rem)] bg-background text-white rounded-lg flex justify-center items-center font-[630] text-center py-6 shadow-md">
        Contact Us
      </div>

      {/* Card 1 */}
      <div className="relative w-full med:w-[calc(46%-0.5rem)] bg-[#F4F4F4] rounded-xl pt-14 p-4 medium:h-36 flex flex-col items-center justify-start text-center gap-4 shadow-md border border-gray-200">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-background p-4 rounded-full shadow-md border-4 border-white">
<Icon icon="material-symbols:mail" width="24" height="24"  style={{color: '#fff'}} />
        </div>
        <p className="text-base text-gray-700 font-[600] leading-relaxed">
your.email@example.com
        </p>
      </div>

      {/* Card 2 */}
      <div className="relative w-full med:w-[calc(46%-0.5rem)] bg-[#F4F4F4] rounded-xl pt-14 p-4 medium:h-36 flex flex-col items-center justify-start text-center gap-4 shadow-md border border-gray-200">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-background p-4 rounded-full shadow-md border-4 border-white">
      <Icon icon="iconoir:phone-solid" width="24" height="24"  style={{color:'#fff'}} />
        </div>
        <p className="text-base text-gray-700 font-[600] leading-relaxed">
        +91-XXXXXXXXXX
        </p>
      </div>

      {/* Card 3 */}
      <div className="relative w-full med:w-[calc(46%-0.5rem)] bg-[#F4F4F4] rounded-xl pt-14 p-4 medium:h-36 flex flex-col items-center justify-start text-center gap-4 shadow-md border border-gray-200">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-background p-4 rounded-full shadow-md border-4 border-white">
      <Icon icon="weui:location-filled" width="24" height="24"  style={{color: '#fff'}} />
        </div>
        <p className="text-base text-gray-700 font-[600] leading-relaxed">
Your Office Address
        </p>
      </div>
    </div>
  </div>
</div>






                                              

                                                
                               </div> 
      
        </div>

    )
}

export default Aboutus;