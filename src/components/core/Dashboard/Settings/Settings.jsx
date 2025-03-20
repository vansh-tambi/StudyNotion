import { UpdateProfileDetails } from './UpdateProfileDetails';
import UpdatePassword from './UpdatePassword';
import UpdatePhoto from './UpdatePhoto';
import DeleteAccount from './DeleteAccount';

export const Settings = () => {
  return (
    <div className='text-richblack-5 flex flex-col gap-10'>
    
            <h1 className='text-3xl font-[500]'>Edit Profile</h1>

            {/* Section-1 */}
            <UpdatePhoto/>
    
            {/* Section-2 */}
              <UpdateProfileDetails/>
    
            {/* Section-3 */}
            <UpdatePassword/>
    
            {/* Section-4 */}
            <DeleteAccount/>

        </div>
  )
}
