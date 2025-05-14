import React, { useState, useEffect, useCallback } from 'react';
// Đảm bảo cả getDanhGia và addDanhGia được export từ apiDanhGia.jsx
import { getDanhGia, addDanhGia } from '../../../../DAL/apiDanhGia'; 
import './css/DanhGia.css'; 

// Component Star (giữ nguyên như bạn đã có)
const Star = ({ starId, filled, partiallyFilled, onClick, onMouseEnter, onMouseLeave }) => {
  let fillPercentage = '0%';
  if (filled) {
    fillPercentage = '100%';
  } else if (partiallyFilled && partiallyFilled > 0 && partiallyFilled < 1) {
    fillPercentage = `${partiallyFilled * 100}%`;
  }

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className={`star ${filled || partiallyFilled > 0 ? 'filled' : ''}`}
    >
      <defs>
        <linearGradient id={`grad-${starId}`}>
          <stop offset="0%" stopColor="gold" />
          <stop offset={fillPercentage} stopColor="gold" />
          <stop offset={fillPercentage} stopColor="lightgray" />
          <stop offset="100%" stopColor="lightgray" />
        </linearGradient>
      </defs>
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        fill={`url(#grad-${starId})`}
      />
    </svg>
  );
};


const DanhGia = ({ maHangHoa }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [averageRating, setAverageRating] = useState(0);
  const [totalApprovedReviews, setTotalApprovedReviews] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentUserRating, setCurrentUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  const currentUserId = localStorage.getItem("IDTaiKhoan");

  const calculateStats = useCallback((currentReviews) => {
    const approvedReviewsForStats = currentReviews.filter(r => r && r.TrangThai === 'Đã duyệt');
    console.log("Đánh giá đã duyệt cho thống kê:", approvedReviewsForStats);
    setTotalApprovedReviews(approvedReviewsForStats.length);

    if (approvedReviewsForStats.length === 0) {
      setAverageRating(0);
      setRatingCounts({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      return;
    }

    const sumOfRatings = approvedReviewsForStats.reduce((acc, review) => {
        const rating = parseInt(review.SoSao, 10);
        return acc + (isNaN(rating) ? 0 : rating);
    }, 0);
    setAverageRating(sumOfRatings / approvedReviewsForStats.length);

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    approvedReviewsForStats.forEach(review => {
      const ratingKey = parseInt(review.SoSao, 10);
      if (!isNaN(ratingKey) && counts[ratingKey] !== undefined) {
        counts[ratingKey]++;
      }
    });
    setRatingCounts(counts);
  }, []);


  useEffect(() => {
    if (!maHangHoa) {
      setReviews([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const loadReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiResponse = await getDanhGia(maHangHoa);
        if (apiResponse.success && Array.isArray(apiResponse.data)) {
          setReviews(apiResponse.data);
          calculateStats(apiResponse.data);
        } else if (apiResponse.success && apiResponse.data && apiResponse.data.length === 0) {
          setReviews([]);
        } else {
          setError(apiResponse.error || apiResponse.message || "Không thể tải đánh giá.");
          setReviews([]);
        }
      } catch (err) {
        console.error("Lỗi khi tải đánh giá trong component:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải đánh giá.");
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadReviews();
  }, [maHangHoa]);

  useEffect(() => {
    calculateStats(reviews);
  }, [reviews, calculateStats]);


  const handleStarClick = (rating) => {
    setCurrentUserRating(rating);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
        setSubmitStatus('error');
        setSubmitMessage('Bạn cần đăng nhập để gửi đánh giá.');
        setTimeout(() => { setSubmitStatus(''); setSubmitMessage(''); }, 3000);
        return;
    }
    if (currentUserRating === 0) {
      setSubmitStatus('error');
      setSubmitMessage('Vui lòng chọn số sao đánh giá.');
      setTimeout(() => { setSubmitStatus(''); setSubmitMessage(''); }, 3000);
      return;
    }
    if (comment.trim() === '') {
      setSubmitStatus('error');
      setSubmitMessage('Vui lòng nhập bình luận của bạn.');
      setTimeout(() => { setSubmitStatus(''); setSubmitMessage(''); }, 3000);
      return;
    }
    if (comment.length > 255) {
        setSubmitStatus('error');
        setSubmitMessage('Bình luận không được vượt quá 255 ký tự.');
        setTimeout(() => { setSubmitStatus(''); setSubmitMessage(''); }, 3000);
        return;
    }

    setSubmitStatus('submitting');
    setSubmitMessage('Đang gửi đánh giá...');

    try {
      const reviewDataToSubmit = {
        MaHangHoa: maHangHoa,
        IDTaiKhoan: currentUserId,
        SoSao: currentUserRating,
        BinhLuan: comment,
      };

      const apiResponse = await addDanhGia(reviewDataToSubmit);

      if (apiResponse.success && apiResponse.data) {
        const newReviewFromServer = apiResponse.data; 
        if (!newReviewFromServer.TrangThai) {
            console.warn("API addDanhGia không trả về trường 'TrangThai'. Mặc định là 'Chưa duyệt' cho hiển thị.");
            newReviewFromServer.TrangThai = 'Chưa duyệt';
        }
        console.log("Đánh giá mới từ API addDanhGia:", newReviewFromServer);
        setReviews(prevReviews => [newReviewFromServer, ...prevReviews]);
        setSubmitStatus('success');
        setSubmitMessage(apiResponse.message || "Đánh giá của bạn đã được gửi và đang chờ duyệt!");
        setTimeout(() => {
          setShowReviewForm(false);
          setCurrentUserRating(0);
          setComment('');
          setSubmitStatus('');
          setSubmitMessage('');
        }, 2000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(apiResponse.error || apiResponse.message || "Không thể gửi đánh giá. Vui lòng thử lại.");
        setTimeout(() => { setSubmitStatus(''); setSubmitMessage(''); }, 5000);
      }
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      setSubmitStatus('error');
      setSubmitMessage(err.message || "Đã xảy ra lỗi kết nối. Vui lòng thử lại.");
      setTimeout(() => { setSubmitStatus(''); setSubmitMessage(''); }, 5000);
    }
  };

  const renderStarsDisplay = (ratingValue) => {
    const stars = [];
    const numericRating = parseFloat(ratingValue, 10);
    if (isNaN(numericRating) || numericRating < 0) {
        for (let i = 1; i <= 5; i++) {
            stars.push(<Star key={`display-empty-${i}`} starId={`display-empty-${maHangHoa || 'avg'}-${i}-${Math.random()}`} filled={false} />);
        }
        return stars;
    }

    const fullStars = Math.floor(numericRating);
    const partialStarValue = numericRating % 1;

    for (let i = 1; i <= 5; i++) {
      let filled = i <= fullStars;
      let currentPartiallyFilled = 0;
      if (i === fullStars + 1 && partialStarValue > 0) { 
        filled = false;
        currentPartiallyFilled = partialStarValue;
      }
      stars.push(
        <Star
          key={`display-${i}`}
          starId={`display-${maHangHoa || 'avg'}-${i}-${Math.random()}`}
          filled={filled}
          partiallyFilled={currentPartiallyFilled}
        />
      );
    }
    return stars;
  };

  const renderStarsInput = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={`input-${i}`}
          starId={`input-${maHangHoa || 'form'}-${i}-${Math.random()}`}
          filled={(hoverRating || currentUserRating) >= i}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
        />
      );
    }
    return stars;
  };
  
  const displayableReviews = reviews.filter(review => review); 
  
  const getStatusClass = (statusValue) => {
    if (!statusValue) return 'review-item-unknown'; 
    return `review-item-${statusValue.replace(/\s+/g, '_').toLowerCase()}`;
  };

  const formatReviewDate = (dateTimeString) => {
    if (!dateTimeString) return 'Không rõ ngày';
    try {
      return new Date(dateTimeString).toLocaleDateString('vi-VN', {
        year: 'numeric', month: 'numeric', day: 'numeric',
      });
    } catch (e) {
      return 'Ngày không hợp lệ';
    }
  };


  if (isLoading && reviews.length === 0) {
    return <div className="review-section"><p>Đang tải đánh giá...</p></div>;
  }

  if (error && (!reviews || reviews.length === 0)) {
    return <div className="review-section"><p>Lỗi: {error}</p></div>;
  }

  return (
    <div className="review-section">
      <h2>Đánh giá sản phẩm</h2>
      <div className="average-rating-summary">
        <div className="average-stars">
          {renderStarsDisplay(averageRating)}
        </div>
        <span className="average-rating-text">
          {averageRating > 0 ? averageRating.toFixed(1) : 'Chưa có'} trên 5 sao
        </span>
        <span className="total-reviews-text">({totalApprovedReviews} đánh giá đã duyệt)</span>
      </div>

      <div className="rating-distribution">
        <h4>Thống kê (dựa trên đánh giá đã duyệt):</h4>
        {[5, 4, 3, 2, 1].map(starValue => (
          <div key={starValue} className="rating-bar-container">
            <span>{starValue} sao</span>
            <div className="rating-bar">
              <div
                className="rating-bar-filled"
                style={{ width: `${totalApprovedReviews > 0 && ratingCounts[starValue] ? (ratingCounts[starValue] / totalApprovedReviews) * 100 : 0}%` }}
              ></div>
            </div>
            <span>({ratingCounts[starValue] || 0})</span>
          </div>
        ))}
      </div>

      {!showReviewForm && currentUserId && (
        <button onClick={() => setShowReviewForm(true)} className="btn-write-review">
          Viết đánh giá
        </button>
      )}
       {!currentUserId && (
         <p>Vui lòng <a href="/dangnhap">đăng nhập</a> để viết đánh giá.</p>
       )}


      {showReviewForm && (
        <div className="review-form-container">
          <h3>Đánh giá của bạn</h3>
          <form onSubmit={handleReviewSubmit}>
            <div className="form-group">
              <label>Chọn số sao:</label>
              <div className="star-input">
                {renderStarsInput()}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="comment">Bình luận của bạn (tối đa 255 ký tự):</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                maxLength="255"
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
              ></textarea>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-submit-review" disabled={submitStatus === 'submitting'}>
                {submitStatus === 'submitting' ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
              <button type="button" onClick={() => { setShowReviewForm(false); setCurrentUserRating(0); setComment(''); setSubmitStatus(''); setSubmitMessage('');}} className="btn-cancel-review">
                Hủy
              </button>
            </div>
            {submitMessage && (
              <p className={`submit-message submit-message-${submitStatus}`}>{submitMessage}</p>
            )}
          </form>
        </div>
      )}

      <div className="existing-reviews">
        <h3>Các đánh giá ({displayableReviews.length})</h3>
        {isLoading && reviews.length > 0 && <p>Đang cập nhật...</p>} 
        {displayableReviews.length > 0 ? (
          displayableReviews.map(review => (
            <div 
              key={review.IDDanhGia}
              className={`review-item ${getStatusClass(review.TrangThai)}`}
            >
              <div className="review-header">
                <strong>{review.TaiKhoan || 'Người dùng ẩn danh'}</strong>
                <span className="review-date">{formatReviewDate(review.ThoiGian)}</span>
              </div>
              <div className="review-stars">
                {renderStarsDisplay(review.SoSao)}
              </div>
              <p className="review-comment">{review.BinhLuan || 'Không có bình luận.'}</p>
              {review.TrangThai === 'Chưa duyệt' && (
                <div className="review-status-indicator">
                  <em>(Đang chờ duyệt)</em>
                </div>
              )}
            </div>
          ))
        ) : (
          !isLoading && <p>Chưa có đánh giá nào cho sản phẩm này.</p>
        )}
      </div>
    </div>
  );
};

export default DanhGia;