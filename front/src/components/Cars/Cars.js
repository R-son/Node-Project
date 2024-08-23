import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Cars.css';

export default function Cars() {
    const [cars, setCars] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:3001/api/cars')
            .then(response => {
                setCars(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Failed to load cars.');
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="car-catalog">
            <h1>Catalog</h1>
            <div className="car-list">
                {cars.map(car => (
                    <Link key={car.id} to={`/car/${car.id}`} className="car-card">
                        <img src={`http://localhost:3001/${car.img}`} alt={car.name} className="car-image" />
                        <div className="car-details">
                            <h2>{car.name}</h2>
                            <p><strong>Engine:</strong> {car.engine}</p>
                            <p><strong>Doors:</strong> {car.doors}</p>
                            <p><strong>Seats:</strong> {car.seats}</p>
                            <p><strong>Price:</strong> ${car.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
