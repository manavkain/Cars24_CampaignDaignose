# Cars24 AI Growth Operator — User Manual

This document provides a detailed breakdown of every page, button, and function within the **Cars24 AI Growth Operator** application.

---

## 1. Global Navigation (Sidebar)
The Sidebar is the primary control center for navigating the application and managing global AI states.

*   **Brand Identity**: Displays the Cars24 Growth Operator logo.
*   **Collapse Toggle (`chevron_left/right`)**: Minimizes the sidebar to a compact icon-only view to maximize dashboard space.
*   **Run Diagnosis Button**: 
    *   **Function**: Triggers the `runDiagnosis` logic.
    *   **Behavior**: Sends current campaign metrics to the AI engine to detect anomalies and generate strategic fixes. Shows an "Hourglass" icon while processing.
*   **Live Mode Toggle**:
    *   **Live**: Enables continuous monitoring and automated rule execution.
    *   **Paused**: Stops automated tasks; requires manual intervention for all actions.
*   **Navigation Nodes**:
    *   **Detect**: Main real-time monitoring dashboard.
    *   **Diagnose**: Conversational AI interface for deep-dive analysis.
    *   **Act**: Custom logic and automation protocol builder.
    *   **Intel**: Competitor tracking and strategic intelligence.
    *   **Launch**: AI campaign architect and launchpad.
    *   **Log**: Comprehensive history of all system actions and improvements.
*   **Settings**: Technical configuration, API management, and thresholds.
*   **AI Status Indicator**: A pulsing dot at the bottom indicating if your AI Provider (Gemini/OpenAI) is active or in Demo Mode.

---

## 2. Top Bar & Workflow Tracker
The Top Bar provides contextual navigation for the active page and tracks the AI's current operational stage.

*   **Contextual Tabs**:
    *   **Overview**: The primary multi-panel dashboard.
    *   **Metrics**: High-level KPI grid with performance health badges.
    *   **Insights**: AI-generated executive summaries and market sentiment.
*   **Pipeline Steps**: A visual progress bar showing the AI's workflow:
    *   `Input` → `Diagnose` → `Fix` → `Deploy` → `Track`
*   **System Metadata**: Displays the current active campaign name (e.g., "Used Car Sales Q2") and the platform chip (e.g., "Meta Ads").
*   **Profile & Notifications**: Quick access to user alerts and profile settings.

---

## 3. Detect Dashboard (The Nerve Center)
The main dashboard uses a high-density layout to show the entire health of your marketing funnel.

### A. Campaign Pulse
*   **Google Sheets Input**: Allows linking an external data source via URL.
*   **Load Button**: Fetches and parses campaign data from the linked Sheet.
*   **Campaign Selector**: Dynamic chips to switch between multiple campaigns within the data source.
*   **Metric Cards**: Displays CTR, CPC, CPL, ROAS, Frequency, and Conversions.
    *   **Status Badges**: Green (Healthy), Amber (Watch), Red (Critical) based on your set thresholds.
*   **Manual/Run Buttons**: Allows for manual data override or immediate AI re-diagnosis.

### B. Diagnostic Stream
*   **Severity Counters**: Total count of Critical and Warning issues.
*   **AI Status**: Real-time feedback on what the AI is currently "thinking" or detecting.
*   **Issue Timeline**: Individual cards for every anomaly detected.
    *   **Confidence Score**: AI's certainty level regarding the diagnosis.
    *   **Apply Fix Button**: Links directly to the Fix Generator for that specific issue.

### C. Fix Generator
*   **Anomalies Sidebar**: A quick-switch list to browse all detected problems.
*   **Strategy Tabs**:
    *   **Creative**: AI-generated headlines and body copy for ad refreshes.
    *   **Audience**: Targeting adjustments (e.g., Lookalike shifts, Retargeting).
    *   **Bidding**: Changes to bid strategies (e.g., tCPA vs Max Conversions).
*   **Approval Workflow**:
    *   **Copy**: Saves recommendation text to clipboard.
    *   **Approve**: Formally accepts the fix, logging it to the history and triggering external webhooks (if configured).

---

## 4. Act (Logic Maker)
The "Automation Engine" where you define rules for the AI Operator to follow.

*   **Rule Creation**: Define `IF [Metric] [Operator] [Value] THEN [Action]`.
*   **Auto-Pause Flag**: Specifically marks a rule for immediate campaign pausing upon trigger.
*   **Test against Live**: Audits your current rules against the real-time dashboard data to see what *would* trigger right now.
*   **Deploy Rules**: Saves and activates the current logic set.

---

## 5. Intel (Competitor Tracker)
*   **Competitor Search**: Real-time search for any competitor's active ads.
*   **Ad Library Grid**: Visual display of active competitor creatives, headlines, and platforms.
*   **Analyze Strategy**: Uses Gemini to analyze the gathered ads and provide a "Strategic Recommendation" on how to out-market that specific competitor.

---

## 6. Launch (Campaign Architect)
*   **Brief Input**: A conversational area to describe your campaign goals.
*   **Generate Campaign**: Architect a full campaign structure, including audience segments, creative concepts, and budget allocations.
*   **Success Scorer**: An AI-driven "Predicted Success Score" (0-100) that evaluates the strategy's likelihood of hitting targets.

---

## 7. Settings (Configuration)
*   **API Intelligence**: Management of Gemini/OpenAI/Anthropic keys with an auto-detection "Test" button.
*   **Webhooks**: Destination URLs for exporting logs (Airtable) or sending alerts (Slack/Discord).
*   **Thresholds**: Fine-tune the "Green/Amber/Red" ranges for every KPI.
*   **Danger Zone**: Buttons to clear all logs or perform a full system reset.

---

> [!TIP]
> To get the most out of the operator, ensure your **Alert Thresholds** in Settings are accurately set to your business goals. This ensures the **Diagnostic Stream** only flags issues that truly matter to your bottom line.
