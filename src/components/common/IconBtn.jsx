import React from 'react'

import * as Icons from 'react-icons/fa'

export const IconBtn = ({
    text,
    onClick,
    children,
    disabled,
    outline=false,
    customClasses,
    type,
    iconName,
}) => {
    const Icon = Icons[iconName];

  return (
    <button 
    disabled={disabled}
    onClick={onClick}
    className={`${customClasses ? customClasses : 'bg-yellow-50 text-richblack-900 font-bold'} 
        px-6 py-2 rounded-md hover:scale-95 transition-all duration-300`}
    type={type}>
        {
            children ? 
            (<>
                <span>
                    {text} 
                </span>
                {children}
            </>) 
            : 
            (
                <div className='flex items-center space-x-2'>
                    <span>{text}</span>
                    {Icon && <Icon className='text-sm'/>}
                </div>
            )
        }
    </button>
  )
}
