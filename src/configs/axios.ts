import axios from "axios";
const baseURL =
  "https://carrescuesystem-d0gbgkg5eef0g5dr.southeastasia-01.azurewebsites.net/api";
// const baseUrl = "http://137.184.153.35:8080";
const config = {
  baseURL,
  timeout: 3000000,
};
const api = axios.create(config);
api.defaults.baseURL = baseURL;
const handleBefore = (config: any) => {
  const token = localStorage.getItem("token")?.replaceAll('"', "");
  config.headers["Authorization"] = `Bearer ${token}`;
  // config.headers["Content-Type"] = "multipart/form-data";
  return config;
};
const handleError = (error) => {
  console.log(error);
  return;
};
api.interceptors.request.use(handleBefore, handleError);

export default api;
