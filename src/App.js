import { Authentication } from './Comps/Auth'
import { Routes, Route, Outlet } from 'react-router-dom'

import './App.css';
// import './styles/globals.css'
import './styles/auth.style.css'
import './styles/style.one.css'
import { Home } from './Comps/GameUI/Home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/quiz" element={<Home />} >
        </Route>
      </Routes>

      <Outlet></Outlet>

    </div>
  );
}

export default App;
