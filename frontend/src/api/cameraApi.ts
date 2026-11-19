import API from "./client";
import { Camera } from "../types";

export const getCameras = () =>
  API.get<Camera[]>("/api/cameras/");

export const addCamera = (data: Partial<Camera>) =>
  API.post("/api/cameras/", data);

export const updateCamera = (id: number | string, data: Partial<Camera>) =>
  API.patch(`/api/cameras/${id}/`, data);

export const deleteCamera = (id: number | string) =>
  API.delete(`/api/cameras/${id}/`);
