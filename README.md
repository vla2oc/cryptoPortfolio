# 📈 Intelligent Crypto Portfolio Tracker with AI Sentiment Analysis

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)

## 📖 About The Project

This project is a microservices-based web application designed to solve the problem of information overload in the cryptocurrency market. It combines real-time asset tracking with **Automated Sentiment Analysis** driven by Natural Language Processing (NLP).

### The Problem
Investors face a fragmented landscape: portfolio data sits in one place, while market news is scattered across thousands of sources. Manually analyzing the sentiment of hundreds of news headlines to gauge market mood is time-consuming and prone to emotional bias.

### The Solution
A unified dashboard that not only tracks portfolio value but also employs an **AI Agent** to read, process, and score market news in real-time, providing an objective "Fear & Greed" metric based on actual data.

---

## 🏗 System Architecture

The application is built as a set of containerized microservices orchestrated by Docker Compose:

1.  **Frontend (Client):** React + Vite. Provides a responsive UI/UX for portfolio management and data visualization.
2.  **Backend (API Gateway):** Node.js (Express). Handles business logic, portfolio CRUD operations, and bridges communication between the Client and the AI Service.
3.  **AI Service (Inference Engine):** Python (FastAPI). A dedicated microservice hosting the FinBERT model. It exposes endpoints for NLP tasks, isolating heavy computational loads from the main application logic.

---

## 🧠 Hybrid AI Architecture (FinBERT + Gemini)

The system employs a novel **two-stage inference pipeline** to ensure both high accuracy and human-readable insights. We do not rely solely on Generative AI, which can be prone to hallucinations regarding financial sentiment.

### Stage 1: Quantitative Analysis (FinBERT)
* **Role:** The "Analyst".
* **Model:** `ProsusAI/finbert` running locally via PyTorch.
* **Function:** Processes raw text and outputs a strict probability distribution (e.g., `Positive: 0.92`, `Negative: 0.08`). This acts as the **Ground Truth** for the system.

### Stage 2: Qualitative Synthesis (Google Gemini)
* **Role:** The "Reporter".
* **Model:** Gemini Pro via API.
* **Function:** Takes the news headlines AND the mathematical scores provided by FinBERT to generate a contextual summary.
* **Why this approach?** Gemini is forced to generate an explanation based on FinBERT's scores, preventing "sentiment hallucination" and ensuring the narrative matches the data.

> **Architecture Flow:**
> `Raw News` -> `FinBERT (Local Docker)` -> `Sentiment Score` -> `Gemini (Cloud)` -> `Final Strategic Report`

---

## 🛠 Tech Stack

### Infrastructure
* **Docker & Docker Compose:** Full containerization of all services. Ensures environment consistency across macOS (Silicon), Linux, and Windows.
* **Networking:** Internal Docker network for secure communication between Node.js and Python services.

### Backend & AI
* **Node.js:** RESTful API orchestration.
* **Python (FastAPI):** High-performance asynchronous API for ML inference.
* **Transformers (Hugging Face):** Library for loading and running the NLP model.
* **PyTorch:** Deep learning framework backend.

### Frontend
* **React (Vite):** High-performance SPA.
* **TailwindCSS:** Utility-first styling for a modern, dark-mode interface.

---

## 🚀 Getting Started

### Prerequisites
* Docker and Docker Compose installed.

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/crypto-portfolio-ai.git](https://github.com/your-username/crypto-portfolio-ai.git)
    cd crypto-portfolio-ai
    ```

2.  **Build and Run (with Auto-Model Download)**
    ```bash
    docker-compose up --build
    ```
    *Note: The first launch may take a few minutes as the AI Service downloads the FinBERT model weights.*

3.  **Access the Application**
    * Frontend: `http://localhost:5173`
    * Backend API: `http://localhost:3000`
    * AI Service Docs: `http://localhost:8000/docs`

---

## 🔮 Roadmap

* [ ] **Web3 Integration (wagmi):** Auto-sync assets via MetaMask connection.
* [ ] **Database Persistence:** Migration from in-memory storage to PostgreSQL.
* [ ] **Advanced Fine-Tuning:** Retraining the model on a specialized crypto-slang dataset.

---

## 📄 License

Distributed under the MIT License.
