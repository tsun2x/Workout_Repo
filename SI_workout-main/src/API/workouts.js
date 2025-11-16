import axios from 'axios';

const API_BASE = 'http://localhost/react-api/API/workouts.php';

export const fetchExercises = (params = {}) =>
  axios.get(API_BASE, { params: { action: 'list', offset: 0, limit: 10, ...params } }).then(r => r.data);

export const searchExercises = (q, params = {}) =>
  axios.get(API_BASE, { params: { action: 'search', q, offset: 0, limit: 10, ...params } }).then(r => r.data);

export const filterExercises = (params = {}) =>
  axios.get(API_BASE, { params: { action: 'filter', offset: 0, limit: 10, ...params } }).then(r => r.data);

export const getExerciseById = (id) =>
  axios.get(API_BASE, { params: { action: 'by_id', id } }).then(r => r.data);

export const getByMuscle = (muscle, params = {}) =>
  axios.get(API_BASE, { params: { action: 'by_muscle', muscle, offset: 0, limit: 10, ...params } }).then(r => r.data);

export const getByBodyPart = (bodyPart, params = {}) =>
  axios.get(API_BASE, { params: { action: 'by_bodypart', bodyPart, offset: 0, limit: 10, ...params } }).then(r => r.data);

export const getByEquipment = (equipment, params = {}) =>
  axios.get(API_BASE, { params: { action: 'by_equipment', equipment, offset: 0, limit: 10, ...params } }).then(r => r.data);
