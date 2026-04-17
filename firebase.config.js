// Firebase Realtime Database Configuration
// Endpoint: https://myapp-1a8b6-default-rtdb.firebaseio.com/

const FIREBASE_DB_URL = 'https://myapp-1a8b6-default-rtdb.firebaseio.com';

// ✅ Generic GET - fetch data from a path
export const firebaseGet = async (path) => {
  try {
    const response = await fetch(`${FIREBASE_DB_URL}/${path}.json`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Firebase GET error at ${path}:`, error);
    return null;
  }
};

// ✅ Generic SET - set data at a path (overwrites)
export const firebaseSet = async (path, data) => {
  try {
    const response = await fetch(`${FIREBASE_DB_URL}/${path}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error(`Firebase SET error at ${path}:`, error);
    return null;
  }
};

// ✅ Generic PUSH - push new record (auto-generates key)
export const firebasePush = async (path, data) => {
  try {
    const response = await fetch(`${FIREBASE_DB_URL}/${path}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result; // returns { name: "-NxxAutoKey" }
  } catch (error) {
    console.error(`Firebase PUSH error at ${path}:`, error);
    return null;
  }
};

// ✅ Generic UPDATE - partial update at a path
export const firebaseUpdate = async (path, data) => {
  try {
    const response = await fetch(`${FIREBASE_DB_URL}/${path}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error(`Firebase UPDATE error at ${path}:`, error);
    return null;
  }
};

// ✅ Generic DELETE - delete data at a path
export const firebaseDelete = async (path) => {
  try {
    const response = await fetch(`${FIREBASE_DB_URL}/${path}.json`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error(`Firebase DELETE error at ${path}:`, error);
    return null;
  }
};

// ✅ Convert Firebase object (with keys) to array
export const objectToArray = (obj) => {
  if (!obj) return [];
  return Object.keys(obj).map(key => ({ id: key, ...obj[key] }));
};

export default FIREBASE_DB_URL;
