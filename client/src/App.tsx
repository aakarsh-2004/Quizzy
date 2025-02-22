import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import Admin from './components/Admin'
import User from './components/User'


function App() {

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path='/' element={<Dashboard />}/>
          <Route path='/admin' element={<Admin />}/>
          <Route path='/user' element={<User />}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
