import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Login from './components/Login'
import Home from './components/Home'
import { store } from './store'
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import ModalLogin from './components/Modal/ModalLogin'
import ModalRegister from './components/Modal/ModalRegister'






function App() {
  //Accesso Token
  const [token, setToken] = useState(null)
  //UseEffect Per prendere il token
  useEffect(() => {
    const token = window.localStorage.getItem("token")
    if(token === null | token === undefined || token === "undefined"){
    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce(function (initial, item) {
        if (item) {
          var parts = item.split("=");
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});
    window.location.hash = "";
    window.localStorage.setItem("token", hash.access_token);
    setToken(hash.access_token)
    }else{
      setToken(token)
    }
  }, [])



  return (
    <div>
      <BrowserRouter>
      <Routes>
      {token === undefined || token === null ? <Route path="/" element={<Login />} /> : <Route path="/" element={<Home />} />}
        <Route path="/login" element={<ModalLogin />} />
        <Route path="/register" element={<ModalRegister />} />
      </Routes>
      </BrowserRouter>     
      
    </div>
  )
}

export default App
