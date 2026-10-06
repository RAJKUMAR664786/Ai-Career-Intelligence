import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyCMOSmXahWK9b8gn5nYcPPw4ZSErnegIZM",
  authDomain: "ai-student-intelligence-ed261.firebaseapp.com",
  projectId: "ai-student-intelligence-ed261",
  storageBucket: "ai-student-intelligence-ed261.firebasestorage.app",
  messagingSenderId: "152802312703",
  appId: "1:152802312703:web:913361dea511200379a7ca"

};

console.log("Testing Firestore with Project ID:", config.projectId);
const app = initializeApp(config);
const db = getFirestore(app);

try {
  const testRef = doc(db, "_system_health", "ping");
  console.log("Attempting Firestore getDoc...");
  const snap = await getDoc(testRef);
  console.log("getDoc succeeded, exists:", snap.exists());
} catch (err) {
  console.error("Firestore test error code:", err.code);
  console.error("Firestore test error message:", err.message);
}
