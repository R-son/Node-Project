import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cars from './components/Cars/Cars';
import CarDetail from './components/Cars/Car';
import ManageCars from './components/Admin/ManageCars';
import Header from './components/Header';
import Login from './components/Users/Login';
import Register from './components/Users/Register';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Cars />} />
                <Route path="/car/:id" element={<CarDetail/>} />
                <Route path="/car-manage" element={<ManageCars />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;