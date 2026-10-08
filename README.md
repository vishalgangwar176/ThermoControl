<div align="center">
  
# 🌡️ Industrial Cyber-Physical System (ICPS)
### Industrial Temperature Monitoring & Automatic Cooling System

[![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.x-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Arduino](https://img.shields.io/badge/Arduino-ATmega328P-00979D?style=for-the-badge&logo=arduino)](https://www.arduino.cc/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

*A University Project connecting Computer Architecture & Parallel Processing (CAPP) concepts to a real-world Cyber-Physical IoT system.*

</div>

<br/>

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [System Architecture](#-system-architecture)
- [Features](#-features)
- [Hardware Setup](#-hardware-setup)
- [Software Installation](#-software-installation)
  - [1. Arduino Firmware](#1-arduino-firmware)
  - [2. Node.js Serial Bridge](#2-nodejs-serial-bridge)
  - [3. React Web Dashboard](#3-react-web-dashboard)
- [Usage Modes](#-usage-modes)
- [CAPP Concepts Demonstrated](#-capp-concepts-demonstrated)
- [Team Members](#-team-members)

---

## 🎯 About the Project

This project is a **Cyber-Physical System** that monitors ambient industrial temperature and controls a DC cooling fan using hysteresis logic. It was developed as a Project-Based Learning (PBL) assignment for the **Computer Architecture and Parallel Processing (CAPP)** course (CCSE0304). 

The goal is to demonstrate both physical hardware integration (MCU, Sensors, Actuators) and modern web-based monitoring, while explicitly mapping the physical implementation to low-level computer architecture concepts like ALU operations, RISC execution, integer logic, and restoring division.

## 🏗️ System Architecture

The project bridges the gap between raw hardware and high-level web dashboards using a three-tier architecture:

1. **Hardware Tier:** ATmega328P reads LM35 (analog), processes it via 10-bit ADC (4-sample averaging), makes a threshold decision, and drives a Relay/Fan.
2. **Bridge Tier:** A Node.js server reads the USB serial data (`115200` baud) from the MCU and broadcasts it to a local WebSocket.
3. **Application Tier:** A React/Vite dashboard provides a premium UI for real-time monitoring, data logging, and architectural visualization.

```text
LM35 Sensor ➡️ ATmega328P (ADC) ➡️ Relay Module ➡️ DC Fan (Cyber-Physical Loop)
                    ⬇️
                USB Serial
                    ⬇️
           Node.js Serial Bridge
                    ⬇️
         WebSockets (ws://localhost:8080)
                    ⬇️
           React Web Dashboard
```

## ✨ Features

- **Live Hardware Monitoring**: Connects to the physical ATmega328P and visualizes live temperature, ADC counts, and relay status.
- **Simulation Mode**: Generates realistic temperature curves and hysteresis logic internally when physical hardware isn't available.
- **5°C Hysteresis Control**: Prevents relay chattering by utilizing separate ON (`ADC ≥ 82`) and OFF (`ADC ≤ 71`) thresholds.
- **Data Logging & Export**: Logs historical temperature changes in a table format and exports directly to `.csv`.
- **Interactive Educational Demonstrations**: Contains step-by-step visualizations of ALU arithmetic, IEEE 754 floating-point conversion, and Restoring Division.

---

## 🔌 Hardware Setup

### Components Required
- **ATmega328P** (Arduino Uno or Nano)
- **LM35** Precision Temperature Sensor
- **5V Relay Module** (with built-in flyback diode and opto-isolator)
- **12V DC Fan** + **12V External Power Supply**
- Breadboard & Jumper wires

### Circuit Connections

| Component | Pin | Arduino Pin | External Power |
| :--- | :--- | :--- | :--- |
| **LM35** | VCC | 5V | - |
| | GND | GND | - |
| | OUT | A0 | - |
| **Relay** | VCC | 5V | - |
| | GND | GND | - |
| | IN | D7 | - |
| **DC Fan** | Positive (+) | - | 12V Supply (+) |
| | Negative (-) | - | Relay NO |
| **Relay Output**| COM | - | 12V Supply GND (-) |

> ⚠️ **SAFETY WARNING:** The microcontroller ONLY controls the low-power relay signal. The fan is powered through the separate 12V supply path. Do not attempt to power the 12V fan directly from the Arduino pins.

---

## 💻 Software Installation

### 1. Arduino Firmware
1. Open the `/firmware/temperature_controller.ino` file using the [Arduino IDE](https://www.arduino.cc/en/software).
2. Select your board (e.g., Arduino Uno) and the correct COM port.
3. Click **Upload**.

### 2. Node.js Serial Bridge
The bridge passes serial data from the Arduino to the browser.
```bash
# Navigate to the bridge directory
cd bridge

# Install dependencies
npm install

# Start the WebSocket server
npm start
```
*The bridge will start listening on `ws://localhost:8080`.*

### 3. React Web Dashboard
```bash
# Navigate to the root directory
cd cappp-project # or your repository root

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
*The dashboard will be available at `http://localhost:5173`.*

---

## 🎮 Usage Modes

### Real Hardware Mode
1. Ensure the Arduino is plugged into the PC via USB.
2. Run both the **Node Bridge** and the **React Dashboard**.
3. In the web dashboard, click **REAL HARDWARE MODE**.
4. Select the correct COM port from the dropdown and click **CONNECT**.

### Simulation Mode
1. Simply run the **React Dashboard** (no bridge or hardware required).
2. Click **SIMULATION MODE**.
3. Use the **Start Sim** button or the manual slider to test the hysteresis thresholds.

---

## 🧠 CAPP Concepts Demonstrated

This physical project directly maps to the following CAPP concepts (visualized in the dashboard):

- **SISD / RISC Architecture**: Demonstrating the 8-bit AVR RISC core's instruction cycle (Fetch → Decode → Execute).
- **ALU Optimization**: Implementing division by 256 using an 8-bit right shift (`>> 8`).
- **Software Arithmetic**: Handling 32-bit intermediate variables (`1023 * 125 = 127,875`) on an 8-bit ALU.
- **Restoring Division**: Interactive visualization of `35 ÷ 10` step-by-step.
- **IEEE 754**: Floating-point memory conversion examples.

---

## 👥 Team Contributions (Group 89)

- **Tanay Dubey** — *Threshold Logic, Test Plan & Data*
  - Responsible for threshold logic, fan ON/OFF control, hysteresis, testing strategy, and test data.
- **Urvashi Anand** — *Unit 2 Floating Point, IEEE 754 & References*
  - Responsible for floating-point concepts, IEEE 754 calculations, and technical references.
- **Vinayak Dev Tiwari** — *Unit 3 Mapping*
  - Responsible for mapping Unit 3 CAPP concepts including instruction types, instruction cycle, microoperations, program control, RISC/CISC, pipelining, and control concepts.
- **Vikas Pal** — *Hardware, Circuit, Relay/Fan Integration*
  - Responsible for hardware implementation, circuit integration, relay integration, and DC fan integration.
- **Vishal Gangwar** — *Documentation & System Design Update*
  - Responsible for project documentation and system design updates.

---
<div align="center">
<i>Sustainable Development Goal (SDG) 9 – Industry, Innovation and Infrastructure</i>
</div>
