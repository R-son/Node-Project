import { useEffect, useState } from 'react';
import axios from 'axios';
import './Users.css';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const list = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to load users');
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/users/delete/${id}`);
            setUsers(users.filter(user => user.id !== id));
        } catch (err) {
            console.error('Failed to delete user:', err);
        }
    };

    const updateUser = async (id, newUsername, newEmail) => {
        try {
            await axios.put(`http://localhost:3001/api/users/update/${id}`, { username: newUsername, email: newEmail });
            list();
        } catch (err) {
            console.error('Failed to update user:', err);
        }
    };

    const addUser = async (username, email, password) => {
        try {
            await axios.post('http://localhost:3001/api/users', { username, email, password });
            list();
        } catch (err) {
            console.error('Failed to add user:', err);
        }
    };    

    useEffect(() => {
        list();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="user-board">
            <h2>User List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <UserRow
                            key={user.id}
                            user={user}
                            onDelete={deleteUser}
                            onUpdate={updateUser}
                        />
                    ))}
                </tbody>
            </table>
            <AddUserForm onAdd={addUser} />
        </div>
    );
}

function UserRow({ user, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(user.username);
    const [newEmail, setNewEmail] = useState(user.email);

    const handleUpdate = () => {
        onUpdate(user.id, newUsername, newEmail);
        setIsEditing(false);
    };

    return (
        <tr>
            <td>{isEditing ? <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} /> : user.username}</td>
            <td>{isEditing ? <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} /> : user.email}</td>
            <td>
                {isEditing ? (
                    <>
                        <button onClick={handleUpdate}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={() => onDelete(user.id)}>Delete</button>
                    </>
                )}
            </td>
        </tr>
    );
}

function AddUserForm({ onAdd }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(username, email, password);
        setUsername('');
        setEmail('');
        setPassword('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Add New User</h3>
            <input
                type="text"
                placeholder="Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Add User</button>
        </form>
    );
}
