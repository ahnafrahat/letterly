import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './Dashboard.css';

function EditLetter({ user }) {
  const [letterContent, setLetterContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [letter, setLetter] = useState(null);
  const navigate = useNavigate();
  const { letterId } = useParams();

  useEffect(() => {
    fetchLetter();
  }, [letterId]);

  const fetchLetter = async () => {
    try {
      const letterDoc = await getDoc(doc(db, 'letters', letterId));
      if (letterDoc.exists()) {
        const letterData = letterDoc.data();
        // Check if the letter belongs to the current user
        if (letterData.userId !== user.uid) {
          alert('You can only edit your own letters.');
          navigate('/my-letters');
          return;
        }
        setLetter(letterData);
        setLetterContent(letterData.content);
      } else {
        alert('Letter not found.');
        navigate('/my-letters');
      }
    } catch (error) {
      console.error('Error fetching letter:', error);
      alert('Error loading letter. Please try again.');
      navigate('/my-letters');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSave = async () => {
    if (!letterContent.trim()) {
      alert('Please write something in your letter!');
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, 'letters', letterId), {
        content: letterContent,
        updatedAt: new Date()
      });

      alert('Letter updated successfully!');
      navigate(`/preview/${letterId}`);
    } catch (error) {
      console.error('Error updating letter:', error);
      alert('Error updating letter. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/my-letters');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Letterly</h1>
            <div className="user-info">
              <span>Welcome, {user.email}</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="dashboard-content">
          <div className="loading-letters">
            <div className="loading-spinner"></div>
            <p>Loading letter...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Letterly</h1>
          <div className="user-info">
            <span>Welcome, {user.email}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="letter-editor">
          <div className="editor-header">
            <h2>Edit Your Letter</h2>
            <div className="editor-actions">
              <button onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !letterContent.trim()}
                className="save-button"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
          
          <p className="editor-subtitle">
            Make changes to your letter. Click Save Changes when you're done.
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
        </div>
      </div>
    </div>
  );
}

export default EditLetter; 