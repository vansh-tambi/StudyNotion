import "./App.css";

import { ACCOUNT_TYPE } from "./utils/constants";

import {Route, Routes } from "react-router-dom";

import Navbar from "./components/common/Navbar"
import Home from "./Pages/Home"
import OpenRoute from "./components/core/auth/OpenRoute"

import Login from "./Pages/Login"
import Signup from "./Pages/Signup"
import ForgotPassword from "./Pages/ForgotPassword";
import UpdatePassword from "./Pages/UpdatePassword";
import VerifyEmail from "./Pages/VerifyEmail";

import About from "./Pages/About";
import { ContactUs } from "./Pages/ContactUs";
import { MyProfile } from "./components/core/Dashboard/MyProfile";
import { PrivateRoute } from "./components/core/auth/PrivateRoute";
import { Error } from "./Pages/Error";
import { Dashboard } from "./Pages/Dashboard";
import { Settings } from "./components/core/Dashboard/Settings/Settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart/Index";
import { useSelector } from "react-redux";
import AddCourse from "./components/core/Dashboard/AddCourse";
import { MyCourses } from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import { Catalog } from "./Pages/Catalog";
import { CourseDetails } from "./Pages/CourseDetails";
import { ViewCourse } from "./Pages/ViewCourse";
import { VideoDetails } from "./components/core/ViewCourse/VideoDetails";
import { Instructor } from "./components/core/Dashboard/Instructor";

function App() {
  const {user} = useSelector((state) => state.profile);
  // console.log('logging user: ', user);

  return (
   <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
    <Navbar/>

    <Routes>
      <Route path="/" element={<Home/>} />

      <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
      />

      <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
      />

      <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword/>
            </OpenRoute>
          }
      />

      <Route
          path="update-password/:token"
          element={
            <OpenRoute>
              <UpdatePassword/>
            </OpenRoute>
          }
      />

      <Route
          path="verify-email"
          element={<VerifyEmail/>}
      />

      <Route
        path="catalog/:catalogName"
        element={<Catalog/>}
      />

      <Route
        path="courses/:courseId"
        element={<CourseDetails/>}
      />


      <Route
          path="about"
          element={<About/>}
      />

      <Route
        path="/contact"
        element={<ContactUs/>}
      />

      <Route
        element={
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>
        }
      >
          <Route path="dashboard/my-profile" element={<MyProfile/>}/>
          <Route path="/dashboard/settings" element={<Settings/>}/> 

          {/* Student profile routes */}
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses/>}/>
                <Route path="/dashboard/cart" element={<Cart/>}/>
              </>
            )
          }

          {/* Instructor profile routes */}
          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="/dashboard/instructor" element={<Instructor/>}/>
                <Route path="/dashboard/my-courses" element={<MyCourses/>}/>
                <Route path="/dashboard/add-course" element={<AddCourse/>}/>
                <Route path="/dashboard/edit-course/:courseId" element={<EditCourse/>}/>
              </>
            )
          }
      </Route>

      
      <Route element={
        <PrivateRoute>
          <ViewCourse/>
        </PrivateRoute>
      }>
        {
          user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails/>}
              />
            </>
          )
        }
      </Route>
      

      <Route 
        path='*'
        element={<Error/>}
      />
    </Routes>

   </div>
  );
}

export default App;
