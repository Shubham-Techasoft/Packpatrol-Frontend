Here’s an upgraded, **visually engaging and skimmable version** of your Markdown documentation.
I’ve added icons, callouts, emojis, typography hierarchy, and a more modern layout style — while keeping it fully Markdown-compliant.

---

# ⚙️ PackPatrol Frontend

Welcome to the **PackPatrol Frontend** — your interface for managing and monitoring **AI-powered industrial inspection machines**.  
This guide will help you set up, understand key concepts, and navigate user roles and workflows efficiently.

---

## 🧭 Table of Contents
1. [🚀 Getting Started](#getting-started)
   - [📋 Prerequisites](#prerequisites)
   - [💻 Installation](#installation)
2. [🧩 Core Concepts & Relationships](#core-concepts--relationships)
   - [🖥️ Machine](#machine)
   - [🍪 Variant (Product Type)](#variant-product-type)
   - [🧠 ML Model](#ml-model)
   - [🔗 Data Relationships](#data-relationships)
3. [🌍 Understanding How Changes Work](#understanding-how-changes-work)
4. [👥 User Roles & Access Control](#user-roles--access-control)
5. [📱 Application Pages Overview](#application-pages-overview)
6. [⚡ Key Workflows](#key-workflows)

---

## <a id="getting-started"></a>🚀 Getting Started

### 📋 Prerequisites
Make sure you have the following:
- 🟢 **Node.js** v18 or later → [Download](https://nodejs.org/)
- 🟣 **npm** (comes with Node.js)
- 🖧 A running instance of the **PackPatrol Backend** service.

### 💻 Installation

1. **Clone the Repository**
   ```bash
   git clone <your-repository-url>
   cd packpatrol-frontend

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure the Backend API**
   Edit `src/utils/api.js` and set your backend URL:

   ```js
   export const base_URL = "http://127.0.0.1:8000";
   ```

4. **Run the Development Server**

   ```bash
   npm run dev
   ```

   🌐 App runs on **[http://localhost:5173](http://localhost:5173)**

---

## <a id="core-concepts--relationships"></a>🧩 Core Concepts & Relationships

PackPatrol revolves around three entities: **Machines**, **Variants**, and **ML Models**.

### 🖥️ Machine

Represents the **hardware** performing visual inspections — equipped with a camera and AI-driven software.
Each machine has:

* A **unique name**
* A **camera configuration**
* Links to one or more **Variants**

### 🍪 Variant (Product Type)

Defines a **product type** to inspect (e.g., *Chocolate Chip Cookie*).
Each variant has:

* Unique **attributes**
* One or more **ML Models** to analyze it

### 🧠 ML Model

The **AI “brain”** that identifies product defects.
Each model has:

* Name, Version, and Threshold
* A trained model file (`.pt`, `.onnx`, etc.)

### 🔗 Data Relationships

```
┌──────────┐       ┌─────────┐       ┌──────────┐
| Machine  | M   M | Variant | 1   M | ML Model |
|----------|-------|---------|-------|----------|
| - name   |       | - name  |       | - name   |
| - camera |       | - type  |       | - version|
└──────────┘       └─────────┘       └──────────┘
```

#### 🔸 Machine ↔ Variant (Many-to-Many)

* One Machine can run multiple Variants
* One Variant can be inspected by multiple Machines

#### 🔸 Variant ↔ ML Model (One-to-Many)

* Each Variant can have multiple ML Models (versions)
* Only **one active model** at a time per variant

---

## <a id="understanding-how-changes-work"></a>🌍 Understanding How Changes Work

It's important to know which changes are **global** (affecting all machines) and which are **machine-specific**.

### 🍪 Variant (Product Type)
> **Scope: 🌍 GLOBAL**

If you edit a Variant's name or description (e.g., renaming "Chocolate Chip Cookie" to "Choco-Chip Delight"), it changes **everywhere** for all machines using that variant.

### ⚙️ Settings (e.g., Detection Threshold)
> **Scope: 🖥️ MACHINE-SPECIFIC**

Settings like detection sensitivity can be **different for each machine**, even if they are inspecting the same product.
*   Machine A can have a threshold of `0.8`.
*   Machine B can use `0.9` for the same product.

### 🧠 ML Model (AI Brain)
> **Scope: 🌍 GLOBAL File, 🖥️ SPECIFIC Assignment**

*   **Model File:** If you update a model file (e.g., upload a new `v2.onnx`), the file itself is updated globally for any variant using that specific model version.
*   **Assignment:** However, different machines (or the same machine at different times) can use **different models** for the same product.
    *   Machine A can be assigned `Model-v1` for a product.
    *   Machine B can be assigned `Model-v2` for the same product.

---

## <a id="user-roles--access-control"></a>👥 User Roles & Access Control

PackPatrol uses a **tiered role system** to manage permissions.

| Role              | Access Level | Key Abilities                               | Restricted Areas    |
| ------------------| ------------ | ------------------------------------------- | ------------------- |
| 🏆 **SuperAdmin** | Full Access  | Manage everything (users, machines, models) | None                |
| 🛠️ **Admin**      | High         | Configure Machines, Variants, and Models    | User Management     |
| 📋 **Manager**    | Medium       | Adjust operational parameters               | Creation / Deletion |
| 👀 **User**       | Read-only    | View dashboards and machine status          | All edit actions    |

> 💡 **Tip:** You can verify your access level on your profile dropdown in the app.

---

## <a id="application-pages-overview"></a>📱 Application Pages Overview

### 🏠 Home Page

The **command center** for real-time monitoring.

* 🎥 **Live Feed:** Watch AI detection in action
* 📊 **Real-time Stats:** Stack count, rejected/passed items
* 🧩 **Control Panel:** Start/stop inspection, adjust parameters
* 🪵 **Log Feed:** Stream of system updates and alerts

---

### 📊 Dashboard Page

Focuses on **analytics and performance trends**:

* Production insights by machine or variant
* Defect trend visualization
* Flexible **date range filtering**

> 📈 Perfect for managers who want to spot trends over time.

---

### 🏗️ Machine Details & 🖼️ Variant Gallery

Drill down into machines and image-level inspection results.

#### Machine Details (`/machine/:id`)

* Header with Machine Status & Configuration
* List of Variants linked to the machine
* Quick summary stats per variant

#### Variant Gallery (`/machine/.../variant/...`)

* Paginated **image grid** with color-coded results
* 🟩 Accepted | 🟥 Rejected indicators
* Metadata: timestamp, stack count, etc.
* Full-screen **Image Viewer** with keyboard navigation

---

## <a id="key-workflows"></a>⚡ Key Workflows

> 🧑‍💼 All entity management happens under the **Developer Settings** page (`/dev-settings`).

---

### 🏗️ Creating a New Machine

1. Go to **Developer Settings → Add Machine**
2. Fill out:

   * Variant info
   * ML Model details
   * Machine & Camera setup
3. Submit — the system links all 4 entities automatically!

> ⚠️ **Naming Convention:** Avoid spaces or special characters. Use `-` or `_`.
> ✅ Example: `Chocolate-Chip-v1`

---

### 🍪 Creating a New Variant

1. Developer Settings → **Add Variant**
2. Provide:

   * Variant details
   * Initial ML Model + upload file
3. Submit → Variant appears in sidebar

---

### 🔁 Assign Existing Variant to Machine

1.  Go to **Developer Settings** → Select a Machine → **Edit**.
2.  Check the box for **“Add/Select Existing Variant”**.
3.  Select the desired variant from the dropdown menu.
4.  **Important:** You must also select which **ML Model** this machine will use for that variant.
5.  Confirm and save your changes.

> ✅ The machine can now process the new variant! This allows different machines to use different model versions (e.g., `v1` vs. `v2`) for the same product.

---

### 🗑️ Deleting Entities (Use Caution!)

| Entity          | Location                      | Effect                                          |
| --------------- | ----------------------------- | ----------------------------------------------- |
| 🖥️ **Machine** | Developer Settings → Machines | Removes machine + camera, keeps variants/models |
| 🍪 **Variant**  | Developer Settings → Variants | Deletes variant, keeps ML Models (orphaned)     |
| 🧠 **ML Model** | Developer Settings → Models   | Can’t delete if currently active                |

---

### ⚠️ Important Deletion Notes

#### 🧬 Orphaned ML Models

Models from deleted variants remain available to:

* 🔄 Reassign later
* 📚 Keep for record
* 🗑️ Delete manually if unneeded

#### 🛡️ Active Model Protection

Active models can’t be deleted until replaced:

1. Edit the variant → Assign another model
2. Save changes
3. Delete the inactive one safely

---

## 🧠 Quick Recap

| You Want To...             | Go To                 | Role Needed        |
| -------------------------- | --------------------- | ------------------ |
| Monitor machines           | 🏠 Home               | Any                |
| View performance           | 📊 Dashboard          | Any                |
| Add or edit configurations | ⚙️ Developer Settings | Admin / SuperAdmin |
| Assign variants or models  | ⚙️ Developer Settings | Admin / SuperAdmin |
| Delete entities            | ⚙️ Developer Settings | SuperAdmin         |

---

> 🧩 **PackPatrol Frontend** — where AI meets automation, and data meets insight.
> *Build smarter, inspect faster, and keep your production flawless.*
