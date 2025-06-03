import React,{useState} from "react";
import Navbar from "./navbar";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { setFormData,resetFormData } from "./store/slices/formslice";

const MedicalDetails = ()=>{
const dispatch = useDispatch()
  const navigate = useNavigate()
 const form = useSelector((state)=>state.form)
const [images, setImages] = useState([]);
const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  const newImages = files.map(file => ({
    id: Date.now() + Math.random(),   // unique ID
    url: URL.createObjectURL(file),   // for preview
    file: file                        // actual File object for uploading
  }));
  setImages(prev => [...prev, ...newImages]);
};


    const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

    const openMedical = ()=>{
    navigate('/Medicaldetails')
  }

    const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ [name]: value }));
  };

    const openPersonal = ()=>{
    navigate('/Basicdetails')
  }
const image = useSelector((state) => state.form.profileimg?.file);
      const formsubmission = async () => {
        const formDataObj = new FormData();
    
        // formDataObj.append('portfolioAndWorkSample', formData.Portfolio.map((file) => file.name).join(', '));
    
        const additionalInfoJson = {
    "basicInfo": {
        "userId": 3,
        "patientName": "saran Doe",
        "patientAge": "35",
        "relationWithPatient": "Self",
        "patientAddress": "123 Main St",
        "contactDetails": "555-1234"
    },
    "cause": {
        "cause": "Heart Surgery",
        "amount": 5000.00,
        "hospitalName": "City Hospital",
        "hospitalAddress": "456 Health Ave",
        "hospitalContactDetails": "555-5678",
        "medication": "Various medications"
    },
    "description": {
        "descriptionHeading": "Critical Heart Condition",
        "medicalHistoryAndDetails": "Patient has history of heart problems..."
    }
}
        formDataObj.append('patientImage', image);

images.forEach((img) => {
  formDataObj.append('reportsImages', img.file);
});

        formDataObj.append('patientRequestDto', JSON.stringify(additionalInfoJson));


        const token = localStorage.getItem('token');
        try {
            // Send the request with the 'multipart/form-data' content type
            const response = await fetch(`https://api-fundraiser.sadetechnosolutions.com/api/fund-raiser/patient-info`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataObj,
            });
    
            if (response.ok) {
                console.log('Request was successful');
                resetFormData();
            } else {
                console.log('Request failed');
                console.log(image)
                console.log(token)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return(
    <div>
    <Navbar />
<div className="w-full  bg-[radial-gradient(ellipse=_at_center,_rgba(235,55,63,0.15)_60%,_transparent_100%)] flex justify-center items-center">
<div className="medium:w-1/2 w-full medium:h-[calc(100vh-4rem)] flex items- justify-center">
<div className="medium:h-[45rem] flex relative flex-col medium:p-8 p-6 gap-4 rounded-lg w-full bg-white ">
    {/* <div className="w-full flex justify-center items-center">
<div className="rounded-full w-20 h-20 medium:w-24 medium:h-24 bg-gray-300">

</div>
    </div> */}
    <div className="w-full hidden medium:flex justify-center">
           <div className="flex items-center w-[30rem] rounded-full gap- border-2 ">
    
     
            <div onClick={openPersonal} className="flex  cursor-pointer rounded-full px-2 w-80 flex justify-center flex items-center">
            <Icon icon="mingcute:user-info-fill" width="25" height="25"  style={{color: 'gray'}} />
                  <span className="p-2 text-gray font-[600]">Fundraiser Information</span>
            </div>
                    <div onClick={openMedical} className="flex flex cursor-pointer items-center w-80 rounded-full justify-center bg-background">
                   <Icon icon="ri:health-book-fill" width="24" height="24"  style={{color: 'fff'}} />
                  <span className="p-2 text-white font-[600]">Medical Information</span>
            </div>
          </div>
    </div>

 <div className="flex flex-col bg-white medium:flex-row medium:flex-wrap justify-between medium:gap-6 gap-2 w-full">

      <div className="relative w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">₹</span>
        <input
          type="text"
          name='amount'
          value={form.amount}
          onChange={handleChange}
          // placeholder={field.label}
             className="px-6 border-b-2 w-full border-gray-300 focus:outline-none focus:border-background transition-colors"
        />
      </div>


</div>


<div className="flex flex-col gap-4">
  <div className="flex flex-col medium:w-2/ gap-2">

    <input
      type="text"
      name="hospitalName"
                value={form.hospitalName}
          onChange={handleChange}
      placeholder="Enter hospital name"
      className="p-3 border-b-2 border-gray-300 focus:outline-none focus:border-background transition-colors"
    />
  </div>

  <div className="flex flex-col medium:w-2/ gap-2">

    <input
      type="text"
      name="hospitalLocation"
                value={form.hospitalAddress}
          onChange={handleChange}
      placeholder="Enter hospital location"
      className="p-3 border-b-2 border-gray-300 focus:outline-none focus:border-background transition-colors"
    />
  </div>

  <div className="flex flex-col medium:w-2/ gap-2">

    <input
      type="text"
      name="medication"
      placeholder="Enter medication"
                value={form.medication}
          onChange={handleChange}
      className="p-3 border-b-2 border-gray-300 focus:outline-none focus:border-background transition-colors"
    />
  </div>

  <div className="flex flex-col w-full gap-2">

    <textarea
      name="description"
      placeholder="Describe your condition or treatment"
                value={form.medicalHistoryAndDetails}
          onChange={handleChange}
      className="medium:h-44 h-28 p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:border-background transition-colors resize-none"
    />
  </div>
</div>

   <div className="flex flex-col gap-2">

<div className="flex items-center gap-2">


      {/* Upload box */}
      <label className="medium:h-36 medium:w-40 h-24 w-24 cursor-pointer rounded-md border-2 border-dashed flex flex-col gap-2 items-center justify-center border-background relative overflow-hidden">
        <Icon icon="akar-icons:cloud-upload" width="40" height="40" className="text-[#EB373F]" />
        <span className="py-1 px-2 rounded-md bg-background text-white text-sm">Upload</span>
        <input
          type="file"
          multiple
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleImageChange}
        />
      </label>

      {/* Image preview grid */}
      <div className="flex flex-wrap gap-2">
{images.map((img) => (
<div key={img.id} className="relative w-40 h-36 group overflow-hidden rounded-md border">
  <img
    src={img.url}
    alt={`upload-${img.id}`}
    className="w-full h-full object-cover transition duration-200"
  />
  
  {/* Black overlay on hover */}
  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition duration-200" />

  {/* Delete button */}
  <button
    onClick={() => removeImage(img.id)}
    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-10"
  >
    ✕
  </button>
</div>

))}
      </div>
      </div>
    </div>

<div className="flex flex-col gap-2">

</div>
<div className="w-full absolute right-8 bottom-4">
<button onClick={formsubmission} className="bg-background absolute right-0 w-max rounded-full py-1 py-2 px-6"><span className="text-white text-sm font-[600] medium:text-base">Submit</span></button>
</div>
</div>
</div>
</div>
        </div>
    )
}

export default MedicalDetails