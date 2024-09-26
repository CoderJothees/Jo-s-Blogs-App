import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'
import SignUpPage from './components/SignUpPage'
import { UserContextProvider } from './UserContext'
import Post from './post/Post'
import ProfilePage from './components/ProfilePage'
import NewPost from './post/NewPost'
import FullPost from './post/FullPost'
import EditPost from './post/EditPost'

function App() {

  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route index element={<HomePage />} />
            <Route path='LoginPage' element={<LoginPage />} />
            <Route path='SignUpPage' element={<SignUpPage />} />
            <Route path='ProfilePage' element={<ProfilePage />} />


            <Route path='post' element={<Post/>}/>
            <Route path='NewPost' element={<NewPost />}/>
            <Route path='/FullPost/:id' element={<FullPost/>}/>
            <Route path='EditPost/:id' element={<EditPost />}/>


          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>

  )
}

export default App
