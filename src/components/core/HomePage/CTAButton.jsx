import React from 'react'
import { Link } from 'react-router-dom'

const CTAButton = ({children, active, linkto}) => {
  return (
    <Link to={linkto}>
        <div className={`text-center text-[13px] px-6 py-3 rounded-md hover:scale-95 transition-all duration-200 shadow-sm
        ${active ? 'bg-yellow-50 text-black font-bold shadow-[2px_2px_0px_0px_#FFEB87]' : 'bg-richblack-800 text-white font-semibold shadow-[2px_2px_0px_0px_#404650]'}`}>  
            {children}
        </div>
    </Link>

  )
}

export default CTAButton;