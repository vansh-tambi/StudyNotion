import React, { useEffect } from 'react'
import { useState } from 'react'

import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from 'react-icons/ti'

function RatingStars({Review_Count, Star_Size}) {

    const [starCount, setStarCount] = useState({
        full: 0,
        half: 0,
        empty: 0
    });

    useEffect(() => {
        const wholeStars = Math.floor(Review_Count) || 0;
        setStarCount({
            full: wholeStars,
            half: Number.isInteger(Review_Count) ? 0 : 1,
            empty: Number.isInteger(Review_Count) ? 5 - wholeStars : 4 - wholeStars,
        });
    }, [Review_Count]);

  return (
    <div className='flex gap-1 text-yellow-100'>
        {/* full stars */}
        {

            /* 
                let arr = [...new Array(4)] 
                The above code will return an array of 4 size having all values as undefined
                console.log(arr) ===> output ====> [undefined, undefined, undefined, undefine]
            */
            
            [...new Array(starCount.full)].map((_, index) => (
                <TiStarFullOutline key={index} size={Star_Size || 20}/>
            ))
        }

        {/* half stars */}
        {
            [...new Array(starCount.half)].map((_, index) => (
                <TiStarHalfOutline key={index} size={Star_Size || 20}/>
            ))
        }

        {/* empty stars */}
        {
            [...new Array(starCount.empty)].map((_, index) => (
                <TiStarOutline key={index} size={Star_Size || 20}/>
            ))
        }
    </div>
  )
}

export default RatingStars