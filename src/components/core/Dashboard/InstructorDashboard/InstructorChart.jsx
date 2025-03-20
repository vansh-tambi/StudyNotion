import React, { useState } from 'react'

import { Chart, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';

Chart.register(...registerables);

export const InstructorChart = ({instructorData}) => {

    const [currentChart, setCurrentChart] = useState("students");

    // generate random colors
    const getRandomColors = (numColors) => {
        const colors = [];

        for(let i=0; i<numColors; i++) {
            // generate a random rgb color
            const color = `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`
            colors.push(color);
        }

        return colors;
    }

    // create data for students info chart
    const chartDataForStudents = {
        labels: instructorData.map(course => course.courseName),
        datasets: [
            {
                data: instructorData.map(course => course.totalStudentsEnrolled),
                backgroundColor: getRandomColors(instructorData.length),
            }
        ]
    } 

    // create data for income info chart
    const chartDataForIncome = {
        labels: instructorData.map(course => course.courseName),
        datasets: [
            {
                data: instructorData.map(course => course.totalAmountGenerated),
                backgroundColor: getRandomColors(instructorData.length),
            }
        ]
    }

    // create options
    const options = {
        maintainAspectRatio: false,
    }

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
        <p className="text-lg font-bold text-richblack-5">Visualize</p>
        
        {/* buttons */}
        <div className="space-x-4 font-semibold">
            {/* button to switch to student chart */}
            <button
                onClick={() => setCurrentChart("students")}
                className={`rounded-sm p-1 px-3 transition-all duration-200 ${
                    currentChart === "students"
                    ? "bg-richblack-700 text-yellow-50"
                    : "text-yellow-400"
            }`}
            >
                Students
            </button>

            {/* button to switch to income chart */}
            <button
                onClick={() => setCurrentChart("income")}
                className={`rounded-sm p-1 px-3 transition-all duration-200 ${
                    currentChart === "income"
                    ? "bg-richblack-700 text-yellow-50"
                    : "text-yellow-400"
                }`}
            >
                Income
            </button>
        </div>

        {/* pie-chart */}
        <div className="relative mx-auto aspect-square h-[80%] w-[80%]">
            <Pie
                data={currentChart === "students" ? chartDataForStudents : chartDataForIncome}
                options={options}
            />
        </div>
    </div>
  )
}
