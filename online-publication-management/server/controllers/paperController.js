// server/controllers/paperController.js
const db = require('../config/db');

// @desc    Upload a new research paper
// @route   POST /api/papers
// @access  Private (User must be logged in)
const uploadPaper = async (req, res) => {
    const {
        ISSN, VolumeNo, PageNo, // For ISSN_Volumes
        PaperTitle, PaperAbstract, PaperKeywords, PublicationDate, DOI,
        PublisherID, // From Publishers table
        authors // Expect an array of author objects: [{AuthorName, AuthorEmail, AuthorAffiliation}, ...] or existing AuthorIDs
    } = req.body;

    const UploadedBy = req.user.UserID; // From authMiddleware

    if (!PaperTitle || !PaperAbstract || !PublicationDate) {
        return res.status(400).json({ message: 'PaperTitle, PaperAbstract, and PublicationDate are required.' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'Paper file is required.' });
    }
    const FilePath = path.join('papers', req.file.filename); // Save relative path: papers/filename.pdf


    const connection = await db.getConnection(); // Get a connection for transaction

    try {
        await connection.beginTransaction();

        // 1. Handle ISSN, Volume, PageNo (ISSN_Volumes)
        // This part is tricky because ISSN_Volumes references Journals(ISSN)
        // For simplicity, assume Journal and Publisher exist or handle their creation separately.
        // Here, we'll assume Journal with given ISSN exists.
        // If ISSN, VolumeNo, PageNo are provided, try to insert/find in ISSN_Volumes
        let issnVolumePageExists = false;
        if (ISSN && VolumeNo && PageNo) {
            try {
                const [existingVolume] = await connection.query(
                    'SELECT * FROM ISSN_Volumes WHERE ISSN = ? AND VolumeNo = ? AND PageNo = ?',
                    [ISSN, parseInt(VolumeNo), parseInt(PageNo)]
                );
                if (existingVolume.length > 0) {
                    issnVolumePageExists = true;
                } else {
                    // Check if Journal with ISSN exists before inserting
                    const [journalExists] = await connection.query('SELECT JournalID FROM Journals WHERE ISSN = ?', [ISSN]);
                    if (journalExists.length === 0) {
                        // Option 1: Error out - Journal must exist
                        // await connection.rollback();
                        // return res.status(400).json({ message: `Journal with ISSN ${ISSN} not found. Cannot add to ISSN_Volumes.`});

                        // Option 2: Create a placeholder Journal (less ideal without more info like JournalName)
                        // For now, let's assume the frontend ensures the Journal exists or we skip ISSN_Volumes if not found.
                        console.warn(`Journal with ISSN ${ISSN} not found. Skipping ISSN_Volumes entry for this paper.`);
                    } else {
                        await connection.query(
                            'INSERT IGNORE INTO ISSN_Volumes (ISSN, VolumeNo, PageNo) VALUES (?, ?, ?)',
                            [ISSN, parseInt(VolumeNo), parseInt(PageNo)]
                        );
                        issnVolumePageExists = true; // Assume it's now usable
                    }
                }
            } catch (volError) {
                // This might fail if the ISSN doesn't exist in Journals table due to FK constraint
                console.warn(`Could not insert into ISSN_Volumes for ISSN ${ISSN}: ${volError.message}. Paper will be uploaded without Volume/Page.`);
            }
        }


        // 2. Insert into ResearchPapers
        const paperSql = `INSERT INTO ResearchPapers
            (ISSN, VolumeNo, PageNo, PaperTitle, PaperAbstract, PaperKeywords, PublicationDate, DOI, PublisherID, UploadedBy, FilePath)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [paperResult] = await connection.query(paperSql, [
            (ISSN && issnVolumePageExists) ? ISSN : null,
            (VolumeNo && issnVolumePageExists) ? parseInt(VolumeNo) : null,
            (PageNo && issnVolumePageExists) ? parseInt(PageNo) : null,
            PaperTitle,
            PaperAbstract,
            PaperKeywords,
            PublicationDate, // Ensure this is in 'YYYY-MM-DD' format
            DOI,
            PublisherID ? parseInt(PublisherID) : null,
            UploadedBy,
            FilePath // Relative path from 'uploads' dir for client access
        ]);
        const paperId = paperResult.insertId;

        // 3. Handle Authors and PaperAuthors
        if (authors && authors.length > 0) {
            const parsedAuthors = typeof authors === 'string' ? JSON.parse(authors) : authors;

            for (const authorData of parsedAuthors) {
                let authorId;
                // Check if author exists by email or name (prefer email)
                let existingAuthor = null;
                if (authorData.AuthorEmail) {
                    const [authorsFound] = await connection.query('SELECT AuthorID FROM Authors WHERE AuthorEmail = ?', [authorData.AuthorEmail]);
                    if (authorsFound.length > 0) existingAuthor = authorsFound[0];
                } else if (authorData.AuthorName && authorData.AuthorAffiliation) { // Fallback to name + affiliation
                    const [authorsFound] = await connection.query('SELECT AuthorID FROM Authors WHERE AuthorName = ? AND AuthorAffiliation = ?', [authorData.AuthorName, authorData.AuthorAffiliation]);
                    if (authorsFound.length > 0) existingAuthor = authorsFound[0];
                }


                if (existingAuthor) {
                    authorId = existingAuthor.AuthorID;
                } else {
                    // Create new author
                    const authorSql = `INSERT INTO Authors (AuthorName, AuthorEmail, AuthorAffiliation, UserID)
                                       VALUES (?, ?, ?, ?)`;
                    // If the author is the uploader, link to their UserID
                    let authorUserID = null;
                    if (authorData.AuthorEmail === req.user.Email) { // crude check
                        authorUserID = req.user.UserID;
                    }

                    const [newAuthorResult] = await connection.query(authorSql, [
                        authorData.AuthorName,
                        authorData.AuthorEmail || null,
                        authorData.AuthorAffiliation || null,
                        authorUserID
                    ]);
                    authorId = newAuthorResult.insertId;
                }

                // Link author to paper in PaperAuthors
                await connection.query('INSERT INTO PaperAuthors (PaperID, AuthorID) VALUES (?, ?)', [paperId, authorId]);
            }
        }

        await connection.commit();
        res.status(201).json({
            message: 'Paper uploaded successfully',
            paperId: paperId,
            filePath: FilePath
        });

    } catch (error) {
        await connection.rollback();
        console.error('Paper upload error:', error);
        // If file was uploaded but DB transaction failed, you might want to delete the file
        // fs.unlinkSync(FilePath);
        res.status(500).json({ message: 'Server error during paper upload', error: error.message });
    } finally {
        connection.release();
    }
};

// @desc    Get all papers (with basic info for listing)
// @route   GET /api/papers
// @access  Public
const getPapers = async (req, res) => {
    try {
        // Simple query for now. Enhance with author names, pagination etc. later
        const sql = `
            SELECT
                rp.PaperID, rp.PaperTitle, rp.PaperAbstract, rp.PublicationDate, rp.DOI, rp.CitationCount,
                u.FullName AS UploaderName,
                GROUP_CONCAT(DISTINCT a.AuthorName ORDER BY a.AuthorName SEPARATOR ', ') as AuthorNames
            FROM ResearchPapers rp
            LEFT JOIN Users u ON rp.UploadedBy = u.UserID
            LEFT JOIN PaperAuthors pa ON rp.PaperID = pa.PaperID
            LEFT JOIN Authors a ON pa.AuthorID = a.AuthorID
            GROUP BY rp.PaperID
            ORDER BY rp.PublicationDate DESC;
        `;
        const [papers] = await db.query(sql);
        res.json(papers);
    } catch (error) {
        console.error('Get papers error:', error);
        res.status(500).json({ message: 'Server error fetching papers', error: error.message });
    }
};

// @desc    Get single paper details
// @route   GET /api/papers/:id
// @access  Public
const getPaperById = async (req, res) => {
    try {
        const paperId = req.params.id;
        const paperSql = `
            SELECT
                rp.*,
                u.FullName AS UploaderFullName, u.Email AS UploaderEmail,
                p.PublisherName,
                j.JournalName
            FROM ResearchPapers rp
            LEFT JOIN Users u ON rp.UploadedBy = u.UserID
            LEFT JOIN Publishers p ON rp.PublisherID = p.PublisherID
            LEFT JOIN Journals j ON rp.ISSN = j.ISSN
            WHERE rp.PaperID = ?;
        `;
        const [paperRows] = await db.query(paperSql, [paperId]);

        if (paperRows.length === 0) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        const paper = paperRows[0];

        // Get authors for the paper
        const authorsSql = `
            SELECT a.AuthorID, a.AuthorName, a.AuthorEmail, a.AuthorAffiliation
            FROM Authors a
            JOIN PaperAuthors pa ON a.AuthorID = pa.AuthorID
            WHERE pa.PaperID = ?;
        `;
        const [authors] = await db.query(authorsSql, [paperId]);
        paper.authors = authors;

        // TODO: Get Citations, Discussions for this paper

        res.json(paper);
    } catch (error) {
        console.error('Get paper by ID error:', error);
        res.status(500).json({ message: 'Server error fetching paper details', error: error.message });
    }
};


module.exports = {
    uploadPaper,
    getPapers,
    getPaperById
    // Add other controllers: updatePaper, deletePaper, etc.
};