# LUNAR SENTRY AI - Lunar Terrain Safety & Navigation System (Frontend)

## Setup (VS Code)
1. Extract the ZIP.
2. In VS Code, choose File > Open Folder and select the `lunar-sentry-ai` folder (the one that contains package.json).
3. Open a terminal and run:
       npm install
       npm run dev
4. Open the address shown in the terminal, usually http://localhost:5173.

## Pages and routes
- Mission Overview (/)
- Image Analysis (/image-analysis)
- Boulder Detection (/boulder-detection)
- Lander Risk (/lander-risk)
- Rover Navigation (/rover-navigation)
- Mission Analytics (/mission-analytics)

## Images
Images in src/assets/images/ were cut from the Figma screenshots supplied for this project:
- hero-terrain.png, analysis-main.png, boulder-frame.png, lander-map.png, rover-map.png, hazcam.png, ai-terrain-thumb.png, thumb-*.png, logo.png, avatar.png.
Some of these crops include baked-in overlay graphics from the screenshot (for example boulder labels, lander zone labels, and route lines). The interactive elements in the app are positioned to match them.
The screenshots are low resolution, so these images will look soft when enlarged. For sharper images, export the layers from Figma at 2x and replace the files with the same names.

## Known limitations
- Icons are not included. The sidebar, header and card icons from Figma were not provided as image files.
- Bounding-box positions on the Boulder Detection image were estimated from the screenshot.
- The Mission Analytics timeline chart data is not included.
- Simulated-demo panels from the Figma prototype are not included.

## Demo behavior
- Values come from src/data/demoData.js. They are static Figma values, not live mission data.
- "Analyze Image" runs a simulated progress bar. No AI model runs in this frontend.
- "Export Report" downloads demo values as JSON.
- Scores, charts and recommendations are illustrative, not flight clearance.

## Dashboard file map
Each dashboard is one page file in src/pages/. Shared parts are in src/components/, src/styles/ and src/data/.
- Mission Overview (Figma: Mission Control Overview) -> src/pages/MachineOverview.jsx
- Image Analysis (Figma: Lunar Image Analysis) -> src/pages/ImageAnalysis.jsx
- Boulder Detection (Figma: Boulder Detection Intelligence) -> src/pages/BoulderDetection.jsx
- Lander Risk (Figma: Lander Risk Analysis) -> src/pages/LanderRisk.jsx
- Rover Navigation (Figma: Rover Navigation Intelligence) -> src/pages/RoverNavigation.jsx
- Mission Analytics (Figma: Mission Analytics & Insights) -> src/pages/MissionAnalytics.jsx
- App routing -> src/App.jsx
- Sidebar and header -> src/components/Sidebar.jsx and src/components/Header.jsx
