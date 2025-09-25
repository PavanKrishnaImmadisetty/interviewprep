import SignupPage from './Pages/Signup.js'
import LoginPage from './Pages/Login.js'
import CreatePage from './Pages/PostExperience.js'
import HomePage from './Pages/HomePage.js'
import Navbar from './components/Navbar.js'
import SinglePost from './Pages/SingleExperiencePage.js'
import ProfilePage from './Pages/ProfilePage.js'
import EditPage from './Pages/EditExperiencePage.js'
import InterviewsPage from './Pages/InterviewPage.js'
import FeedBack from './Pages/FeedBackPage.js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App(){
  return(
    <Router>
            <Navbar /> 
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/create" element={<CreatePage />} />
                    <Route path="/experiences/:id" element={<SinglePost />} />
                    <Route path='/profile/:userId' element={<ProfilePage />} />
                    <Route path='/edit-experience/:id' element={<EditPage/>} />
                    <Route path='/interviews' element={<InterviewsPage/>} />
                    <Route path='/feedback' element={<FeedBack />} />
                </Routes>
            </main>
    </Router>
  )
}

export default App



    