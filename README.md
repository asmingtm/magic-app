# MagicTrack Bharatpur (स्मार्ट म्याजिक ट्र्याकर - चितवन)

> **Hack-Days Theme:** *"Everyday problems, smart solutions"*  
> **Project Repository:** `https://github.com/asmingtm/hackdays.git`  
> **Location:** Bharatpur & Narayangarh, Chitwan Metropolitan City, Nepal  

---

## 🌟 The Everyday Problem

In Bharatpur and Narayangarh (Chitwan, Nepal), the primary mode of public transportation is the **"MAGIC"** — 8-to-10 seater Tata Magic microvans.
- Commuters, university students (Agriculture & Forestry University Rampur, Birendra Multiple Campus, Chitwan Medical College), patients visiting Bharatpur Government Hospital, and workers rely on these microvans daily.
- All Magics have route numbers, with **Route 1 being the iconic "Ring Road" (चक्रिय मार्ग)**, connecting Narayangarh Pulchowk, Lions Chowk, Chaubiskothi, Hakim Chowk, Central Buspark (Paras Buspark), Bypass, and Aptari.
- **The Core Issue:** Passengers stand for 20 to 40 minutes at dusty chowks wondering:
  - *Is a Route 1 Magic coming anytime soon?*
  - *Will it have empty seats or be completely full (प्याक)?*
  - *What is the official regulated fare so I don't get overcharged?*
  - *Which Magic route goes to Rampur AFU or Geetanagar?*

---

## 💡 The Smart Solution: MagicTrack

**MagicTrack Bharatpur** is a lightweight, zero-hardware-barrier web application and proof-of-concept that turns everyday smart devices into a live transit network:

1. **Interactive Real-Time Map (OpenStreetMap & Leaflet):**
   - High-fidelity map centered on **Bharatpur & Narayangarh** (`27.6820° N, 84.4310° E`).
   - Distinct color-coded transit corridors:
     - **Route 1:** Ring Road (चक्रिय मार्ग) — Pulchowk, Lions Chowk, Chaubiskothi, Hakim Chowk, Paras Buspark, Bypass, Aptari.
     - **Route 2:** Narayangarh - Bharatpur Hospital - CMC - Geetanagar.
     - **Route 3:** Narayangarh - Mangalpur - Rampur (AFU Agriculture Campus).
     - **Route 4:** Narayangarh - Gondrang - Tandi (Ratnanagar / Sauraha Chowk).
     - **Route 5:** Narayangarh - Patihani - Jagatpur (Kasara CNP Gate).
   - Pre-loaded dummy Magic vans actively driving along roads with Nepali license plates (`ना १ ज २४५८`, `बा १ ज ९०११`, etc.), heading indicators, live speed, and GPS pulse rings.
   - **"➕ Add Dummy Van"** quick-spawner: Lets judges/evaluators instantly add any number of dummy vans to any route and watch them animate live!
   - **"🎯 Center Map"** camera reset tool.

2. **Occupancy & Crowd Telemetry:**
   - Real-time indicator for each van: **Seats Available (खाली)**, **Few Seats (केही सिट)**, or **Full (भरिभराउ / प्याक)**.
   - Prevents passengers from waiting in vain for packed vans.

3. **Journey Planner ("यात्रा योजना"):**
   - Select Origin and Destination chowks (or tap "My Location" to auto-detect nearest stop via device GPS).
   - Instantly calculates recommended Magic route, travel duration, road distance, and exact fare.
   - Detects the nearest incoming Magic van with real-time ETA countdown!

4. **Official Fare Matrix & Concession Calculator:**
   - Regulated Bharatpur Metropolitan transit fares in Nepali Rupees (NPR).
   - One-tap 45% discount calculation for students (विद्यार्थी परिचय पत्र) and senior citizens.

5. **Driver Broadcast Mode (Zero Cost Hardware):**
   - A driver portal where any Magic driver with a basic smartphone can tap "Start Live GPS Broadcast".
   - Lets drivers adjust available seat count in real time with single taps (+ / -).

6. **Bilingual Localization:**
   - Full Nepali (`नेपाली`) and English (`ENG`) support with authentic local stop names (चौबिसकोठी, नारायणगढ पुलचोक, हाकिम चोक, पारस बसपार्क, आँपटारी).

---

## 🚀 Quick Setup & Installation Guide

To run this project locally on your computer:

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `yarn` / `pnpm`

### Step 1: Clone the Repository
```bash
git clone https://github.com/asmingtm/hackdays.git
cd hackdays
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` (or `http://localhost:5173`).

### Step 4: Build for Production
```bash
npm run build
```

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS
- **Mapping Engine:** Leaflet + OpenStreetMap (no credit card or paid API keys required!)
- **Icons:** Lucide React
- **Geospatial Math:** Haversine formula, circular route interpolation, Web Geolocation API

---

## 📊 Real-World Deployment Roadmap for Bharatpur Municipality

1. **Phase 1: Driver PWA / Smartphone Pilot**
   - Onboard 20 Magic drivers on Route 1 (Ring Road) using their existing Android phones.
   - Minimal mobile web interface with high contrast buttons for drivers.
2. **Phase 2: QR Code Stops**
   - Post weatherproof QR code placards at Chaubiskothi, Pulchowk, Lions Chowk, and Paras Buspark.
   - Commuters scan with their camera to immediately see vans within 2 km.
3. **Phase 3: Ultra-Low-Cost Hardware Trackers**
   - Inexpensive $12-$15 OBD-II GPS plug or ESP32 + SIM800L module plugged into the van's 12V cigarette lighter port for automated telemetry without requiring driver phones.

---

## 🏆 Presentation Talking Points for Hack-Days Judges

- **Hyper-Local Context:** Addresses an everyday reality that every resident, student, and visitor in Chitwan experiences.
- **Feasible & Scalable:** Requires zero expensive road sensors or high-end servers; works directly on web browsers.
- **Social Impact:** Protects students and vulnerable travelers from price exploitation and long waits in harsh weather.
- **Women & Elderly Safety:** Transparent live tracking allows families to monitor arrival times.
