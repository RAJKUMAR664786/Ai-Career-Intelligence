/**
 * Administrator Student Account Provisioning Utility
 * 
 * Usage:
 *   node --use-system-ca backend/scripts/provisionStudent.js <email> <password> "<fullName>" "<course>" "<institution>"
 * 
 * Example:
 *   node --use-system-ca backend/scripts/provisionStudent.js student1@college.edu TempPass123! "Aarav Patel" "B.Tech Computer Science" "State Institute"
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Firebase keys from frontend/.env
const envPath = path.resolve(__dirname, "../../frontend/.env");
let apiKey = process.env.VITE_FIREBASE_API_KEY;
let projectId = process.env.VITE_FIREBASE_PROJECT_ID;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("VITE_FIREBASE_API_KEY=")) {
      apiKey = trimmed.split("=")[1]?.replace(/^["']|["']$/g, "").trim();
    }
    if (trimmed.startsWith("VITE_FIREBASE_PROJECT_ID=")) {
      projectId = trimmed.split("=")[1]?.replace(/^["']|["']$/g, "").trim();
    }
  }
}

const args = process.argv.slice(2);
const email = args[0];
const password = args[1];
const fullName = args[2] || "Student";
const course = args[3] || "Computer Science";
const institution = args[4] || "Engineering Institution";

if (!email || !password) {
  console.log(`
===========================================================
  AI Career Intelligence - Student Account Provisioner
===========================================================
  Error: Missing required student credentials.

  Usage:
    node --use-system-ca backend/scripts/provisionStudent.js <email> <password> [fullName] [course] [institution]

  Example:
    node --use-system-ca backend/scripts/provisionStudent.js student1@college.edu TempPass123! "Aarav Patel" "B.Tech CS" "State College"
===========================================================
`);
  process.exit(1);
}

if (!apiKey || !projectId) {
  console.error("Error: Firebase API key or Project ID not found in frontend/.env");
  process.exit(1);
}

async function provisionStudent() {
  console.log("\n[1/3] Provisioning student account in Firebase Authentication...");
  console.log("      Email:      " + email);
  console.log("      Name:       " + fullName);
  console.log("      Project ID: " + projectId);

  // 1. Create account in Firebase Auth via Google Identity Toolkit API
  const authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + apiKey;
  const authRes = await fetch(authUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      displayName: fullName,
      returnSecureToken: true
    })
  });

  const authData = await authRes.json();
  if (authData.error) {
    if (authData.error.message === "EMAIL_EXISTS") {
      console.error("\n❌ Error: A student account with email '" + email + "' already exists.");
    } else {
      console.error("\n❌ Error provisioning account:", authData.error.message);
    }
    process.exit(1);
  }

  const uid = authData.localId;
  const idToken = authData.idToken;
  console.log("      ✔ Student Auth account created! (UID: " + uid + ")");

  // 2. Provision initial student profile in Firestore
  console.log("\n[2/3] Initializing student profile in Cloud Firestore (users/" + uid + ")...");
  const firestoreUrl = "https://firestore.googleapis.com/v1/projects/" + projectId + "/databases/(default)/documents/users/" + uid;
  
  const studentDocPayload = {
    fields: {
      uid: { stringValue: uid },
      fullName: { stringValue: fullName },
      email: { stringValue: email },
      course: { stringValue: course },
      institution: { stringValue: institution },
      phone: { stringValue: "" },
      createdAt: { stringValue: new Date().toISOString() },
      updatedAt: { stringValue: new Date().toISOString() },
      targetCareer: { stringValue: "Full Stack Developer" },
      profileCompletion: { integerValue: "75" }
    }
  };

  const dbRes = await fetch(firestoreUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + idToken
    },
    body: JSON.stringify(studentDocPayload)
  });

  const dbData = await dbRes.json();
  if (dbData.error) {
    console.warn("      ⚠ Warning setting Firestore document: " + dbData.error.message);
    console.warn("      (The student auth account exists, but the Firestore profile could not be written)");
  } else {
    console.log("      ✔ Student profile document created in Firestore successfully!");
  }

  console.log("\n[3/3] Account Provisioning Complete!");
  console.log("===========================================================");
  console.log("  Student can now sign in at the login page:");
  console.log("  - Login Email:    " + email);
  console.log("  - Initial Pass:   " + password);
  console.log("  - Student Name:   " + fullName);
  console.log("  - Degree/Course:  " + course);
  console.log("===========================================================\n");
}

provisionStudent().catch((err) => {
  console.error("Fatal provisioning error:", err);
  process.exit(1);
});
