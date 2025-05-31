import react from "react";

const Footer = ()=>{
    return(
        <div className="small:h-80 border-t border-2 w-full small:flex gap-10 py-4 medium:py-10 justify-between px-6 medium:px-16">
     <div className="flex flex-col gap-4 small:w-1/4">
        <img src="logo2.png" className="medium:w-12 w-8 h-10 medium:h-16" />
        <div>
            <p>This is a FundRaising website that lets you raise money for anything that matters to you. From personal causes and events to projects and more. We've helped people from all over the world raise millions online.</p>
        </div>
       </div>
<div className="flex flex-row flex-wrap mt-10 small:mt-0 small:flex-col small:flex-nowrap gap-2 w-full small:w-auto">
       <p>About</p>
       <p>FAQ</p>
       <p>Blog</p>
       <p>How to fundraise</p>
       <p>Team Fundraising</p>
       <p>Careers</p>
       </div>
       <div className="flex flex-row flex-wrap mt-10 small:mt-0 small:flex-col small:flex-nowrap gap-2 w-full small:w-auto">
       <p>About</p>
       <p>FAQ</p>
       <p>Blog</p>
       <p>How to fundraise</p>
       <p>Team Fundraising</p>
       <p>Careers</p>
       </div>
       <div className="flex flex-row flex-wrap mt-10 small:mt-0 small:flex-col small:flex-nowrap gap-2 w-full small:w-auto ">
       <p>About</p>
       <p>FAQ</p>
       <p>Blog</p>
       <p>How to fundraise</p>
       <p>Team Fundraising</p>
       <p>Careers</p>
       </div>

        </div>
    )
}

export default Footer;