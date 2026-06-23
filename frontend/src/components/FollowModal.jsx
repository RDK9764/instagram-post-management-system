import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FollowModal({
  username,
  userId,
  onClose,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener(
      "keydown",
      handleEscape
    );
    return () =>
      document.removeEventListener(
        "keydown",
        handleEscape
      );
  }, [onClose]);

  const handleVisitProfile = () => {
    navigate(`/profile/${userId}`);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="modal-glow" />

        <div className="modal-icon">🎉</div>

        <h2 className="modal-title">
          You are now following{" "}
          <span className="modal-username">
            {username}
          </span>
        </h2>

        <p className="modal-message">
          You can now view {username}'s
          profile and posts.
        </p>

        <div className="modal-actions">

          <button
            className="modal-btn-primary"
            onClick={handleVisitProfile}
          >
            Visit Profile
          </button>

          <button
            className="modal-btn-secondary"
            onClick={onClose}
          >
            Stay Here
          </button>

        </div>

      </div>
    </div>
  );
}

export default FollowModal;
