import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Link, matchPath } from 'react-router-dom'

import { NavbarLinks } from "../../data/navbar-links"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import ProfileDropDown from '../core/auth/ProfileDropDown'

import { ACCOUNT_TYPE } from '../../utils/constants'
import { apiConnector } from '../../services/apiConnector'
import { categories } from '../../services/apis'

const Navbar = () => {
    const {token} = useSelector( (state) => state.auth );
    const {user} = useSelector( (state) => state.profile );
    const {totalItems} = useSelector( (state) => state.cart )
    const location = useLocation();

    const [loading, setLoading] = useState(false)

    const [subLinks, setSsubLinks]  = useState([]);

    const fetchSublinks = async() => {
        setLoading(true);

        try{
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            // console.log("Printing Sublinks result:" , result);
            setSsubLinks(result?.data?.data);
        }
        catch(error) {
            console.log("Could not fetch categories....", error);
        }

        setLoading(false);
    }


    useEffect( () => {
        fetchSublinks();
    },[] );


    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname);
    }

  return (
    <div 
        className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
        } transition-all duration-200`}
      >
      <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
        {/* logo */}
      <Link to="/">
        <img src={logo} width={160} height={42} loading='lazy'/>
      </Link>

      {/* Nav Links */}
      <nav className='hidden md:block'>
        <ul className='flex gap-x-6 text-richblack-25'>
        {
            NavbarLinks.map( (link, index) => (
                 <li key={index}>
                    {
                        link.title === "Catalog" ? (
                            <>
                                <div 
                                    className={`group relative flex cursor-pointer items-center gap-1 
                                    ${ matchRoute("/catalog/:catalogName") ? "text-yellow-25"
                                    : "text-richblack-25"}`}
                                >
                                    <p>{link.title}</p>
                                    <BsChevronDown />

                                    <div className='invisible absolute left-[50%] translate-x-[-50%]
                                        translate-y-[3em] top-[50%] z-[1000] w-[200px]
                                        flex flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900
                                        opacity-0 transition-all duration-200 group-hover:visible
                                        group-hover:opacity-100 lg:w-[300px] group-hover:translate-y-[1.65em]'
                                    >

                                        <div 
                                        className='absolute left-[50%] top-0 translate-x-[80%] translate-y-[-45%] -z-10 h-6 w-6 rotate-45 rounded bg-richblack-5'>
                                        </div>
                                        
                                        {
                                            loading ? (
                                                <p className='text-center'>Loading...</p>
                                            ) : subLinks.length ? (
                                                <>
                                                {
                                                    subLinks.map( (subLink, index) => (
                                                        <Link 
                                                            key={index}
                                                            to={`/catalog/${subLink.name
                                                            .split(" ")
                                                            .join("-")
                                                            .toLowerCase()}`} 
                                                            className='rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50'
                                                        >
                                                            <p>{subLink.name}</p>
                                                        </Link>
                                                    ) )
                                                }
                                                </>
                                            ) : (
                                                    <p className="text-center">No Courses Found</p>
                                                )
                                        }

                                    </div>


                                </div>
                            </>
                        ) : (
                            <Link to={link?.path}>
                                <p className={`${ matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                    {link.title}
                                </p>
                                
                            </Link>
                        )
                    }
                </li>
             ) )
        }

        </ul>
      </nav>


        {/* Login/SignUp/Dashboard */}
        <div className='flex gap-x-4 items-center'>

            {
                user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                    <Link to="/dashboard/cart" className='relative text-richblack-25 text-lg z-10'>
                        <AiOutlineShoppingCart />
                        {
                            totalItems > 0 && (
                                <span className='absolute -top-3 left-1 bg-caribbeangreen-200 rounded-full text-xs font-semibold text-richblack-900 px-1 -z-10 animate-bounce'>
                                    {totalItems}
                                </span>
                            )
                        }
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/login">  
                        <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                            Log in
                        </button>
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/signup">
                        <button  className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                            Sign Up
                        </button>
                    </Link>
                )
            }
            {
                token !== null && <ProfileDropDown />
            }
            
        </div>

        <button className="mr-4 md:hidden">
            <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      </div>
    </div>
  )
}

export default Navbar
