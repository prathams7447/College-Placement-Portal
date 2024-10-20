import axios from "axios";
import { mainstore } from "./BaseModal";

const accessToken = localStorage.getItem("accessToken");

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await api.post("token/refresh/", {
        refresh: refreshToken,
      });
      if (response.status === 200) {
        const { access } = response.data;
        localStorage.setItem("accessToken", access);
        api.defaults.headers["Authorization"] = `Bearer ${access}`;
        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  try {
    console.log("username and password ######## ", username, password);
    const response = await axios.post("http://localhost:8000/api/login/", {
      username,
      password,
    });
    if (response && response.data) {
      const { access, refresh } = response.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem(
        "userinfo",
        JSON.stringify({
          email: response.data.user.email,
          username: response.data.user.username,
          first_name: response.data.user.first_name,
          is_student: response.data.user.is_student,
          is_admin: response.data.user.is_admin,
        })
      );
      mainstore.is_loggedin = true;
      mainstore.userInfo = response.data.user; // assuming your API returns this
      return response;
    }
  } catch (error) {
    console.error("Login error:", error);
    return "Error while logging in. Please try again.";
  }
};

export const addStudent = async (studentData) => {
  try {
    const response = await api.post("add-student/", studentData);

    if (response && response.data) {
      return "Students details added successfully!!"; // Return success message
    } else {
      return "Error while adding students details. Please try again.";
    }
  } catch (error) {
    return "Error while adding students details. Please try again."; // Return error message
  }
};

export const addInterview = async (addInterview) => {
  try {
    const response = await api.post("add-interview/", addInterview);
    if (response && response.data) {
      return "Interview details added successfully!!"; // Return success message
    } else {
      return "Error while adding interview details. Please try again.";
    }
  } catch (error) {
    return "Error while adding interview details. Please try again."; // Return error message
  }
};

export const getStudent = async () => {
  try {
    const response = await api.get("get-students/");
    if (response && response.data) {
      return response.data; // Return success message
    } else {
      return "Error while fetching students details. Please try again.";
    }
  } catch (error) {
    return "Error while fetching students details. Please try again."; // Return error message
  }
};

export const getCompany = async () => {
  try {
    const response = await api.get("get-companies/");
    if (response && response.data) {
      return response.data; // Return success message
    } else {
      return "Error while fetching interview details. Please try again.";
    }
  } catch (error) {
    return "Error while fetching interview details. Please try again."; // Return error message
  }
};

export const updateInterviewStatus = async (updatedInterviewStatus) => {
  try {
    const response = await api.post(
      "update-companies/",
      updatedInterviewStatus
    );
    if (response && response.data) {
      return "Interview status updated successfully"; // Return success message
    } else {
      return "Error while updating interview status. Please try again.";
    }
  } catch (error) {
    return "Error while updating interview status. Please try again."; // Return error message
  }
};

export const getStudentBy_applied_companyid = async (companyId) => {
  try {
    const response = await api.post(
      "get_student_by_applied_companyid/",
      companyId
    );
    if (response && response.data) {
      return response.data; // Return success message
    } else {
      return "Error while updating interview status. Please try again.";
    }
  } catch (error) {
    console.error("Fetch user data error:", error);
    return "Error while updating interview status. Please try again."; // Return error message
  }
};

export const updateStudentStatus = async (requestbody) => {
  try {
    const response = await api.post("update-students-status/", requestbody);
    if (response && response.data) {
      return "Students status updated successfully:"; // Return success message
    } else {
      return "Error while updating student status. Please try again.";
    }
  } catch (error) {
    return "Error while updating student status. Please try again."; // Return error message
  }
};

export const getStudentByRegID = async () => {
  try {
    const response = await api.post(
      "get-student-by-reg-id/",
      mainstore.userInfo.username
    );
    if (response && response.data) {
      return response.data; // Return success message
    } else {
      return "Error while updating student status. Please try again.";
    }
  } catch (error) {
    return "Error while updating student status. Please try again."; // Return error message
  }
};

export const getAppliedCompanyForGivenStudent = async () => {
  try {
    const response = await api.post(
      "get-applied-comp-student-by-reg-id/",
      mainstore.userInfo.username
    );
    if (response && response.data) {
      return response.data; // Return success message
    } else {
      return "Error while receiving applied comapany data. Please try again.";
    }
  } catch (error) {
    return "Error while receiving applied comapany data. Please try again."; // Return error message
  }
};

export const getPlacedCompanyForGivenStudent = async () => {
  try {
    const response = await api.post(
      "get-placed-comp-student-by-reg-id/",
      mainstore.userInfo.username
    );
    if (response && response.data) {
      return response.data; // Return success message
    } else {
      return "Error while receiving Placed comapany data. Please try again.";
    }
  } catch (error) {
    return "Error while receiving Placed comapany data. Please try again."; // Return error message
  }
};

export const applyForInterview = async (requestbody) => {
  try {
    const response = await api.post(
      "apply-interview-by-student-reg/",
      requestbody
    );
    if (response && response.data) {
      return "Applied to company successfully:"; // Return success message
    } else {
      return "Error while applying to comapany. Please try again.";
    }
  } catch (error) {
    return "Error while applying to comapany. Please try again."; // Return error message
  }
};

export const forgotPassword = async (username, password) => {
  try {
    const response = await api.post("reset-password/", { username, password });
    if (response && response.data) {
      return "Applied to company successfully:"; // Return success message
    } else {
      return "Error while applying to comapany. Please try again.";
    }
  } catch (error) {
    return "Error while applying to comapany. Please try again."; // Return error message
  }
};
