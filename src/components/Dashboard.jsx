import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Dashboard.css';

function Dashboard({ user }) {
  const [letterContent, setLetterContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCreateLetter = async () => {
    if (!letterContent.trim()) {
      alert('Please write something in your letter!');
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'letters'), {
        content: letterContent,
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
        letterId: Math.random().toString(36).substr(2, 9)
      });

      // Navigate to preview page with the letter ID
      navigate(`/preview/${docRef.id}`);
    } catch (error) {
      console.error('Error creating letter:', error);
      alert('Error creating letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Letterly</h1>
          <div className="user-info">
            <span>Welcome, {user.email}</span>
            <div className="nav-buttons">
              <button onClick={() => navigate('/my-letters')} className="nav-button">
                My Letters
              </button>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="letter-editor">
          <h2>Write Your Letter</h2>
          <p className="editor-subtitle">
            Write your letter in any language. Share it with anyone using the generated link or QR code.
          </p>
          
          <div className="editor-container">
            <textarea
              value={letterContent}
              onChange={(e) => setLetterContent(e.target.value)}
              placeholder="Dear friend,&#10;&#10;Write your beautiful letter here...&#10;&#10;Best regards,&#10;[Your name]"
              className="letter-textarea"
              rows="15"
            />
          </div>
          
          <button
            onClick={handleCreateLetter}
            disabled={loading || !letterContent.trim()}
            className="create-letter-button"
          >
            {loading ? 'Creating Letter...' : 'Create New Letter'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 