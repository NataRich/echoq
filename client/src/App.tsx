import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Signin from "./page/auth/Signin"
import Signup from "./page/auth/Signup"
import Home from "./page/home/Home"

import "./app.css"

export const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  )
}
