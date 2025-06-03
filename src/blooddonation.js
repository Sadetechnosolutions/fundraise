import React,{useState} from "react";
import Navbar from "./navbar";
import { useSelector,useDispatch } from 'react-redux';
import { setFormData,resetFormData } from "./store/slices/bloodform";
import { Icon } from "@iconify/react/dist/iconify.js";
import ReactConfetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size'; // For responsive confetti
import { useNavigate } from "react-router-dom";

const BloodDonation = ()=>{
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false);
const window = useWindowSize();
const dispatch = useDispatch();
const blooddonorform = useSelector((state)=>state.blooddonorform)

const handleChange = (e) => {
  const { name, value } = e.target;
  dispatch(setFormData({ [name]: value }));
};


const formsubmission = async (e) => {
  e.preventDefault(); // Prevent default form submission

  const token = localStorage.getItem('token');
  const payload = {
    userId: blooddonorform.userId ? blooddonorform.userId : null,
    fullName: blooddonorform.fullName,
    phoneNumber: blooddonorform.phoneNumber,
    email: blooddonorform.email,
    bloodGroup: blooddonorform.bloodGroup,
    alternateMobileNumber: blooddonorform.alternateMobileNumber,
    country: blooddonorform.country,
    state: blooddonorform.state,
    district: blooddonorform.district,
    city: blooddonorform.city,
    townOrVillage: blooddonorform.townOrVillage,
    pinCode: blooddonorform.pinCode,
  };

  try {
    const response = await fetch(`https://api-fundraiser.sadetechnosolutions.com/api/fund-raiser/add-donor-details`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' // You were missing this
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log('Request was successful');
      dispatch(resetFormData());
        setShowPopup(true);
          setTimeout(() => {
    navigate('/');
  }, 4000);
    } else {
      console.log('Request failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

    return(
      <div>
<Navbar />
<div className="medium:h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-tr from-blood-stato-blood-end ">
  <div className="flex medium:rounded-2xl medium:flex-row bg-white w-full medium:w-2/3">

<form onSubmit={formsubmission} className="w-full p-8 rounded-sm medium:rounded-lg space-y-6">
  {/* Form Fields Container */}
  <span className="medium:text-3xl text-xl font-[600] text-center py-4">Blood Donor Information</span>
  <div className="flex flex-col medium:flex-row medium:flex-wrap gap-x-4 gap-y-6 justify-between items-end">

    <div className="w-full medium:w-2/5">
    <label className="block text-sm font-medium text-gray-700">Full Name <span className="text-background">*</span></label>
    <input required
     name="fullName" 
      type="text"
      onChange={handleChange}
        value={blooddonorform?.fullName || ''}
      className="w-full border-b  focus:outline-none border-gray-300 rounded- px-4 py-2 text-gray-700"
      placeholder="Your Name"
    />
  </div>

  <div className="w-full medium:w-2/5">
    <label className="block text-sm font-medium text-gray-700">Blood Group <span className="text-background">*</span></label>
<select
  name="bloodGroup"
  value={blooddonorform?.bloodGroup || ''}
  onChange={handleChange}
  className="w-full border-b border-gray-300 rounded- px-4 py-2 text-gray-700"
>
      
      <option value="">Select Blood Group</option>
      <option value="A-">A-</option>
      <option value="A+">A+</option>
            <option value="A1+">A1+</option>
                  <option value="A1B">A1B</option>
                        <option value="A1B+">A1B+</option>
                              <option value="A2-">A2-</option>
                                    <option value="A2+">A2+</option>
                                          <option value="A2B">A2B</option>
                                                <option value="A2B+">A2B+</option>
                                                      <option value="AB-">AB-</option>
                                                            <option value="AB+">AB+</option>
                                                                  <option value="B-">B-</option>
      <option value="B+">B+</option>
     <option value="HH (Bombay Blood Group)">HH(Bombay Blood Group)</option>
          <option value="INRA">INRA</option>
      <option value="O-">O-</option>
      <option value="O+">O+</option>
    </select>
  </div>

  <div className="w-full medium:w-2/5">
    <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-background">*</span></label>
    <input
     name="state" 
      type="text"
        value={blooddonorform?.state || ''}
      onChange={handleChange}
      className="w-full border-b  focus:outline-none border-gray-300 rounded- px-4 py-2 text-gray-700"
      placeholder="Your State"
    />
  </div>

  <div className="w-full medium:w-2/5">
    <label className="block text-sm font-medium text-gray-700 mb-1">District <span className="text-background">*</span></label>
    <input
     name="district" 
      type="text"
            onChange={handleChange}
        value={blooddonorform?.district || ''}
      className="w-full border-b  focus:outline-none border-gray-300 rounded px-4 py-2 text-gray-700"
      placeholder="District name"
    />
  </div>
    <div className="w-full medium:w-2/5">
    <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-background">*</span></label>
    <input
     name="city" 
      type="text"
            onChange={handleChange}
        value={blooddonorform?.city || ''}
      className="w-full border-b  focus:outline-none border-gray-300 rounded- px-4 py-2 text-gray-700"
      placeholder="City name"
    />
  </div>
    <div className="w-full medium:w-2/5">
    <label className="block text-sm font-medium text-gray-700 mb-1">Town/Village <span className="text-background">*</span> </label>
    <input
     name="townOrVillage" 
      type="tel"
      onChange={handleChange}
        value={blooddonorform?.townOrVillage || ''}
      maxLength={10}
      className="w-full border-b border-gray-300  focus:outline-none rounded px-4 py-2 text-gray-700"
      placeholder="Town or Village"
    />
  </div>

    <div className="w-full medium:w-2/5">
    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode <span className="text-background">*</span></label>
    <input
     name="pinCode" 
      type="text"
      onChange={handleChange}
        value={blooddonorform?.pinCode || ''}
      maxLength={6}
      className="w-full border-b  focus:outline-none border-gray-300 rounded px-4 py-2 text-gray-700"
      placeholder="6-digit PIN"
    />
  </div>

      <div className="w-full medium:w-2/5">
    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-background">*</span></label>
    <input
     name="email" 
     onChange={handleChange}
      type="text"
        value={blooddonorform?.email || ''}
      className="w-full border-b  focus:outline-none border-gray-300 rounded- px-4 py-2 text-gray-700"
      placeholder="City name"
    />
  </div>

    <div className="w-full medium:w-2/5">
    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-background">*</span></label>
    <input
     name="phoneNumber" 
      type="tel"
      onChange={handleChange}
        value={blooddonorform?.phoneNumber || ''}
      maxLength={10}
      className="w-full border-b border-gray-300  focus:outline-none rounded px-4 py-2 text-gray-700"
      placeholder="10-digit number"
    />
  </div>

  <div className="w-full medium:w-2/5">
    <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone Number</label>
    <input
     name="alternateMobileNumber" 
     onChange={handleChange}
      value={blooddonorform?.alternateMobileNumber || ''}
      type="tel"
      maxLength={10}
      className="w-full border-b border-gray-300  focus:outline-none rounded px-4 py-2 text-gray-700"
      placeholder="10-digit number"
    />
  </div>

  <div className="w-full medium:w-2/5">
    <label className="block text-sm font-medium text-gray-700 mb-1">Country <span className="text-background">*</span></label>
    <input
     name="country" 
     onChange={handleChange}
      value={blooddonorform?.country || ''}
      type="tel"
      maxLength={10}
      className="w-full border-b border-gray-300  focus:outline-none rounded px-4 py-2 text-gray-700"
      placeholder="Country name"
    />
  </div>
<div className="relative h-11">
  <button
    type="submit"
    className="max-w bg-background absolute right-0 hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-lg transition"
  >
    Submit
  </button>
</div>
{showPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="relative bg-background w-1/4 flex flex-col gap-4 items-center justify-center h-96 rounded-lg shadow-lg text-center">
      <ReactConfetti
        width={150}
        height={window.innerHeight}
        numberOfPieces={80}
        recycle={false}
      />

      <div className="flex w-full justify-center">
        <div className="bg-cta rounded-full">
          <Icon icon="mdi:tick-circle" width="75" height="75" style={{ color: '#fff' }} />
        </div>
      </div>

      <p className="text-2xl text-white font-[600]">You are a Blood Donor!</p>
    </div>
  </div>
)}

</div>

</form>
  </div>
</div>
      </div>
    )
}

export default BloodDonation;