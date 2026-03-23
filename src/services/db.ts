import alasql from 'alasql';

export const initDB = () => {
  alasql('CREATE localStorage DATABASE IF NOT EXISTS face_db');
  alasql('ATTACH localStorage DATABASE face_db');
  alasql('USE face_db');

  alasql(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name STRING,
      role STRING,
      descriptors JSON,
      createdAt DATE
    )
  `);

  alasql(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      userName STRING,
      timestamp DATETIME,
      status STRING
    )
  `);
  
  console.log("Database initialized and connected to LocalStorage");
};

export const addUser = (name: string, role: string, descriptors: any) => {
  const createdAt = new Date();
  try {
    // Alasql works best with simple objects. We might need to serialize descriptors if they are complex typed arrays.
    // For face-api.js, descriptors are Float32Array. We convert to array for storage.
    const descriptorsJson = JSON.stringify(Array.from(descriptors));
    alasql('INSERT INTO users (name, role, descriptors, createdAt) VALUES (?, ?, ?, ?)', [name, role, descriptorsJson, createdAt]);
    return { success: true };
  } catch (error) {
    console.error("Add User Error", error);
    return { success: false, error };
  }
};

export const getUsers = () => {
  return alasql('SELECT * FROM users');
};

export const markAttendance = (userId: number, userName: string) => {
  const now = new Date();
  // Check if already marked today
  const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Alasql doesn't have robust date functions in standard SQL mode easily, doing filter in JS is safer for this demo
  const records = alasql('SELECT * FROM attendance WHERE userId = ?', [userId]) as any[];
  const alreadyMarked = records.some((r: any) => new Date(r.timestamp).toISOString().split('T')[0] === today);

  if (alreadyMarked) {
    return { success: false, message: "Already marked for today" };
  }

  alasql('INSERT INTO attendance (userId, userName, timestamp, status) VALUES (?, ?, ?, ?)', [userId, userName, now, 'Present']);
  return { success: true, message: "Attendance marked successfully" };
};

export const getAttendance = () => {
  return alasql('SELECT * FROM attendance ORDER BY timestamp DESC');
};

export const getAllData = () => {
  return {
    users: alasql('SELECT * FROM users'),
    attendance: alasql('SELECT * FROM attendance')
  };
};
