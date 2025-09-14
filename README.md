# **Mini CRM**



1. #### **Local setup instructions**



A simple Customer Relationship Management (CRM) system built with Next.js, featuring campaign management, customer segmentation, and an AI-powered rule builder for creating targeted marketing campaigns.



\## Local Setup Instructions



1\. \*\*Prerequisites\*\*:

   - Node.js (v14 or later) and npm installed.

   - Git installed.



2\. \*\*Clone the Repository\*\*:

   ```bash

   git clone https://github.com/YOUR\_USERNAME/mini-crm.git

   cd mini-crm





#### **2. Architecture diagram**

**\[Client Browser]**

       **|**

**\[Next.js App] ---- \[Static Pages (e.g., /login, /campaigns)]**

       **|              |**

**\[API Routes]    \[Components (e.g., Layout, RuleBuilder)]**

       **|              |**

**\[LocalStorage]  \[AI Logic (lib/ai.js)]**

       **|              |**

**\[Mock Data]     \[Static Assets (public/)]**





#### **3. Summary of AI Tools and Other Tech Used**

**AI Tools:**



**Natural Language to Rule Conversion: Implemented with regex-based pattern matching in lib/ai.js to convert user inputs (e.g., "spent more than 1000") into segmentation rules. This simulates AI; a real implementation could use OpenAI/Gemini APIs.**





**Tech Stack:**



* **Framework: Next.js (React-based, with Pages Router).**



* **Styling: Tailwind CSS for responsive design.**



* **Icons: Lucide-react for UI icons.**



* **State Management: React Context API (AuthContext) for user authentication.**



* **Data Storage: LocalStorage for campaigns, logs, and mock data.**



#### **4. Known Limitations or Assumptions**



* **Data Storage: Uses localStorage for simplicity, not suitable for production (no persistence across devices or scaling).**



* **AI Limitation: The rule builder uses regex for AI simulation, not true machine learning. Complex sentences (e.g., "high spenders OR recent visitors") require multiple inputs.**

* **Authentication: Mock auth with no real backend validation; anyone can log in with any credentials after signup.**



* **Scalability: Mock customer data (5 entries) limits real-world use; no API integration for live data.**



* **Assumptions: Assumes a single-user environment; no multi-user support or conflict resolution.**



