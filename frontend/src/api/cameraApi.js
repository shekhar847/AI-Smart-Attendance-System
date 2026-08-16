import API from "./client";

export const getCameras = () =>
  API.get("/api/cameras/");

export const addCamera = (data) =>
  API.post("/api/cameras/", data);

export const updateCamera = (id, data) =>
  API.patch(`/api/cameras/${id}/`, data);

export const deleteCamera = (id) =>
  API.delete(`/api/cameras/${id}/`);