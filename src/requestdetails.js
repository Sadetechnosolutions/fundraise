import {useState,useEffect,useCallback} from "react";
import { useParams } from "react-router-dom";

const Requestdetails = ()=>{
    const {id} = useParams()
        const [funds,setFunds] = useState()
        const fetchRequest = useCallback(async () => {
    
        try {
          const token = localStorage.getItem('token');
            //  const userId = localStorage.getItem('UserId');
          if (!token) {
            console.error('No token found in localStorage');
            return;
          }
          const response = await fetch(`https://api-fundraiser.sadetechnosolutions.com/api/fund-raiser/get-detailed-information-of-fund-raiser/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
           setFunds(data)
          } else {
            console.error('Failed to fetch user Image:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching user Image:', error);
        }
      },[id]);

              const updateRequest = useCallback(async (status) => {
    
        try {
          const token = localStorage.getItem('token');
            //  const userId = localStorage.getItem('UserId');
          if (!token) {
            console.error('No token found in localStorage');
            return;
          }
          const response = await fetch(`https://api-fundraiser.sadetechnosolutions.com/api/fund-raiser/update-patient-details-status/${id}?status=${status}&message=YOURREQUEST`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
           setFunds(data)
          } else {
            console.error('Failed to fetch user Image:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching user Image:', error);
        }
      },[id]);
    
      useEffect(()=>{
        fetchRequest();
      },[fetchRequest])
    return(
        <div>

 <div className="max-w-4xl mx-auto p-6 bg-white h-full rounded-2xl shadow-lg space-y-6">
      {/* Patient Info */}



      <div className="flex items-center justify-center gap-6">
        <img
          src={`https://api-fundraiser.sadetechnosolutions.com/api/fund-raiser${funds?.basicInfo.patientImage}`}
          alt={`https://api-fundraiser.sadetechnosolutions.com/api/fund-raiser${funds?.basicInfo.patientImage}`}
          className="w-32 h-32 object-cover rounded-full border"
        />

      </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-2xl font-bold">{funds?.basicInfo.patientName}</h2>
          <p className="text-sm text-gray-600">
            Age: {funds?.basicInfo.patientAge} | Relation: {funds?.basicInfo.relationWithPatient}
          </p>
          <p className="text-sm text-gray-600">Address: {funds?.basicInfo.patientAddress}</p>
          <p className="text-sm text-gray-600">Contact: {funds?.basicInfo.contactDetails}</p>
        </div>
      {/* Cause Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Cause Information</h3>
        <p><strong>Cause:</strong> {funds?.cause.cause}</p>
        <p><strong>Amount Needed:</strong> ₹{funds?.cause.amount.toLocaleString()}</p>
        <p><strong>Hospital:</strong> {funds?.cause.hospitalName}</p>
        <p><strong>Hospital Address:</strong> {funds?.cause.hospitalAddress}</p>
        <p><strong>Hospital Contact:</strong> {funds?.cause.hospitalContactDetails}</p>
        <p><strong>Medications:</strong> {funds?.cause.medication}</p>
      </div>

      {/* Medical History */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">{funds?.description.descriptionHeading}</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{funds?.description.medicalHistoryAndDetails}</p>
      </div>

      {/* Reports */}
      <div>
        <h3 className="text-lg font-medium mb-2">Reports</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {funds?.description.reportsImages.map((img, idx) => (
            <img
              key={idx}
              src={`https://api-fundraiser.sadetechnosolutions.com/api/fund-raiser${img}`}
              alt={`https://api-fundraiser.sadetechnosolutions.com/api/fund-raiser${img}`}
              className="w-full h-40 object-cover rounded-lg border"
            />
          ))}
        </div>
      </div>


      {/* Created Date */}
      <div className="text- text-sm text-gray-500">
        Created At: {new Date(funds?.basicInfo.createdAt).toLocaleString()}
      </div>
      <div className="flex items-center gap-4  relative">
        <div className="absolute medium:bottom-4 right-2 flex items-center gap-4">

                              <button onClick={()=>{updateRequest('REJECTED')}} className="p-2 rounded-md bg-background">
            <span className="text-white">Delete</span>
        </button>

              <button onClick={()=>{updateRequest('APPROVED')}} className="p-2 rounded-md bg-cta">
            <span className="text-white">Accept</span>
        </button>
            
        </div>

      </div>

    </div>

        </div>
    )
}

export default Requestdetails;
