import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './LetterView.css';

function LetterView() {
  const { letterId } = useParams();
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const letterRef = useRef(null);
  const containerRef = useRef(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        setShowScrollTop(scrollTop > 300);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const generatePDF = async () => {
    if (!letter || generatingPDF) return;
    
    setGeneratingPDF(true);
    
    try {
      const element = letterRef.current;
      if (!element) return;

      // Create a temporary container for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px';
      tempContainer.style.overflow = 'visible';
      tempContainer.style.height = 'auto';
      tempContainer.style.minHeight = 'auto';
      
      // Clone the letter content and ensure it's fully expanded
      const letterContent = element.cloneNode(true);
      
      // Remove any max-height or overflow restrictions from cloned content
      const allElements = letterContent.querySelectorAll('*');
      allElements.forEach(el => {
        el.style.maxHeight = 'none';
        el.style.overflow = 'visible';
        el.style.height = 'auto';
      });
      
      tempContainer.appendChild(letterContent);
      document.body.appendChild(tempContainer);

      // Wait a bit for the DOM to fully render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get the actual scroll height after content is rendered
      const actualHeight = tempContainer.scrollHeight;
      
      // Generate canvas from the element with proper height
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#fff',
        width: 800,
        height: actualHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 800,
        windowHeight: actualHeight
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename
      const date = letter.createdAt?.toDate ? letter.createdAt.toDate() : new Date(letter.createdAt);
      const formattedDate = date.toISOString().split('T')[0];
      const filename = `letter_${formattedDate}_${letterId}.pdf`;

      // Download PDF
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

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
    <div className="letter-view-wrapper" ref={containerRef}>
      <div className="letter-view-container">
        <div className="letter-paper" ref={letterRef}>
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
          <button 
            className="download-pdf-btn"
            onClick={generatePDF}
            disabled={generatingPDF}
          >
            {generatingPDF ? 'Generating PDF...' : '📄 Download PDF'}
          </button>
          <p>Created with ❤️ using Letterly</p>
          <a href="/" className="create-your-own">
            Create your own letter
          </a>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          className="scroll-to-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default LetterView; 