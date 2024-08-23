import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Car.css';

export default function Car() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3001/api/cars/${id}`)
            .then(response => {
                setCar(response.data);
            })
            .catch(error => {
                setError('Failed to load car details.');
            });
    }, [id]);

    if (error) return <p>{error}</p>;
    if (!car) return <p>Loading...</p>;

    // const handleBuy = async (e) => {
    //     try {
    //         const response
    //     }
    // }

    return (
        <div className="car-detail">
            <h1>{car.name}</h1>
            <img src={`http://localhost:3001/${car.img}`} alt={car.name} />
            <p><strong>Engine:</strong> {car.engine}</p>
            <p><strong>Doors:</strong> {car.doors}</p>
            <p><strong>Seats:</strong> {car.seats}</p>
            <p><strong>Price:</strong> ${car.price}</p>
            {/* <button onClick={handleBuy}>BUY</button> */}
        </div>
    );
}
