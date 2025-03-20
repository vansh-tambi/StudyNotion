import React from 'react'
import * as Icons from 'react-icons/vsc'
import { useDispatch } from 'react-redux';
import { matchPath, NavLink, useLocation } from 'react-router-dom';

export const SidebarLink = ({link, iconName}) => {
    const Icon = Icons[iconName];
    const location = useLocation();
    const dispatch = useDispatch();

    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname);
    }

  return (
    <NavLink 
     to={link.path}
     onClick={()=> console.log('clicked')}
     className={`${matchRoute(link.path) ? 'bg-yellow-800 text-yellow-100' : 'bg-opacity-0 hover:text-richblack-100'} 
      relative px-8 py-2 text-sm font-medium text-richblack-300 transition-all duration-200`}
    >
        <span className={` ${matchRoute(link.path) ? 'opacity-100' : 'opacity-0'}
        absolute left-0 top-0  h-full w-[0.2rem] bg-yellow-50`}></span>

        <div className='flex item-center gap-x-2'>
            <Icon className='text-lg'/>
            <span>{link.name}</span>
        </div>

    </NavLink>
  )
}
