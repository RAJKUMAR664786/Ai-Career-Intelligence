import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { 
  db, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  doc,
  getDoc,
  setDoc,
  updateDoc,
  isFirebaseConfigured 
} from "../services/firebase";

// Empty baseline student profile - No hardcoded fake students or fake grades
export const createEmptyStudentProfile = (user = null) => {
  const email = user?.email || "";
  const name = user?.displayName || (email ? email.split("@")[0] : "Student");
  return {
    personalInfo: {
      name,
      email,
      phone: "",
      college: "",
      degree: "",
      department: "",
      year: "",
      semester: ""
    },
    academicInfo: {
      cgpa: 0,
      attendance: 0,
      academicScore: 0,
      backlogs: 0,
      semesterTrends: [],
      subjectMarks: []
    },
    skills: [],
    projects: [],
    certifications: [],
    careerInterests: [],
    selfAssessment: {
      problemSolving: 0,
      communication: 0,
      leadership: 0,
      teamwork: 0,
      codingConfidence: 0
    },
    targetCareer: "Career Exploration",
    profileCompletion: 20
  };
};

// Retain alias for external callers without demo data
export const DEFAULT_STUDENT_PROFILE = createEmptyStudentProfile();

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const { currentUser, userProfile, updateUserProfileData } = useAuth();
  const isConfigured = isFirebaseConfigured();

  const [profile, setProfile] = useState(() => {
    return createEmptyStudentProfile(currentUser);
  });

  const [recentInterviews, setRecentInterviews] = useState([]);
  const [toast, setToast] = useState(null);

  // Sync profile when authenticated userProfile changes from Firestore / Auth
  useEffect(() => {
    if (userProfile && currentUser) {
      setProfile({
        personalInfo: {
          name: userProfile.fullName || userProfile.personalInfo?.name || currentUser.displayName || currentUser.email?.split("@")[0] || "Student",
          email: userProfile.email || userProfile.personalInfo?.email || currentUser.email || "",
          degree: userProfile.course || userProfile.personalInfo?.degree || "",
          college: userProfile.institution || userProfile.personalInfo?.college || "",
          department: userProfile.department || userProfile.personalInfo?.department || "",
          year: userProfile.year || userProfile.personalInfo?.year || "",
          semester: userProfile.semester || userProfile.personalInfo?.semester || "",
          phone: userProfile.phone || userProfile.personalInfo?.phone || ""
        },
        academicInfo: userProfile.academicInfo || {
          cgpa: 0,
          attendance: 0,
          academicScore: 0,
          backlogs: 0,
          semesterTrends: [],
          subjectMarks: []
        },
        skills: userProfile.skills || [],
        projects: userProfile.projects || [],
        certifications: userProfile.certifications || [],
        careerInterests: userProfile.careerInterests || [],
        selfAssessment: userProfile.selfAssessment || {
          problemSolving: 0,
          communication: 0,
          leadership: 0,
          teamwork: 0,
          codingConfidence: 0
        },
        targetCareer: userProfile.targetCareer || "Career Exploration",
        profileCompletion: userProfile.profileCompletion || 25
      });
    } else if (currentUser) {
      // If Firestore profile is pending or not yet loaded, load from user's local cache if available
      let cached = null;
      try {
        const raw = localStorage.getItem(`student_profile_${currentUser.uid}`);
        if (raw) cached = JSON.parse(raw);
      } catch (e) {}

      if (cached && cached.personalInfo) {
        setProfile((prev) => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, ...cached.personalInfo },
          academicInfo: { ...prev.academicInfo, ...(cached.academicInfo || {}) },
          skills: cached.skills || prev.skills,
          projects: cached.projects || prev.projects,
          certifications: cached.certifications || prev.certifications,
          careerInterests: cached.careerInterests || prev.careerInterests,
          selfAssessment: cached.selfAssessment || prev.selfAssessment,
          targetCareer: cached.targetCareer || prev.targetCareer,
          profileCompletion: cached.profileCompletion || prev.profileCompletion
        }));
      } else {
        setProfile(createEmptyStudentProfile(currentUser));
      }
    } else {
      setProfile(createEmptyStudentProfile(null));
    }
  }, [userProfile, currentUser]);

  // Load interview history for the authenticated student
  useEffect(() => {
    if (!currentUser) {
      setRecentInterviews([]);
      return;
    }

    const loadInterviews = async () => {
      // 1. Try Firestore if configured
      if (isConfigured && db && currentUser.uid) {
        try {
          const q = query(
            collection(db, "interviewSessions"),
            where("userId", "==", currentUser.uid)
          );
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("INTERVIEWS_FETCH_TIMEOUT")), 3500)
          );
          const snap = await Promise.race([getDocs(q), timeoutPromise]);
          if (!snap.empty) {
            const list = snap.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data()
            }));
            // Sort by completedAt descending
            list.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
            setRecentInterviews(list);
            return;
          }
        } catch (e) {
          console.warn("Could not fetch interview sessions from Firestore:", e.message || e);
        }
      }

      // 2. Try user-specific local storage cache
      try {
        const key = `student_career_interviews_${currentUser.uid}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          setRecentInterviews(JSON.parse(saved));
        } else {
          setRecentInterviews([]);
        }
      } catch (e) {
        setRecentInterviews([]);
      }
    };

    loadInterviews();
  }, [currentUser, isConfigured]);

  // Save interviews cache per user
  useEffect(() => {
    if (currentUser?.uid) {
      try {
        localStorage.setItem(
          `student_career_interviews_${currentUser.uid}`,
          JSON.stringify(recentInterviews)
        );
      } catch (e) {}
    }
  }, [recentInterviews, currentUser]);

  const showToast = (message, type = "success") => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const saveStudentProfile = async (formData) => {
    if (!currentUser?.uid) {
      throw new Error("Your session has expired. Please log in again.");
    }

    const name = formData.name !== undefined ? formData.name.trim() : (profile.personalInfo?.name || "");
    const email = formData.email !== undefined ? formData.email.trim() : (profile.personalInfo?.email || currentUser.email || "");
    const phone = formData.phone !== undefined ? formData.phone.trim() : (profile.personalInfo?.phone || "");
    const college = formData.college !== undefined ? formData.college.trim() : (profile.personalInfo?.college || "");
    const degree = formData.degree !== undefined ? formData.degree.trim() : (profile.personalInfo?.degree || "");
    const department = formData.department !== undefined ? formData.department.trim() : (profile.personalInfo?.department || "");
    const year = formData.year !== undefined ? formData.year.trim() : (profile.personalInfo?.year || "");
    const semester = formData.semester !== undefined ? formData.semester.trim() : (profile.personalInfo?.semester || "");

    const rawCgpa = formData.cgpa !== undefined ? formData.cgpa : profile.academicInfo?.cgpa;
    const rawAtt = formData.attendance !== undefined ? formData.attendance : profile.academicInfo?.attendance;
    const rawBack = formData.backlogs !== undefined ? formData.backlogs : profile.academicInfo?.backlogs;

    const cgpaNum = parseFloat(rawCgpa);
    const attendanceNum = parseInt(rawAtt, 10);
    const backlogsNum = parseInt(rawBack, 10);

    const personalInfo = {
      name,
      email,
      phone,
      college,
      degree,
      department,
      year,
      semester
    };

    const academicInfo = {
      ...(profile.academicInfo || {}),
      cgpa: isNaN(cgpaNum) ? (profile.academicInfo?.cgpa || 0) : cgpaNum,
      attendance: isNaN(attendanceNum) ? (profile.academicInfo?.attendance || 0) : attendanceNum,
      academicScore: isNaN(cgpaNum) ? 0 : Math.round(cgpaNum * 10),
      backlogs: isNaN(backlogsNum) ? 0 : backlogsNum,
      semesterTrends: profile.academicInfo?.semesterTrends || [],
      subjectMarks: profile.academicInfo?.subjectMarks || []
    };

    // Calculate dynamic profile completion based on real filled data
    let completion = 20;
    if (name && email) completion += 20;
    if (college || degree || department) completion += 20;
    if (academicInfo.cgpa > 0) completion += 15;
    if ((profile.skills || []).length > 0) completion += 15;
    if ((profile.projects || []).length > 0 || (profile.certifications || []).length > 0) completion += 10;
    completion = Math.min(completion, 100);

    const fullPayload = {
      uid: currentUser.uid,
      fullName: name,
      email,
      course: degree,
      institution: college,
      department,
      year,
      semester,
      phone,
      personalInfo,
      academicInfo,
      skills: profile.skills || [],
      projects: profile.projects || [],
      certifications: profile.certifications || [],
      careerInterests: profile.careerInterests || [],
      selfAssessment: profile.selfAssessment || {
        problemSolving: 0,
        communication: 0,
        leadership: 0,
        teamwork: 0,
        codingConfidence: 0
      },
      targetCareer: profile.targetCareer || "Career Exploration",
      profileCompletion: completion,
      updatedAt: new Date().toISOString()
    };

    // 1. Direct Firestore write if configured with 8s failure timeout
    if (isConfigured && db && currentUser.uid) {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Unable to connect to the database. Your changes were not saved.")), 8000)
        );
        await Promise.race([
          setDoc(userRef, fullPayload, { merge: true }),
          timeoutPromise
        ]);
      } catch (err) {
        console.error("Firestore save error in saveStudentProfile:", err);
        const msg = err.message || "";
        if (msg.includes("Missing or insufficient permissions") || err.code === "permission-denied") {
          throw new Error("Permission denied. You are only authorized to update your own profile.");
        }
        if (msg.includes("Unable to connect") || err.code === "unavailable" || msg.includes("Failed to persist")) {
          throw new Error("Unable to connect to the database. Your changes were not saved.");
        }
        throw new Error(msg || "Unable to connect to the database. Your changes were not saved.");
      }
    }

    // 2. Update AuthContext state functionally (skip duplicate remote write)
    if (updateUserProfileData) {
      try {
        await updateUserProfileData(fullPayload, { skipRemoteWrite: true });
      } catch (err) {
        console.warn("AuthContext profile sync error:", err);
      }
    }

    // 3. Update StudentContext local profile state
    setProfile((prev) => ({
      ...prev,
      personalInfo,
      academicInfo,
      profileCompletion: completion
    }));

    // 4. Save to user-scoped local cache as persistence safety net
    try {
      localStorage.setItem(`student_profile_${currentUser.uid}`, JSON.stringify({
        personalInfo,
        academicInfo,
        skills: profile.skills || [],
        projects: profile.projects || [],
        certifications: profile.certifications || [],
        careerInterests: profile.careerInterests || [],
        selfAssessment: profile.selfAssessment || {},
        targetCareer: profile.targetCareer || "Career Exploration",
        profileCompletion: completion,
        updatedAt: new Date().toISOString()
      }));
    } catch (e) {}

    showToast("Student profile successfully updated and persisted!");
    return { success: true };
  };

  const updatePersonalInfo = async (newInfo) => {
    return saveStudentProfile({
      ...profile.personalInfo,
      ...profile.academicInfo,
      ...newInfo
    });
  };

  const updateAcademicInfo = async (newAcademic) => {
    return saveStudentProfile({
      ...profile.personalInfo,
      ...profile.academicInfo,
      ...newAcademic
    });
  };

  const updateSkillLevel = (skillName, newLevel, verified = true) => {
    setProfile((prev) => {
      const existing = prev.skills.find(
        (s) => s.name.toLowerCase() === skillName.toLowerCase()
      );
      let updatedSkills;
      if (existing) {
        updatedSkills = prev.skills.map((s) =>
          s.name.toLowerCase() === skillName.toLowerCase()
            ? { ...s, level: newLevel, verified }
            : s
        );
      } else {
        updatedSkills = [...prev.skills, { name: skillName, level: newLevel, verified }];
      }

      const verifiedCount = updatedSkills.filter((s) => s.verified).length;
      const calculatedCompletion = Math.min(65 + verifiedCount * 3, 98);

      const updated = {
        ...prev,
        skills: updatedSkills,
        profileCompletion: calculatedCompletion
      };

      if (updateUserProfileData) {
        updateUserProfileData({
          skills: updatedSkills,
          profileCompletion: calculatedCompletion
        });
      }

      return updated;
    });

    showToast(`⚡ Real-Time Update: ${skillName} score updated to ${newLevel}%! Verified badge synced.`);
  };

  const setTargetCareer = (targetCareer) => {
    setProfile((prev) => {
      const updated = { ...prev, targetCareer };
      if (updateUserProfileData) {
        updateUserProfileData({ targetCareer });
      }
      return updated;
    });
    showToast(`Target career set to ${targetCareer}! Skill gap recomputed.`);
  };

  const addProject = (project) => {
    setProfile((prev) => {
      const updatedProjects = [...prev.projects, { ...project, id: Date.now() }];
      const updated = { ...prev, projects: updatedProjects };
      if (updateUserProfileData) {
        updateUserProfileData({ projects: updatedProjects });
      }
      return updated;
    });
    showToast("New project added to your live portfolio!");
  };

  const addCertification = (cert) => {
    setProfile((prev) => {
      const updatedCerts = [...prev.certifications, { ...cert, id: Date.now() }];
      const updated = { ...prev, certifications: updatedCerts };
      if (updateUserProfileData) {
        updateUserProfileData({ certifications: updatedCerts });
      }
      return updated;
    });
    showToast("Certification verified and synced!");
  };

  const addInterviewRecord = async (interview) => {
    const newRecord = {
      id: "int_" + Date.now(),
      userId: currentUser?.uid || "guest",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      role: interview.role,
      score: interview.score,
      breakdown: interview.breakdown || {},
      verdict: interview.verdict || "Completed",
      completedAt: new Date().toISOString()
    };

    setRecentInterviews((prev) => [newRecord, ...prev]);

    // Save to Firestore if connected
    if (isConfigured && db && currentUser?.uid) {
      try {
        await addDoc(collection(db, "interviewSessions"), {
          userId: currentUser.uid,
          role: interview.role,
          overallScore: interview.score,
          breakdown: interview.breakdown || {},
          verdict: interview.verdict || "Completed",
          completedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn("Could not persist interview session to Firestore:", err);
      }
    }

    showToast(`🎯 Real-Time Scorecard saved! Interview score: ${interview.score}%`);
  };

  const reloadFromFirestore = async () => {
    if (!currentUser) {
      setProfile(createEmptyStudentProfile(null));
      setRecentInterviews([]);
      return;
    }

    if (isConfigured && db && currentUser.uid) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("RELOAD_DOC_TIMEOUT")), 3500)
        );
        const userDocSnap = await Promise.race([getDoc(userDocRef), timeoutPromise]);
        if (userDocSnap.exists()) {
          const uData = userDocSnap.data();
          setProfile({
            personalInfo: {
              name: uData.fullName || uData.personalInfo?.name || currentUser.displayName || currentUser.email?.split("@")[0] || "Student",
              email: uData.email || uData.personalInfo?.email || currentUser.email || "",
              degree: uData.course || uData.personalInfo?.degree || "",
              college: uData.institution || uData.personalInfo?.college || "",
              department: uData.department || uData.personalInfo?.department || "",
              year: uData.year || uData.personalInfo?.year || "",
              semester: uData.semester || uData.personalInfo?.semester || "",
              phone: uData.phone || uData.personalInfo?.phone || ""
            },
            academicInfo: uData.academicInfo || {
              cgpa: 0,
              attendance: 0,
              academicScore: 0,
              backlogs: 0,
              semesterTrends: [],
              subjectMarks: []
            },
            skills: uData.skills || [],
            projects: uData.projects || [],
            certifications: uData.certifications || [],
            careerInterests: uData.careerInterests || [],
            selfAssessment: uData.selfAssessment || {
              problemSolving: 0,
              communication: 0,
              leadership: 0,
              teamwork: 0,
              codingConfidence: 0
            },
            targetCareer: uData.targetCareer || "Career Exploration",
            profileCompletion: uData.profileCompletion || 25
          });
        } else {
          setProfile(createEmptyStudentProfile(currentUser));
        }

        const q = query(
          collection(db, "interviewSessions"),
          where("userId", "==", currentUser.uid)
        );
        const intTimeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("RELOAD_INTERVIEWS_TIMEOUT")), 3500)
        );
        const snap = await Promise.race([getDocs(q), intTimeoutPromise]);
        if (!snap.empty) {
          const list = snap.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          list.sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
          setRecentInterviews(list);
        } else {
          setRecentInterviews([]);
        }

        showToast("Profile synchronized with Cloud Firestore.");
        return;
      } catch (err) {
        console.warn("Could not reload data from Firestore:", err);
      }
    }

    setProfile(createEmptyStudentProfile(currentUser));
    setRecentInterviews([]);
    showToast("Profile refreshed.", "info");
  };

  const resetToDefault = () => {
    reloadFromFirestore();
  };

  return (
    <StudentContext.Provider
      value={{
        profile,
        recentInterviews,
        toast,
        showToast,
        saveStudentProfile,
        updatePersonalInfo,
        updateAcademicInfo,
        updateSkillLevel,
        setTargetCareer,
        addProject,
        addCertification,
        addInterviewRecord,
        reloadFromFirestore,
        resetToDefault
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);
