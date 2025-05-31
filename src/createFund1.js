import React, { useState,useEffect,useRef } from "react";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSelector,useDispatch } from "react-redux";
import { setFormData } from "./store/slices/formslice";

const BasicDetails = () => {

    const dispatch = useDispatch()
  const navigate = useNavigate();
const [screenSize, setScreenSize] = useState({
  width: window.innerWidth,
  height: window.innerHeight,
});

  const handleChange = (e) => {
  const { name, value } = e.target;
  dispatch(setFormData({ [name]: value }));
};

  const form = useSelector((state)=>state.form)

  const openMedical = ()=>{
    navigate('/Medicaldetails')
  }

    const openPersonal = ()=>{
    navigate('/Basicdetails')
  }

  const openNextPage = () => {
    navigate('/Medicaldetails');
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

const fileInputRef = useRef(null);
const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    const previewUrl = URL.createObjectURL(file); // Blob URL for preview only
    dispatch(setFormData({ profileimg: { file, url: previewUrl } }));
  }
};



const triggerFileInput = () => {
  fileInputRef.current.click();
};
const image = useSelector((state) => state.form.profileimg?.url);


useEffect(() => {
  return () => {
    if (form.profileimg?.url) {
      URL.revokeObjectURL(form.profileimg.url);
    }
  };
}, [form.profileimg?.url]);


  return (
    <div>
      <Navbar />
      <div className="w-full  flex flex-col justify-center items-center">
    
        <div className="medium:w-1/2 w-full medium:h-[calc(100vh-4rem)] flex flex-col items-center medium:p-8 -center">
       <div className="hidden md:flex items-center w-[30rem] rounded-full gap-4 border-2 ">

 
        <div onClick={openPersonal} className="flex cursor-pointer rounded-full px-2 w-64 flex justify-center bg-background flex items-center">
        <Icon icon="mingcute:user-info-fill" width="25" height="25"  style={{color: '#fff'}} />
              <span className="p-2 text-white font-[600]">Fundraiser Information</span>
        </div>
                <div onClick={openMedical} className="flex  flex cursor-pointer items-center">
               <Icon icon="ri:health-book-fill" width="24" height="24"  style={{color: 'gray'}} />
              <span className="p-2 text-gray font-[600]">Medical Information</span>
        </div>
      </div>
          <div className="medium:h-[45rem] h-[calc(65vh)] flex relative flex-col p-2 medium:p-8 gap-4 medium:gap-10 rounded-lg w-full bg-">
            <div className="w-full flex justify-center">
   
                    <div className='flex relative  w-max items-center'>
                        <div>
                            <img className={`w-28 border-4 border-white ${image?'':'bg-gray-200'} h-28 rounded-full`} alt='' src={image} />
                        </div>
                        <div className='absolute justify-end bottom-0 right-0 flex text-cta hover:bg-cta hover:text-white border border-cta cursor-pointer items-center justify-center py-1.5 w-min px-1.5 rounded-full bg-white'>
                            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="profile-photo-input" />
                            <label htmlFor="profile-photo-input" className='cursor-pointer'>
                                <Icon icon="mdi:camera" width="1.2em" height="1.2em" />
                            </label>
                        </div>
                    </div>
            
            </div>
     
            <div className="flex flex-col bg-white p-4 medium:flex-row medium:flex-wrap justify-between medium:gap-10 gap-4 w-full">
{[
  { label: "Name", name: "name" },
  { label: "Name of the Cause", name: "cause" },
  { label: "Relation", name: "relation" },
  { label: "Age", name: "age" },
  { label: "Location", name: "location" }
].map((field) => (
  <div key={field.name} className="flex flex-col w-full">
 {field.name === "cause" ? (
      <select
        name="cause"
        value={form.cause}
        onChange={handleChange}
        className="p-3 border-b-2 border-gray-200 focus:outline-none focus:border-background transition-colors bg-white"
      >
        <option value="" disabled>
          Select Cause
        </option>
        <option value="Medical  ">Medical</option>
        <option value="Education">Education</option>
        <option value="Memorial">Memorial</option>
        <option value="Children">Children</option>
            <option value="Women">Women</option>
                       <option value="Sports">Sports</option>
                <option value="Elderly">Elderly</option>

         
        <option value="Other">Other</option>
      </select>
    ) : (
      <input
        type="text"
        name={field.name}
        value={form[field.name]}
        onChange={handleChange}
        placeholder={field.label}
        className="p-3 border-b-2 border-gray-200 focus:outline-none focus:border-background transition-colors"
      />
    )}
  </div>
))}

         <div className="flex flex-col w-full gap-2">
              {/* <p className="text-sm medium:text-base">Phone</p> */}
              <input
                type="number"
                name="phone"
                value={form.phone}
                maxLength={10}
                placeholder="Phone"
                onChange={handleChange}
           className="p-3 border-b-2  border-gray-200 focus:outline-none focus:border-background transition-colors"

              />
            </div>
            </div>

   

            <div className="w-full absolute p-4 right-8 bottom-0">
              <button
                onClick={openNextPage}
                className="bg-background absolute right-0 w-max rounded-full py-2 px-6"
              >
                <span className="text-white text-sm medium:text-base">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;
