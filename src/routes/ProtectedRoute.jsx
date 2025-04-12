import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { GET_USER_INFO } from "../auth/api";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/Slice/Userslice";
// import { useSnackbar } from 'notistack'; // For user feedback

const ProtectedRoute = ({ element }) => {
  const [userInfo, setUserInfo] = useState(undefined);
  const [loading, setLoading] = useState(true);
  // const { enqueueSnackbar } = useSnackbar(); // Snackbar for alerts
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const sessionId = sessionStorage.getItem("sessionId");

      if (!sessionId) {
        setUserInfo(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(GET_USER_INFO(sessionId));
        setUserInfo(response.data.data);
        dispatch(setUser(response.data.data));
      } catch (error) {
        if (error.response?.status === 403 || error.response?.status === 401) {
          // enqueueSnackbar("Session expired. Please log in again.", { variant: "error" });
          sessionStorage.removeItem("sessionId"); // Clear expired sessionId
        }
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (!userInfo) return <Navigate to="/login" replace />;
  
  return element;
};

export default ProtectedRoute;
