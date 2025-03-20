import React from 'react'

const stats = [
    {count: '5k', label: 'Active students'},
    {count: '10+', label: 'Mentors'},
    {count: '200+', label: 'Courses'},
    {count: '50+', label: 'Awards'},
]

export const Stats = () => {
  return (
    <section>
        <div className='flex flex-col space-y-6 sm:space-y-0 sm:flex-row justify-evenly'>
        {
            stats.map((data, idx) => (
                <div key={idx} className='flex flex-col sm:space-y-3 items-center'>
                    <h2 className='text-3xl font-semibold text-richblack-5'>{data.count}</h2>
                    <p className='text-richblack-400 font-semibold'>{data.label}</p>
                </div>
            ))   
        }
        </div>
    </section>
  )
}
