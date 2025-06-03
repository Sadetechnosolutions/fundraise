import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Home from './home';
// import FundRaiserInfo from './fundraiserInfo';
import ScrollToTop from './scrolltotop';
import Signup from './signup';
import Signin from './signin';
import BasicDetails from './createFund1';
import MedicalDetails from './createFund2';
import BloodDonation from './blooddonation';

import Contactus from './contactus';
import Donate from './donate';
import FundraiserInfo from './fundraisinginfo';
import MyFundraisers from './myfundraisers';
import Errorpage from './errorpage';

import Request from './requests';
import Requestdetails from './requestdetails';
import Adminlogin from './adminlogin';
import Aboutus from './aboutus';

function App() {
  return (
    <Router>
      <ScrollToTop />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/fundraisers/:id/:name' element={<FundraiserInfo />} />
      <Route path='/Signup' element={<Signup />} />
      <Route path='/Login' element={<Signin />} />
      <Route path='/Basicdetails' element={<BasicDetails />} />
      <Route path='/Medicaldetails' element={<MedicalDetails />} />
            <Route path='/Blooddonation' element={<BloodDonation />} />
              {/* <Route path='/Blooddonors' element={<Blooddonors />} /> */}
                            <Route path='/myfundraisers' element={<MyFundraisers />} />
                    <Route path='/Contactus' element={<Contactus />} />
                                   <Route path='/Donate' element={<Donate />} />
                                   <Route path='*' element={<Errorpage />} />
                                                             <Route path='/request' element={<Request />} />
                                                                <Route path='/requestdetails/:id' element={<Requestdetails />} />
                                                                                           <Route path='/aboutus' element={<Aboutus />} />
                                                                                             <Route path='/admin/login' element={<Adminlogin />} />
    </Routes>
    </Router>
  );
}



export default App;
