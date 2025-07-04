import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './LetterView.css';

function LetterView() {
  const { letterId } = useParams();
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const letterDoc = await getDoc(doc(db, 'letters', letterId));
        if (letterDoc.exists()) {
          setLetter({ id: letterDoc.id, ...letterDoc.data() });
        } else {
          setError('Letter not found');
        }
      } catch (error) {
        console.error('Error fetching letter:', error);
        setError('Error loading letter');
      } finally {
        setLoading(false);
      }
    };

    fetchLetter();
  }, [letterId]);

  if (loading) {
    return (
      <div className="letter-view-loading">
        <div className="loading-spinner"></div>
        <p>Loading letter...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="letter-view-error">
        <h1>Letter Not Found</h1>
        <p>{error}</p>
        <p>The letter you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  if (!letter) {
    return null;
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="letter-view-container">
      <div className="letter-paper">
        <div className="letter-header">
          <div className="letter-date">
            {formatDate(letter.createdAt)}
          </div>
        </div>
        
        <div className="letter-body">
          <pre className="letter-content">{letter.content}</pre>
        </div>
        
        <div className="letter-footer">
          <div className="letter-signature">
            <p>With warm regards,</p>
            <p className="sender-email">{letter.userEmail}</p>
          </div>
        </div>
      </div>
      
      <div className="letter-view-footer">
        <p>Created with ❤️ using Letterly</p>
        <a href="/" className="create-your-own">
          Create your own letter
        </a>
      </div>
    </div>
  );
}

export default LetterView; 