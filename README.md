# Face Recognition Attendance System

A full-featured Face Recognition Attendance System built with React, Vite, Tailwind CSS, and Face-API.js.

## Features

- **User Registration**: Register new users by capturing their face and details.
- **Attendance Marking**: Real-time face recognition to mark attendance.
- **Dashboard**: View statistics on users and attendance.
- **SQL Data View**: Inspect the underlying data stored in the browser-based SQL database (Alasql).
- **Persistent Storage**: Data is saved in LocalStorage, so it persists across refreshes.

## Technologies Used

- **Frontend**: React (TypeScript), Vite, Tailwind CSS
- **Face Recognition**: face-api.js
- **Database**: Alasql (SQL in browser with LocalStorage persistence)
- **Icons**: Lucide React
- **Webcam**: react-webcam

## How to Run

1.  Clone the repository.
2.  Install dependencies: `npm install`.
3.  Start the development server: `npm run dev`.
4.  Open `http://localhost:5173` in your browser.

## Important Note

- This application requires access to your webcam.
- Face recognition models are loaded from an external CDN (`https://justadudewhohacks.github.io/face-api.js/models`). Ensure you have internet access.
- For best results, ensure good lighting when registering and marking attendance.

## Project Structure

- `src/components`: Reusable UI components (Navbar, WebcamCapture).
- `src/pages`: Main application pages (Home, Register, Attendance, SqlView).
- `src/services`: Business logic for Database and Face Recognition.
