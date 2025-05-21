// client/src/pages/PaperListPage.jsx (or integrate into HomePage.jsx)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPapers } from '../services/api';

const PaperListPage = () => {
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadPapers = async () => {
            try {
                const data = await fetchPapers();
                setPapers(data);
            } catch (err) {
                setError('Failed to fetch papers.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadPapers();
    }, []);

    if (loading) return <p>Loading papers...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Research Papers</h2>
            {papers.length === 0 ? (
                <p>No papers found.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {papers.map(paper => (
                        <li key={paper.PaperID} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px' }}>
                            <h3><Link to={`/papers/${paper.PaperID}`}>{paper.PaperTitle}</Link></h3>
                            <p><strong>Authors:</strong> {paper.AuthorNames || 'N/A'}</p>
                            <p><strong>Published:</strong> {new Date(paper.PublicationDate).toLocaleDateString()}</p>
                            <p>{paper.PaperAbstract?.substring(0, 200)}...</p>
                            {paper.DOI && <p><strong>DOI:</strong> {paper.DOI}</p>}
                            <p><em>Uploaded by: {paper.UploaderName || 'Unknown'}</em></p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default PaperListPage;