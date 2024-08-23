import { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageCars.css';
import {jwtDecode} from 'jwt-decode';

export default function ManageCars() {
    const token = localStorage.getItem('token');
    const [cars, setCars] = useState([]);
    const [selectedCars, setSelectedCars] = useState([]);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCar, setNewCar] = useState({
        name: '',
        engine: '',
        doors: '',
        seats: '',
        price: '',
        img: null,
    });

    useEffect(() => {
        if (token) {
            const fetchCars = async () => {
                try {
                    const response = await axios.get('http://localhost:3001/api/cars');
                    console.log('API Response:', response.data);
                    
                    if (Array.isArray(response.data)) {
                        setCars(response.data);
                    } else {
                        setError('Unexpected data format');
                    }
                } catch (err) {
                    setError('Failed to load cars.');
                }
            }
            fetchCars();
        };
    }, [token]);
    
    if (!token) {
        return (
            <div>
                <h1>You are not logged in</h1>
            </div>
        )
    }

    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;
    
    if (userRole != 'admin') {
        return (
            <div>
                <h1>You do not have the right permissions</h1>
            </div>
        )
    }

    console.log(userRole);

    const handleSelectCar = (id) => {
        setSelectedCars(prevSelected => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(carId => carId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleDeleteCars = async () => {
        try {
            await Promise.all(selectedCars.map(id => axios.delete(`http://localhost:3001/api/cars/delete/${id}`)));
            setCars(cars.filter(car => !selectedCars.includes(car.id)));
            setSelectedCars([]);
        } catch (error) {
            setError('Failed to delete selected cars.');
        }
    };

    const handleUpdateCar = async (id) => {
        const carToUpdate = cars.find(car => car.id === id);
        if (carToUpdate) {
            try {
                await axios.put(`http://localhost:3001/api/cars/${id}`, {
                    name: carToUpdate.name,
                    engine: carToUpdate.engine,
                    doors: carToUpdate.doors,
                    seats: carToUpdate.seats,
                    price: carToUpdate.price,
                });
                // Optionally re-fetch the cars to reflect changes
                const response = await axios.get('http://localhost:3001/api/cars');
                if (Array.isArray(response.data)) {
                    setCars(response.data);
                }
            } catch (err) {
                setError('Failed to update the car.');
            }
        }
    };

    const handleAddCar = async (event) => {
        event.preventDefault();
        
        // Create a new FormData object
        const formData = new FormData();
        
        // Append form fields to the FormData object
        formData.append('name', newCar.name);
        formData.append('engine', newCar.engine);
        formData.append('doors', newCar.doors);
        formData.append('seats', newCar.seats);
        formData.append('price', newCar.price);
        
        // Append the image file
        if (newCar.img) {
            formData.append('img', newCar.img);
        }
    
        try {
            const response = await axios.post('http://localhost:3001/api/cars/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === 200) {
                setCars([...cars, { ...newCar, id: response.data.id }]);
                setNewCar({
                    name: '',
                    engine: '',
                    doors: '',
                    seats: '',
                    price: '',
                    img: null,
                });
                setShowAddForm(false);
            }
        } catch (err) {
            setError('Failed to add the car.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCar(prevCar => ({ ...prevCar, [name]: value }));
    };

    const handleFileChange = (e) => {
        setNewCar(prevCar => ({ ...prevCar, img: e.target.files[0] }));
    };
    

    if (error) return <p>{error}</p>;

    return (
        <div className="manage-cars">
            <h1>Manage Cars</h1>

            <table>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Engine</th>
                        <th>Doors</th>
                        <th>Seats</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(cars) && cars.map(car => (
                        <tr key={car.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedCars.includes(car.id)}
                                    onChange={() => handleSelectCar(car.id)}
                                />
                            </td>
                            <td>
                                <img src={`http://localhost:3001/${car.img}`} alt={car.name} className="car-image" />
                            </td>
                            <td>{car.name}</td>
                            <td>{car.engine}</td>
                            <td>{car.doors}</td>
                            <td>{car.seats}</td>
                            <td>${car.price}</td>
                            <td>
                                <button onClick={() => handleUpdateCar(car.id)}>Update</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="buttons-container">
                <button onClick={handleDeleteCars} disabled={selectedCars.length === 0}>
                    Delete Selected Cars
                </button>
                <button onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? 'Cancel' : 'Add New Car'}
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleAddCar} className="add-car-form">
                    <h2>Add a New Car</h2>
                    <div className="form-group">
                        <label>Car Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={newCar.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Engine:</label>
                        <input
                            type="text"
                            name="engine"
                            value={newCar.engine}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Doors:</label>
                        <input
                            type="number"
                            name="doors"
                            value={newCar.doors}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Seats:</label>
                        <input
                            type="number"
                            name="seats"
                            value={newCar.seats}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={newCar.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Image:</label>
                        <input
                            type="file"
                            name="img"
                            onChange={handleFileChange}
                            accept="image/*"
                            required
                        />
                    </div>
                    <button type="submit">Add Car</button>
                </form>
            )}
        </div>
    );
}
