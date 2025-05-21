// client/src/pages/UploadPaperPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadNewPaper } from '../services/api'; // Assuming apiClient is default export from api.js

const UploadPaperPage = () => {
    const [formData, setFormData] = useState({
        PaperTitle: '',
        PaperAbstract: '',
        PaperKeywords: '',
        PublicationDate: '',
        DOI: '',
        ISSN: '', // For Journal and ISSN_Volumes
        VolumeNo: '',
        PageNo: '',
        PublisherID: '', // You'd fetch publishers for a dropdown
        authors: [{ AuthorName: '', AuthorEmail: '', AuthorAffiliation: '' }] // Initial author
    });
    const [paperFile, setPaperFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // TODO: Fetch Publishers and Journals for dropdowns
    // const [publishers, setPublishers] = useState([]);
    // useEffect(() => { /* fetch publishers from API */ }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuthorChange = (index, e) => {
        const updatedAuthors = formData.authors.map((author, i) =>
            i === index ? { ...author, [e.target.name]: e.target.value } : author
        );
        setFormData({ ...formData, authors: updatedAuthors });
    };

    const addAuthorField = () => {
        setFormData({
            ...formData,
            authors: [...formData.authors, { AuthorName: '', AuthorEmail: '', AuthorAffiliation: '' }]
        });
    };

    const removeAuthorField = (index) => {
        const updatedAuthors = formData.authors.filter((_, i) => i !== index);
        setFormData({ ...formData, authors: updatedAuthors });
    };

    const handleFileChange = (e) => {
        setPaperFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!paperFile) {
            setError('Please select a paper file (PDF).');
            setLoading(false);
            return;
        }
        if (!formData.PaperTitle || !formData.PublicationDate || !formData.PaperAbstract) {
            setError('Title, Abstract and Publication Date are required.');
            setLoading(false);
            return;
        }


        const data = new FormData();
        data.append('paperFile', paperFile);
        data.append('PaperTitle', formData.PaperTitle);
        data.append('PaperAbstract', formData.PaperAbstract);
        data.append('PaperKeywords', formData.PaperKeywords);
        data.append('PublicationDate', formData.PublicationDate);
        data.append('DOI', formData.DOI);
        data.append('ISSN', formData.ISSN);
        data.append('VolumeNo', formData.VolumeNo);
        data.append('PageNo', formData.PageNo);
        data.append('PublisherID', formData.PublisherID);
        data.append('authors', JSON.stringify(formData.authors)); // Send authors as JSON string

        try {
            const response = await uploadNewPaper(data);
            setSuccess(`Paper uploaded successfully! Paper ID: ${response.paperId}`);
            // Optionally clear form or navigate
            // navigate(`/papers/${response.paperId}`);
            setFormData({ /* reset form */ });
            setPaperFile(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload paper.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Upload New Research Paper</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Paper Title*:</label>
                    <input type="text" name="PaperTitle" value={formData.PaperTitle} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Abstract*:</label>
                    <textarea name="PaperAbstract" value={formData.PaperAbstract} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Keywords (comma-separated):</label>
                    <input type="text" name="PaperKeywords" value={formData.PaperKeywords} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Publication Date*:</label>
                    <input type="date" name="PublicationDate" value={formData.PublicationDate} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>DOI:</label>
                    <input type="text" name="DOI" value={formData.DOI} onChange={handleInputChange} />
                </div>
                <div>
                    <label>ISSN (of Journal):</label>
                    <input type="text" name="ISSN" value={formData.ISSN} onChange={handleInputChange} placeholder="e.g., 1234-5678" />
                </div>
                <div>
                    <label>Volume No:</label>
                    <input type="number" name="VolumeNo" value={formData.VolumeNo} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Page No:</label>
                    <input type="number" name="PageNo" value={formData.PageNo} onChange={handleInputChange} />
                </div>
                {/* <div>
                    <label>Publisher:</label>
                    <select name="PublisherID" value={formData.PublisherID} onChange={handleInputChange}>
                        <option value="">Select Publisher</option>
                        {publishers.map(p => <option key={p.PublisherID} value={p.PublisherID}>{p.PublisherName}</option>)}
                    </select>
                </div> */}
                <hr />
                <h4>Authors</h4>
                {formData.authors.map((author, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <label>Author {index + 1} Name*:</label>
                        <input type="text" name="AuthorName" value={author.AuthorName} onChange={(e) => handleAuthorChange(index, e)} required />
                        <label>Author Email:</label>
                        <input type="email" name="AuthorEmail" value={author.AuthorEmail} onChange={(e) => handleAuthorChange(index, e)} />
                        <label>Author Affiliation:</label>
                        <input type="text" name="AuthorAffiliation" value={author.AuthorAffiliation} onChange={(e) => handleAuthorChange(index, e)} />
                        {formData.authors.length > 1 && (
                            <button type="button" onClick={() => removeAuthorField(index)}>Remove Author</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addAuthorField}>Add Another Author</button>
                <hr />
                <div>
                    <label>Paper File (PDF)*:</label>
                    <input type="file" name="paperFile" onChange={handleFileChange} accept=".pdf" required />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload Paper'}
                </button>
            </form>
        </div>
    );
};

export default UploadPaperPage;