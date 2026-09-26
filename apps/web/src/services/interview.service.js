import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/interview`,
  withCredentials: true,
});

const interviewService = {
  generateReport: async (formData) => (await api.post("/", formData, { headers: { "Content-Type": "multipart/form-data" } })).data,
  getAllReports: async () => (await api.get("/")).data,
  getReportById: async (id) => (await api.get(`/report/${id}`)).data,
  downloadResume: async (id) => (await api.post(`/resume/pdf/${id}`, {}, { responseType: "blob" })).data,
};

export default interviewService;
