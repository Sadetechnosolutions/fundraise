import react,{useState,useEffect} from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { NavLink } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";

const Donate = ()=>{
    const [progress, setProgress] = useState('40')
    const [active,setActive]=useState(1)
const [activeCategoryId, setActiveCategoryId] = useState(null);

const selectedCategoryName = activeCategoryId === null 
  ? 'All' 
  : categories.find(cat => cat.id === activeCategoryId)?.name || 'All';
const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

    const handleActiveCategory = (id)=>{
        // If the clicked category is already active, deactivate it; otherwise, activate it.
        setActiveCategoryId(activeCategoryId === id ? null : id);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
const [screenSize, setScreenSize] = useState({
  width: window.innerWidth,
  height: window.innerHeight,
});

useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest('.category-dropdown')) {
      setIsCategoryDropdownOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);


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

    const categories = [
        {
            id:1,
            categoryId:1,
            name:'Medical',
            icon: { inactive: <Icon icon="mdi:medical-bag" width="24" height="24"  style={{color: '#464343'}} />, active: <Icon icon="mdi:medical-bag" width="24" height="24"  style={{color: '#fff'}} /> }
        },        {
            id:2,
                    categoryId:2,
            name:'Education',
            icon: { inactive: <Icon icon="tdesign:education-filled" width="24" height="24"  style={{color: '#464343'}} />, active: <Icon icon="tdesign:education-filled" width="24" height="24"  style={{color: '#fff'}} /> }
        },        {
            id:3,
                    categoryId:3,
            name:'Memorial',
            icon: { inactive: <Icon icon="game-icons:martyr-memorial" width="24" height="24"  style={{color: '#464343'}} />, active:<Icon icon="game-icons:martyr-memorial" width="24" height="24"  style={{color: '#fff'}} />}
        },        {
            id:4,
                    categoryId:4,
            name:'Children',
            icon: { inactive: <Icon icon="healthicons:boy-0105y" width="24" height="24"  style={{color:' #464343'}} />, active: <Icon icon="healthicons:boy-0105y" width="24" height="24"  style={{color: '#fff'}} /> }
        },        {
            id:5,
                    categoryId:5,
            name:'Women',
            icon: { inactive: <Icon icon="fluent-emoji-high-contrast:woman-student" width="24" height="24"  style={{color:' #464343'}} />, active: <Icon icon="fluent-emoji-high-contrast:woman-student" width="24" height="24"  style={{color: '#fff'}} /> }
        },        {
            id:6,
                    categoryId:6,
            name:'Sports',
            icon: { inactive: <Icon icon="fluent:sport-basketball-20-filled" width="24" height="24"  style={{color: '#464343'}} />, active: <Icon icon="fluent:sport-basketball-20-filled" width="24" height="24"  style={{color: '#fff'}} /> }
        },        {
            id:7,
                    categoryId:7,
            name:'Elderly',
            icon: { inactive: <Icon icon="ic:round-elderly" width="24" height="24"  style={{color: '#464343'}} />, active: <Icon icon="ic:round-elderly" width="24" height="24"  style={{color: '#fff'}} /> }
        },

    ]

    const BasicProgressBar = ({ progress }) => {
        return (
          <div className="w-full max-w-md mx-auto">
            <div className="bg-gray-200 rounded-full h-2 w-full relative">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
              <span className="absolute bottom-[-1.5rem] right-0 text-sm text-black">
                {progress}%
              </span>
              <span className="absolute bottom-[-1.5rem] left-0 text-sm text-black">
               27 days left
              </span>
            </div>
          </div>
        );
      };

      const fundDetails = [{
        id:1,
        categoryId:1,
        topic:'topic',
        heading:'Help Mozhivalan fight Leukemia, needs Bone Marrow Transplant',
        description:'Hello, my name is Namrata and this fund raiser has been created to support my son and',
        amount:'Raised 1,90,000',
        supporters:'43 supporters',
        fundraiser:'Sharan',
        percentage:40
      },
      {
        id:2,
                categoryId:2,
        topic:'topic',
        heading:'Help Mozhivalan fight Leukemia, needs Bone Marrow Transplant',
        description:'Hello, my name is Namrata and this fund raiser has been created to support my son and',
        amount:'Raised 1,90,000',
        supporters:'43 supporters',
        fundraiser:'Anitha',
        percentage:21
      },
      {
        id:3,
                categoryId:3,
        topic:'topic',
        heading:'Help Mozhivalan fight Leukemia, needs Bone Marrow Transplant',
        description:'Hello, my name is Namrata and this fund raiser has been created to support my son and',
        amount:'Raised 1,90,000',
        supporters:'43 supporters',
        fundraiser:'Vikash',
        percentage:68
      },
      {
        id:4,
                categoryId:4,
        topic:'topic',
        heading:'Help Mozhivalan fight Leukemia, needs Bone Marrow Transplant',
        description:'Hello, my name is Namrata and this fund raiser has been created to support my son and',
        amount:'Raised 1,90,000',
        supporters:'43 supporters',
        fundraiser:'Tharun',
        percentage:7
      },
      {
        id:5,
                categoryId:5,
        topic:'topic',
        heading:'Help Mozhivalan fight Leukemia, needs Bone Marrow Transplant',
        description:'Hello, my name is Namrata and this fund raiser has been created to support my son and',
        amount:'Raised 1,90,000',
        supporters:'43 supporters',
        fundraiser:'Megha',
        percentage:27
      },
      {
        id:6,
                categoryId:6,
        topic:'topic',
        heading:'Help Mozhivalan fight Leukemia, needs Bone Marrow Transplant',
        description:'Hello, my name is Namrata and this fund raiser has been created to support my son and',
        amount:'Raised 1,90,000',
        supporters:'43 supporters',
        fundraiser:'Sharan',
        percentage:94
      },
]

    return(
        <div>
<Navbar />
        <div className="w-full items-center justify-center p-6 medium:p-16 flex gap-10">   
  <div className="flex sl:w-5/6 w-full items-center relative flex-col gap-6">
      <div className="h-10 border-2 border-gray-200 w-full medium:w-5/6 relative  bg-white rounded-lg">
        <input placeholder="Search by name, cause, location" className="px-3 w-5/6 h-8 bg-none placeholder:text-sm rounded-full focus:outline-none" />
        <button className="rounded-md p-2.5 bg-background hover:bg-opacity-80 absolute right-0">
        <Icon icon="meteor-icons:search" width="16" height="16"  style={{color: '#fff'}} />
        </button>
        </div>
        <div className="hidden medium:flex medium:w-5/6 items-center gap-4">
            <span>We found fundraisers for</span>
<div className="relative ">
  <div
    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
    className="h-10 border-2 border-gray-200 w-40 relative flex items-center justify-between px-2 bg-white rounded-lg cursor-pointer"
  >
    <span className="flex">{selectedCategoryName}</span>
    <Icon icon="icon-park:down" width="20" height="20" />
  </div>

  {isCategoryDropdownOpen && (
    <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-md z-10">
{[{ name: "All", id: null,categoryId:null }, ...categories].map((cat) => (
  <div
    key={cat.id}
        onClick={() => {
          setActiveCategoryId(cat.id);
          setIsCategoryDropdownOpen(false);
        }}
    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
      selectedCategoryName === cat.name ? 'bg-gray-100 font-semibold' : ''
    }`}
  >
    {cat.name}
  </div>
))}


    </div>
  )}
</div>

        </div>
  <div className=" w-full flex justify-between">

  <div  onClick={() => setIsModalOpen(true)} className="med:hidden flex items-center gap-2 py-2 px-4 rounded-full border-2 w-max border-gray-300">
            <span>Filter</span>
            <Icon icon="rivet-icons:filter" width="16" height="16"  style={{color: '#464343'}} />
        </div>
  </div>

  <div className="flex-wrap w-auto flex medium:justify-center gap-x-10 gap-y-6 ">
{fundDetails
  .filter(fund => selectedCategoryName === 'All' || fund.categoryId === activeCategoryId)
  .map((fund) =>(<div key={fund.id} className="w-full small:w-[46%] medium:w-1/4 cursor-pointer h-[22rem] medium:h-[27rem] rounded-lg border-gray-200 border-2">
  <NavLink to={`/fundraisers/${fund.id}/${fund.fundraiser}`}>
<div className="relative">
    <div className="absolute top-1 left-0 p-1 w-24 bg-background rounded-br-full rounded-tr-full">
        <span className="text-white">{fund.topic}</span>
    </div>
<img className="w-full h-44 small:h-40 medium:h-40 sl:h-44 med:h-44 xl:h-48 rounded-tr-md rounded-tl-md" src="bg.png" />
<div className="flex flex-col gap-2 p-3">
<p className="text-base  font-[600]">{fund.heading}</p>
<span className="line-clamp-2 hidden medium:flex text-sm">{fund.description}</span>
<div className="flex items-center justify-between">
<span className="text-background text-sm sl:text-base font-[600]"> {fund.amount}</span>
<div className="flex items-center">
<div className="relative flex items-center w-16 h-8 ">
<img src="persona1.jpg" className="rounded-full w-6 h-6 absolute left-2 border-white" />
<img src="persona2.jpg" className="rounded-full w-7 h-7 absolute left-6 border-white border-2   " />
</div>
<span className="text-sm">{fund.supporters}</span>
</div>

</div>
<BasicProgressBar progress={fund.percentage} />
<span className="font-[500] text-sm medium:text-base py-5">| Fundraised by {fund.fundraiser}</span>
</div>

</div></NavLink>
</div>))}



</div>
<div className="flex items-center justify-center">
  <span className="flex hover:text-background items-center text-gray-700 gap-1 group cursor-pointer relative">
    <span className="relative hover:text-background after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-background after:transition-all after:duration-300 group-hover:after:w-full">
      See more
    </span>
    <Icon icon="carbon:next-outline" width="20" height="20" className="transition-colors duration-300 text-gray-600 group-hover:text-background" />
  </span>
</div>

  </div>
  {isModalOpen && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
    <div className="bg-white flex flex-col gap-3 p-6 rounded-lg w-5/6 max-w-md">
    <div className="h-10 border-2 border-gray-200 w-full relative  bg-white rounded-lg">
        <input placeholder="Search by name, cause, location" className="px-3 w-5/6 h-8 bg-none placeholder:text-xs rounded-full focus:outline-none" />
        <button className="rounded-md p-2.5 bg-background hover:bg-opacity-80 absolute right-0">
        <Icon icon="meteor-icons:search" width="16" height="16"  style={{color: '#fff'}} />
        </button>
        </div>
        <div className="flex flex-col gap-3">
  {[
    'Education',
    'Elderly',
    'Kids',
    'Woman',
    'Medical',
    'Sports',
    'Memorial',
  ].map((label) => (
    <label key={label} className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        name="categories"
        value={label.toLowerCase()}
        className="form-checkbox text-background"
      />
      <span className="text-sm text-gray-800">{label}</span>
    </label>
  ))}
</div>
<button className="p-2 rounded-lg bg-background">
<text className="text-white">Apply</text>
</button>
    </div>
  </div>
)}

</div>
       <Footer />
        </div>
    )
}

export default Donate