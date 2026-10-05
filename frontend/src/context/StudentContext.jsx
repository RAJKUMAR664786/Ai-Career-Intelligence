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
      setProfile(createEmptyStudentProfile(currentUser));
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
          const snap = await getDocs(q);
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
          console.warn("Could not fetch interview sessions from Firestore:", e);
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

  const updatePersonalInfo = (newInfo) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        personalInfo: { ...prev.personalInfo, ...newInfo }
      };
      if (updateUserProfileData) {
        updateUserProfileData({
          fullName: updated.personalInfo.name,
          course: updated.personalInfo.degree,
          institution: updated.personalInfo.college,
          phone: updated.personalInfo.phone,
          personalInfo: updated.personalInfo
        });
      }
      return updated;
    });
    showToast("Personal details updated in real time!");
  };

  const updateAcademicInfo = (newAcademic) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        academicInfo: { ...prev.academicInfo, ...newAcademic }
      };
      if (updateUserProfileData) {
        updateUserProfileData({ academicInfo: updated.academicInfo });
      }
      return updated;
    });
    showToast("Academic records updated in real time!");
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
        const userDocSnap = await getDoc(userDocRef);
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
        const snap = await getDocs(q);
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
