import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import Footer from '../components/common/Footer';
import { apiConnector } from '../services/apiConnector';
import { categories } from '../services/apis';
import { getCategoryPageData } from '../services/operations/pageAndComponentData';
import { CourseSlider } from '../components/core/Catalog/CourseSlider';
import { CourseCard } from '../components/core/Catalog/CourseCard';

import '../components/common/loader.css'

export const Catalog = () => {

    const {catalogName} = useParams();
    const [catalogPageData, setCatalogPageData] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [active, setActive] = useState(1);
    const [loading, setLoading] = useState(true);

    // fetch all categories
    useEffect(() => {
        const getCategoryId = async () => {
            setLoading(true);

            const response = await apiConnector("GET", categories.CATEGORIES_API);
            const categoryId = response?.data?.data.filter((category) => category.name.split(" ").join("-").toLowerCase() === catalogName)[0]?._id;

            setCategoryId(categoryId);

            setLoading(false);
        }

        getCategoryId();
    }, [catalogName]);

    useEffect(() => {
        const getCategoryDetails = async () => {
            setLoading(true);

            try {
                const response = await getCategoryPageData(categoryId);
                setCatalogPageData(response);
            } catch(err) {
                console.error(err);
            }

            setLoading(false);
        }

        if(categoryId) {
            getCategoryDetails();
        }
    }, [categoryId]);

    // show loader
    if(loading) {
        return (
            <div className='relative h-screen w-screen'>
                <div className='loader absolute top-1/2 left-1/2'></div>
            </div>
        )
    }

  return (
    <section>
        
        <div className=" box-content bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
            <p className="text-sm text-richblack-300">
                {`Home / Catalog / `}
                <span className="text-yellow-25">
                    {catalogPageData?.data?.selectedCategory?.name}
                </span>
            </p>

            <p className="text-3xl text-richblack-5">
                {catalogPageData?.data?.selectedCategory?.name}
            </p>

            <p className="max-w-[870px] text-richblack-200">
                {catalogPageData?.data?.selectedCategory?.description}
            </p>
            </div>
        </div>

        
        {/* section-1 */}
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="text-xl text-richblack-5 font-semibold">
                Courses to get you started
            </div>

            <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                <p  
                    className={`px-4 py-2 ${
                    active === 1
                        ? "border-b border-b-yellow-25 text-yellow-25"
                        : "text-richblack-50"
                    } cursor-pointer`}   
                    onClick={() => setActive(1)}
                >
                    Most Popular
                </p>

                <p 
                    className={`px-4 py-2 ${
                    active === 2
                        ? "border-b border-b-yellow-25 text-yellow-25"
                        : "text-richblack-50"
                    } cursor-pointer`}
                    onClick={() => setActive(2)}
                >
                    New
                </p>
            </div>

            <div>
                <CourseSlider 
                    courses={catalogPageData?.data?.selectedCategory?.courses}    
                />
            </div>
        </div>

        {/* section-2 */}
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className='text-xl text-richblack-5 font-semibold'>
                Top Courses in {catalogPageData?.data?.differentCategories?.name}
            </div>

            <div className="py-8">
                <CourseSlider 
                    courses={catalogPageData?.data?.differentCategories?.courses}    
                />
            </div>
        </div>


        {/* section-3 */}
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className='text-xl text-richblack-5 font-semibold'>
                Frequently Bought
            </div>

            <div className='py-8'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {
                    catalogPageData?.data?.mostSellingCourses.slice(0,4).map((course) => (
                        <CourseCard course={course} Height={"h-[400px]"} key={course._id}/>
                    ))
                }
                </div>
            </div>
        </div>

        <Footer/>
    </section>
  )
}
