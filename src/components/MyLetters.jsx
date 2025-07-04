import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './Dashboard.css';

function MyLetters({ user }) {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserLetters();
  }, []);

  const fetchUserLetters = async () => {
    try {
      const q = query(collection(db, 'letters'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const lettersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLetters(lettersData);
    } catch (error) {
      console.error('Error fetching letters:', error);
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

  const handleDelete = async (letterId) => {
    if (window.confirm('Are you sure you want to delete this letter? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'letters', letterId));
        setLetters(letters.filter(letter => letter.id !== letterId));
        alert('Letter deleted successfully!');
      } catch (error) {
        console.error('Error deleting letter:', error);
        alert('Error deleting letter. Please try again.');
      }
    }
  };

  const handlePreview = (letterId) => {
    navigate(`/preview/${letterId}`);
  };

  const handleEdit = (letterId) => {
    navigate(`/edit/${letterId}`);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Letterly</h1>
          <div className="user-info">
            <span>Welcome, {user.email}</span>
            <div className="nav-buttons">
              <button onClick={() => navigate('/dashboard')} className="nav-button">
                Create Letter
              </button>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="my-letters-container">
          <div className="my-letters-header">
            <h2>My Letters</h2>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="create-new-button"
            >
              Create New Letter
            </button>
          </div>

          {loading ? (
            <div className="loading-letters">
              <div className="loading-spinner"></div>
              <p>Loading your letters...</p>
            </div>
          ) : letters.length === 0 ? (
            <div className="no-letters">
              <p>You haven't created any letters yet.</p>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="create-first-letter-button"
              >
                Create Your First Letter
              </button>
            </div>
          ) : (
            <div className="letters-grid">
              {letters.map((letter) => (
                <div key={letter.id} className="letter-card">
                  <div className="letter-card-header">
                    <span className="letter-date">{formatDate(letter.createdAt)}</span>
                    <span className="letter-id">ID: {letter.letterId}</span>
                  </div>
                  <div className="letter-content">
                    <p>{truncateContent(letter.content)}</p>
                  </div>
                  <div className="letter-actions">
                    <button 
                      onClick={() => handlePreview(letter.id)}
                      className="preview-button"
                    >
                      Preview
                    </button>
                    <button 
                      onClick={() => handleEdit(letter.id)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(letter.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyLetters; 