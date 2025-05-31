import Navbar from "./navbar";
import React,{useState, useEffect} from "react";


const Contactus = ()=>{
      const [formData, setFormData] = useState({
    subject: '',
    query: '',
    email: '',
  });

    useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you can send data to a backend or handle it as needed
  };

    return(
        <div className="bg-">
        <Navbar />
        <div className="flex full-vh medium:[height:calc(100vh-4rem)]">
        <div className="hidden medium:flex w-1/2 rounded-tr-[4rem] rounded-br-[4rem] bg-background">

        </div>
        <div className="flex w-full medium:w-1/2 p-4 bg-background medium:bg-white items-center justify-center">
        <div className="p-4 w-full medium:w-5/6 bg-white rounded-md ">
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col medium:gap-4 w-full">
        <span className="medium:text-3xl text-lg medium:font-[600]">Send us Message</span>

        <div className="flex flex-col medium:gap-2">
          <label className="block medium:font-[600] text-gray-700 mb-1">Subject</label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border-b border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a subject</option>
            <option value="feedback">Feedback</option>
            <option value="support">Support</option>
            <option value="general">General Inquiry</option>
          </select>
        </div>

        <div className="flex flex-col medium:gap-2">
          <label className="block text-gray-700 font-[600] mb-1">Your Query</label>
          <textarea
            name="query"
            value={formData.query}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded medium:h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message here..."
            required
          />
        </div>

        <div className="flex flex-col medium:gap-2">
          <label className="block medium:font-[600] text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border-b border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
            required
          />
        </div>

        <button
          type="submit"
          className="w-max w-40 hover:bg-opacity-90 bg-background text-white p-2 medium:p-2.5 rounded-md transition"
        >
          Send Message
        </button>
      </form>
        </div>
        </div>
        </div>
        </div>
    )
}

export default Contactus;