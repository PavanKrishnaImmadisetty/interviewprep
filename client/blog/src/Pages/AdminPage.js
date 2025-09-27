import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../Styles/AdminPage.css'; // Make sure this is imported

function AdminPage() {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${auth.token}` } };
                const res = await axios.get('http://localhost:5000/api/admin/pending', config);
                setPending(res.data.experiences);
            } catch (error) {
                console.error("Could not fetch pending experiences", error);
            } finally {
                setLoading(false);
            }
        };
        if (auth.token) fetchPending();
    }, [auth.token]);

    const handleApprove = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${auth.token}` } };
            await axios.put(`http://localhost:5000/api/admin/approve/${id}`, {}, config);
            // Remove the approved item from the list
            setPending(pending.filter(exp => exp._id !== id));
        } catch (error) {
            alert("Failed to approve experience.");
        }
    };

    if (loading) return <div className="loading-message">Loading pending experiences...</div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <h2>Pending Experiences ({pending.length})</h2>
            </div>
            <div className="pending-list">
                {pending.length > 0 ? (
                    pending.map(exp => (
                        <div key={exp._id} className="pending-item">
                            <div className="item-details">
                                <h3>{exp.companyName} - {exp.role}</h3>
                                <p>by {exp.author.name}</p>
                            </div>
                            <div className="item-actions">
                                <Link to={`/experiences/${exp._id}`} target="_blank" rel="noopener noreferrer" className="btn-review">Review</Link>
                                <button onClick={() => handleApprove(exp._id)} className="btn-approve">Approve</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-pending-message">No experiences are currently pending approval.</p>
                )}
            </div>
        </div>
    );
}

export default AdminPage;