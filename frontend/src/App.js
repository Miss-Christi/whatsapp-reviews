import React, { useEffect, useState } from 'react';

function App() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await fetch('https://whatsapp-reviews-1.onrender.com/api/reviews');
      const data = await response.json();
      setReviews(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    const interval = setInterval(fetchReviews, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📢 Customer Voice</h1>
          <p style={styles.subtitle}>Real-time feedback from WhatsApp</p>
        </div>
        <div style={styles.liveIndicator}>
          <span style={styles.dot}></span> Live Feed
        </div>
      </div>

      {/* Reviews Grid */}
      <div style={styles.grid}>
        {reviews.length === 0 && !loading ? (
          <div style={styles.emptyState}>No reviews yet. Waiting for WhatsApp messages...</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.avatar}>{review.user_name.charAt(0).toUpperCase()}</div>
                <div>
                  <h3 style={styles.userName}>{review.user_name}</h3>
                  <span style={styles.timestamp}>{new Date(review.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
              
              <div style={styles.productTag}>
                Purchased: <strong>{review.product_name}</strong>
              </div>
              
              <p style={styles.reviewText}>"{review.product_review}"</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --- CSS-in-JS Styles ---
const styles = {
  container: {
    padding: "40px",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    maxWidth: "1000px",
    margin: "0 auto 40px auto",
  },
  title: { margin: 0, color: "#1a202c", fontSize: "28px" },
  subtitle: { margin: "5px 0 0 0", color: "#718096" },
  liveIndicator: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#def7ec",
    color: "#03543f",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "14px",
  },
  dot: {
    height: "10px",
    width: "10px",
    backgroundColor: "#38a169",
    borderRadius: "50%",
    display: "inline-block",
    marginRight: "8px",
    boxShadow: "0 0 0 2px #c6f6d5",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "25px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    transition: "transform 0.2s",
    border: "1px solid #e2e8f0",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#3182ce",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    marginRight: "12px",
  },
  userName: { margin: 0, fontSize: "16px", color: "#2d3748" },
  timestamp: { fontSize: "12px", color: "#a0aec0" },
  productTag: {
    display: "inline-block",
    backgroundColor: "#ebf8ff",
    color: "#2b6cb0",
    padding: "4px 12px",
    borderRadius: "15px",
    fontSize: "13px",
    marginBottom: "15px",
  },
  reviewText: {
    color: "#4a5568",
    lineHeight: "1.6",
    fontStyle: "italic",
    margin: 0,
  },
  emptyState: {
    textAlign: "center",
    gridColumn: "1 / -1",
    padding: "40px",
    color: "#718096",
    fontSize: "18px",
  }
};

export default App;