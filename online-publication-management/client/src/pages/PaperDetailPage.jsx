// client/src/pages/PaperDetailPage.jsx

// The problematic line "import PaperDetailPage from './pages/PaperDetailPage';" has been REMOVED.

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPaperById } from '../services/api'; // Assuming api.js exports this

const PaperDetailPage = () => {
    const { id } = useParams(); // Get paper ID from URL
    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadPaper = async () => {
            if (!id) { // Add a check for id
                setLoading(false);
                setError('Paper ID is missing.');
                return;
            }
            try {
                const data = await fetchPaperById(id);
                setPaper(data);
            } catch (err) {
                setError('Failed to fetch paper details.');
                console.error('Fetch paper error:', err); // Log the actual error
            } finally {
                setLoading(false);
            }
        };
        loadPaper(); // Call the async function
    }, [id]); // Dependency array includes id

    if (loading) return <p>Loading paper details...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!paper) return <p>Paper not found or still loading.</p>; // Modified message

    // Construct the file URL - Ensure VITE_API_URL is set in client/.env
    // And that paper.FilePath is the relative path like 'papers/filename.pdf'
    const baseApiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
    const fileUrl = paper.FilePath ? `${baseApiUrl}/uploads/${paper.FilePath.replace(/\\/g, "/")}` : null;


    return (
        <div>
            <h2>{paper.PaperTitle || 'Paper Title Missing'}</h2>
            {paper.PublicationDate && <p><strong>Publication Date:</strong> {new Date(paper.PublicationDate).toLocaleDateString()}</p>}
            {paper.DOI && <p><strong>DOI:</strong> <a href={`https://doi.org/${paper.DOI}`} target="_blank" rel="noopener noreferrer">{paper.DOI}</a></p>}
            {paper.JournalName && <p><strong>Journal:</strong> {paper.JournalName}</p>}
            {paper.ISSN && <p><strong>ISSN:</strong> {paper.ISSN}</p>}
            {paper.VolumeNo && <p><strong>Volume:</strong> {paper.VolumeNo}</p>}
            {paper.PageNo && <p><strong>Page:</strong> {paper.PageNo}</p>}
            {paper.PublisherName && <p><strong>Publisher:</strong> {paper.PublisherName}</p>}

            <h3>Abstract</h3>
            <p>{paper.PaperAbstract || 'No abstract available.'}</p>

            {paper.PaperKeywords && <p><strong>Keywords:</strong> {paper.PaperKeywords}</p>}

            <h3>Authors</h3>
            {paper.authors && paper.authors.length > 0 ? (
                <ul>
                    {paper.authors.map(author => (
                        <li key={author.AuthorID || author.AuthorName}> {/* Added fallback key */}
                            {author.AuthorName} ({author.AuthorAffiliation || 'No affiliation'})
                            {author.AuthorEmail && ` - ${author.AuthorEmail}`}
                        </li>
                    ))}
                </ul>
            ) : <p>No authors listed.</p>}

            {fileUrl && ( // Only show if fileUrl is valid
                <p>
                    <strong>Download Paper:</strong>{' '}
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        View/Download PDF
                    </a>
                </p>
            )}

            <p><em>Uploaded by: {paper.UploaderFullName || 'Unknown'} {paper.UploaderEmail ? `(${paper.UploaderEmail})` : ''}</em></p>
            {typeof paper.CitationCount === 'number' && <p><strong>Citations:</strong> {paper.CitationCount}</p>}

            {/* TODO: Sections for Discussions, Citations, Request Full Text */}
            <hr />
            <Link to="/">Back to all papers</Link>
        </div>
    );
};

export default PaperDetailPage;