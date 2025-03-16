import NavBar from '../components/NavBar';
import UserAccountDetails from '../components/UserAccountDetails';

const UserAccounts = () =>{
    return (
        <>
        <NavBar/>
        <div className='text-website-green min-h-screen m-[30px] border-[3px] border-website-green font-amaranth'>
            <div>
                <p className='text-[35px] m-[15px] text-website-green'>Sales Report</p>
            </div>
            <div className='flex justify-evenly text-4xl p-[50px]'>
                <div className='text-center'>
                    <p>XXXXX</p>
                    <p className='text-xl'>TOTAL USERS IN THE SYSTEM</p>
                </div>
            </div>
            <div>
                <UserAccountDetails/>
            </div>
        </div>
        </>
    )
}

export default UserAccounts