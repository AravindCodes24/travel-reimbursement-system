import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiMail, FiCheck, FiX, FiClock } from "react-icons/fi";
import {
  fetchPendingUsersStart,
  approveUserStart,
  rejectUserStart,
  setSortConfig,
} from "../../features/hr/hrUserSlice";

const HrUserApprovalDashboard = () => {
  const dispatch = useDispatch();
  const { pendingUsers, loading, error, sortConfig } = useSelector(
    (state) => state.userApproval
  );

  useEffect(() => {
    dispatch(fetchPendingUsersStart());
  }, [dispatch]);

  const handleAccept = (userId) => {
    dispatch(approveUserStart(userId));
    toast.success("User approved successfully!");
  };

  const handleReject = (userId) => {
    dispatch(rejectUserStart(userId));
    toast.success("User rejected successfully.");
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    dispatch(setSortConfig({ key, direction }));
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...pendingUsers];
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [pendingUsers, sortConfig]);

  return (
    <div style={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      <header style={styles.header}>
        <h1 style={styles.title}>User Approval Dashboard</h1>
        <div style={styles.stats}>
          <span style={styles.statBadge}>
            <FiClock style={{ marginRight: 6 }} />
            {pendingUsers.length} Pending Approval
          </span>
        </div>
      </header>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading pending approvals...</p>
        </div>
      ) : error ? (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
          <button
            style={styles.retryButton}
            onClick={() => dispatch(fetchPendingUsersStart())}
          >
            Retry
          </button>
        </div>
      ) : pendingUsers.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIllustration}></div>
          <h3 style={styles.emptyTitle}>No pending approvals</h3>
          <p style={styles.emptyText}>All user requests have been processed.</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th
                  style={styles.tableHeader}
                  onClick={() => requestSort("username")}
                >
                  <div style={styles.headerContent}>
                    User
                    {sortConfig.key === "username" && (
                      <span style={styles.sortIndicator}>
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  style={styles.tableHeader}
                  onClick={() => requestSort("email")}
                >
                  <div style={styles.headerContent}>
                    Email
                    {sortConfig.key === "email" && (
                      <span style={styles.sortIndicator}>
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  style={styles.tableHeader}
                  onClick={() => requestSort("role")}
                >
                  <div style={styles.headerContent}>
                    Role
                    {sortConfig.key === "role" && (
                      <span style={styles.sortIndicator}>
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  style={styles.tableHeader}
                  onClick={() => requestSort("employeeId")}
                >
                  <div style={styles.headerContent}>
                    Employee ID
                    {sortConfig.key === "employeeId" && (
                      <span style={styles.sortIndicator}>
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th style={{ ...styles.tableHeader, textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user._id} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    <div style={styles.userCell}>
                      <div style={styles.avatar}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={styles.userName}>{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.emailCell}>
                      <FiMail style={styles.detailIcon} />
                      {user.email}
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.roleBadge}>{user.role}</div>
                  </td>
                  <td style={styles.tableCell}>
                    {user.employeeId || "N/A"}
                  </td>
                  <td style={{ ...styles.tableCell, textAlign: "right" }}>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => handleAccept(user._id)}
                        style={styles.acceptBtn}
                        title="Approve user"
                      >
                        <FiCheck /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(user._id)}
                        style={styles.rejectBtn}
                        title="Reject user"
                      >
                        <FiX /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


const styles = {
  container: {
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#f8fafc",
    minHeight: "72vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #e2e8f0",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0,
  },
  stats: {
    display: "flex",
    gap: "0.5rem",
  },
  statBadge: {
    backgroundColor: "#e2e8f0",
    color: "#475569",
    padding: "0.5rem 1rem",
    borderRadius: "9999px",
    fontSize: "0.875rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "50vh",
  },
  spinner: {
    border: "4px solid rgba(0, 0, 0, 0.1)",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    borderLeftColor: "#3b82f6",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem",
  },
  loadingText: {
    color: "#64748b",
    fontSize: "1rem",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "50vh",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "1rem",
    marginBottom: "1rem",
  },
  retryButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#2563eb",
    },
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "50vh",
    textAlign: "center",
  },
  emptyIllustration: {
    width: "120px",
    height: "120px",
    backgroundColor: "#e2e8f0",
    borderRadius: "50%",
    marginBottom: "1rem",
  },
  emptyTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0.5rem 0",
  },
  emptyText: {
    color: "#64748b",
    fontSize: "1rem",
    maxWidth: "400px",
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "0.75rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    padding: "1rem",
    textAlign: "left",
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    fontWeight: "600",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#e2e8f0",
    },
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  sortIndicator: {
    fontSize: "0.75rem",
  },
  tableRow: {
    borderBottom: "1px solid #e2e8f0",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#f8fafc",
    },
  },
  tableCell: {
    padding: "1rem",
    fontSize: "0.9375rem",
    color: "#475569",
    verticalAlign: "middle",
  },
  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
    fontWeight: "600",
  },
  userName: {
    fontWeight: "500",
    color: "#1e293b",
  },
  employeeId: {
    fontSize: "0.75rem",
    color: "#64748b",
    marginTop: "0.25rem",
  },
  emailCell: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  detailIcon: {
    color: "#94a3b8",
  },
  roleBadge: {
    display: "inline-block",
    padding: "0.25rem 0.5rem",
    borderRadius: "9999px",
    backgroundColor: "#e2e8f0",
    color: "#475569",
    fontSize: "0.75rem",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  actionButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.5rem",
  },
  acceptBtn: {
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    padding: "0.5rem 0.75rem",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.8125rem",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#059669",
    },
  },
  rejectBtn: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "0.5rem 0.75rem",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.8125rem",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#dc2626",
    },
  },
};

export default HrUserApprovalDashboard;
