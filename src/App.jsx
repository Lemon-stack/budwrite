
import Login from './components/pages/Login'
import Signup from './components/pages/Signup'
import Layout from './components/pages/Layout'
import {Routes, Route} from 'react-router-dom';

import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path={'/signup'} element={ <Signup />} />
        <Route path={'/'} element={ <Login/>} />
        <Route path={'layout'} element={ <Layout/>} />
      </Routes>
    </>
  )
}

export default App
