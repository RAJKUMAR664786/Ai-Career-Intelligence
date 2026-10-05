# Administrator Guide: Student Account Provisioning & Login-Only Setup

This guide details how administrators manage, provision, and authorize student accounts in the **AI Career Intelligence** platform.

---

## 1. Login-Only Architecture Overview

To maintain academic data integrity and protect student analytics:
- **Public self-registration has been completely disabled.**
- **Only pre-authorized students** provisioned by an institution administrator can sign in.
- The platform automatically synchronizes the student's authenticated session with their Cloud Firestore profile (`users/{uid}`).
- If a student account exists in Authentication but its Firestore profile has not yet been seeded, the platform displays an alert instructing the student that their profile setup is pending administrator approval.

---

## 2. Method 1: Provisioning Students via Firebase Console (GUI)

Administrators can provision students directly through the Firebase Web Console:

### Step 1: Create Authentication Account
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select project **`ai-student-intelligence-ed261`**.
3. In the left navigation, navigate to **Build > Authentication**.
4. Confirm that **Email/Password** is enabled under **Sign-in method**.
5. Go to the **Users** tab and click **Add user**.
6. Enter the student's email (e.g., `student@college.edu`) and a temporary initial password.
7. Click **Add user**. Copy the generated **User UID** (e.g., `aBcDeFg12345...`).

### Step 2: Initialize Student Profile Document in Firestore
1. In the left navigation, go to **Build > Firestore Database**.
2. Under the **`users`** collection, click **Add document**.
3. **Important**: In the **Document ID** field, paste the student's **User UID** copied from Step 1.
4. Add the following fields:

| Field Name | Type | Value Example |
| :--- | :--- | :--- |
| `uid` | string | *(Student User UID)* |
| `fullName` | string | `Aarav Patel` |
| `email` | string | `student@college.edu` |
| `course` | string | `B.Tech Computer Science` |
| `institution` | string | `State Institute of Technology` |
| `targetCareer` | string | `Full Stack Developer` |
| `profileCompletion` | number | `75` |
| `createdAt` | string | *(Current ISO timestamp, e.g. 2026-10-04T12:00:00Z)* |

5. Click **Save**. The student can now sign in immediately.

---

## 3. Method 2: Provisioning Students via CLI Script (Automated)

An automated administrator utility is included in `backend/scripts/provisionStudent.js`. It automates creating both the Firebase Authentication record and the initial Cloud Firestore document in one step.

### Command Syntax:
```bash
node --use-system-ca backend/scripts/provisionStudent.js <email> <password> "<fullName>" "<course>" "<institution>"
```

### Example:
```bash
node --use-system-ca backend/scripts/provisionStudent.js priya.sharma@college.edu TempPass2026! "Priya Sharma" "B.Tech Information Technology" "Government College of Technology"
```

### What the Script Performs:
1. Validates the administrator's Firebase project configuration.
2. Calls Google Identity Toolkit API to register the student credentials in Firebase Auth.
3. Automatically writes the pre-seeded student profile document to `users/{uid}` in Cloud Firestore.
4. Outputs the student's credentials for secure delivery to the student.

---

## 4. Student Sign-In Workflow

1. The student navigates to `http://localhost:5173/login`.
2. Enters their authorized student email and initial password.
3. Upon clicking **Sign In**:
   - Firebase verifies credentials.
   - The platform retrieves `users/{uid}` from Cloud Firestore.
   - The student's real name and course are rendered in the sidebar.
   - All interview logs, mock scores, and career roadmaps are isolated to that student.
4. **Forgot Password**: If the student forgets their password, they can click "Forgot password?" on the login page to receive a recovery email directly from Firebase.

---

## 5. Security & Isolation Guarantees

- **No Client Secrets**: Client-side applications only hold the Firebase Web App API key, which acts as a public client identifier. All administrative operations are scoped through authenticated sessions.
- **Strict Firestore Rules**: As governed by `firestore.rules`, students can only read and modify their own records matching `request.auth.uid == userId`. They cannot access or overwrite other students' data.
