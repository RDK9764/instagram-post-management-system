import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserListModal({
  title,
  users,
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

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-content userlist-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="modal-glow" />

        <h2 className="userlist-title">
          {title}
        </h2>

        {users.length === 0 ? (
          <p className="userlist-empty">
            No users yet.
          </p>
        ) : (
          <div className="userlist-items">
            {users.map((user) => (
              <div
                key={user.id}
                className="userlist-card"
                onClick={() =>
                  handleUserClick(
                    user.id
                  )
                }
              >
                <div className="userlist-avatar">
                  {user.username
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="userlist-info">
                  <h4>
                    {user.username}
                  </h4>
                  <p>{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className="modal-btn-secondary userlist-close-btn"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default UserListModal;
