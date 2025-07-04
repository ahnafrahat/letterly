import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { QRCodeSVG } from 'qrcode.react';
import './LetterPreview.css';

function LetterPreview() {
  const { letterId } = useParams();
  const navigate = useNavigate();
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const letterDoc = await getDoc(doc(db, 'letters', letterId));
        if (letterDoc.exists()) {
          setLetter({ id: letterDoc.id, ...letterDoc.data() });
        } else {
          alert('Letter not found!');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching letter:', error);
        alert('Error loading letter. Please try again.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLetter();
  }, [letterId, navigate]);

  const letterUrl = `${window.location.origin}/letter/${letterId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(letterUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
      alert('Error copying link. Please copy manually.');
    }
  };

  const handleCreateNewLetter = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="preview-loading">
        <div className="loading-spinner"></div>
        <p>Loading your letter...</p>
      </div>
    );
  }

  if (!letter) {
    return null;
  }

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h1>Letter Created Successfully!</h1>
        <p>Your letter has been saved and is ready to share.</p>
      </div>

      <div className="preview-content">
        <div className="letter-preview">
          <h3>Preview:</h3>
          <div className="letter-content">
            <pre>{letter.content}</pre>
          </div>
        </div>

        <div className="share-section">
          <h3>Share Your Letter</h3>
          
          <div className="link-section">
            <label>Letter Link:</label>
            <div className="link-container">
              <input
                type="text"
                value={letterUrl}
                readOnly
                className="link-input"
              />
              <button onClick={handleCopyLink} className="copy-button">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="qr-section">
            <label>QR Code:</label>
            <div className="qr-container">
              <QRCodeSVG value={letterUrl} size={200} />
              <p>Scan this QR code to view the letter</p>
            </div>
          </div>
        </div>

        <div className="preview-actions">
          <button onClick={handleCreateNewLetter} className="new-letter-button">
            Create Another Letter
          </button>
        </div>
      </div>
    </div>
  );
}

export default LetterPreview; 