# AutoSafe AI

AutoSafe AI is an advanced Computer Vision application designed to analyze vehicle photographs and assess their road legality. By leveraging deep learning models, the system detects whether an image contains a vehicle and performs a structural analysis to determine if the car is "Road Legal" or has "Severe Damage".

## 🚀 Features

- **AI-Powered Analysis**: Utilizes a pre-trained **ResNet50** neural network (via PyTorch) for accurate vehicle detection.
- **Damage Assessment**: Simulates structural integrity checks (Mock logic for demo purposes) to classify vehicles as road-safe or crashed.
- **Premium User Interface**: Built with **React** and **Vite**, featuring a modern "Glassmorphism" design, dark mode, and smooth animations.
- **Real-time Processing**: Fast API response times using **FastAPI** as the backend server.
- **Drag & Drop Upload**: Intuitive image upload interface with instant preview.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Vanilla CSS (Custom Glassmorphism Design System)
- **Font**: Inter (Google Fonts)

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **AI/ML**: PyTorch, Torchvision, Pillow
- **Model**: ResNet50 (ImageNet Pre-trained)

## 📦 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Python](https://www.python.org/) (v3.9+)

### 1. Backend Setup
The backend handles the AI image processing.

```bash
# Navigate to the project root
cd ImageBasedevaluation

# Install Python dependencies
pip install -r backend/requirements.txt

# Start the API server
python backend/main.py
```
_The API will start at `http://localhost:8000`. The first run may take a moment to download the AI model._

### 2. Frontend Setup
The frontend provides the user interface.

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install JavaScript dependencies
npm install

# Start the development server
npm run dev
```
_The UI will be accessible at `http://localhost:5173`._

## 📖 Usage

1. Ensure both the **Backend** and **Frontend** servers are running.
2. Open the web interface (`http://localhost:5173`).
3. Drag and drop a car image into the upload zone or click to select a file.
4. Click **"Run Diagnostics"**.
5. View the analysis report, which includes:
    - **Verdict**: Road Legal / Severe Damage
    - **Confidence Score**: AI probability
    - **Details**: Detected features and specific checks (e.g., "Headlights functional", "Frame damage").

## 📂 Project Structure

```
ImageBasedevaluation/
├── backend/
│   ├── main.py            # FastAPI entry point
│   ├── model.py           # AI Model logic (ResNet50 wrapper)
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main UI Component
│   │   └── index.css      # Global Styles & Design System
│   ├── index.html         # Entry HTML
│   └── package.json       # JS dependencies
└── README.md              # Project Documentation
```

## ⚠️ Note on AI Model
This project uses a standard **ResNet50** trained on ImageNet for **Vehicle Detection**.
*Note: The specific "Crash/Damage Detection" logic is currently simulated for demonstration purposes, as reliable crash detection requires a specialized dataset (e.g., trained on car accident datasets).*
