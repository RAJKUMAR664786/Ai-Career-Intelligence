// Dedicated Bank of Multi-Round Real Mock Interviews
export const INTERVIEW_QUESTIONS_BANK = {
  "Full Stack Developer": [
    {
      "id": 1,
      "round": "Round 1: Core Fundamentals",
      "type": "Technical",
      "question": "Explain the Virtual DOM in React. How does React's reconciliation diffing algorithm optimize DOM manipulation when state changes?",
      "idealKeywords": [
        "virtual dom",
        "reconciliation",
        "diffing",
        "render tree",
        "batching",
        "real dom"
      ]
    },
    {
      "id": 2,
      "round": "Round 2: Backend Architecture & REST",
      "type": "Technical",
      "question": "What is the difference between SQL and NoSQL databases? In what specific scenarios would you choose PostgreSQL over MongoDB for a financial or e-commerce platform?",
      "idealKeywords": [
        "acid",
        "schema",
        "relations",
        "transactions",
        "consistency",
        "horizontal scaling",
        "indexes"
      ]
    },
    {
      "id": 3,
      "round": "Round 3: System Design & APIs",
      "type": "Technical",
      "question": "How do you handle user authentication and authorization securely in a RESTful Express.js application using JWT and HTTP-only cookies?",
      "idealKeywords": [
        "jwt",
        "http-only",
        "xss",
        "csrf",
        "refresh token",
        "middleware",
        "bcrypt"
      ]
    },
    {
      "id": 4,
      "round": "Round 4: Performance & Optimization",
      "type": "Technical",
      "question": "What strategies would you use to optimize the load time and Core Web Vitals (like LCP and INP) of a heavy React web application?",
      "idealKeywords": [
        "lazy loading",
        "code splitting",
        "usememo",
        "usecallback",
        "caching",
        "bundle size",
        "cdn"
      ]
    },
    {
      "id": 5,
      "round": "Round 5: Behavioral & Engineering Culture",
      "type": "HR",
      "question": "Describe a challenging technical bug or production issue you faced. Walk me through your debugging methodology and how you collaborated with your team under deadline pressure.",
      "idealKeywords": [
        "root cause",
        "logs",
        "communication",
        "reproduce",
        "calm",
        "post-mortem",
        "star"
      ]
    }
  ],
  "AI/ML Engineer": [
    {
      "id": 1,
      "round": "Round 1: Core ML Fundamentals",
      "type": "Technical",
      "question": "Explain the Bias-Variance tradeoff in machine learning. How do L1 (Lasso) and L2 (Ridge) regularization help prevent overfitting in high-dimensional models?",
      "idealKeywords": [
        "underfitting",
        "overfitting",
        "l1",
        "l2",
        "lasso",
        "ridge",
        "sparsity",
        "penalty"
      ]
    },
    {
      "id": 2,
      "round": "Round 2: Deep Learning Architecture",
      "type": "Technical",
      "question": "How do Convolutional Neural Networks (CNNs) preserve spatial hierarchy in image data? What is the function of convolutional filters, pooling layers, and ReLU activation?",
      "idealKeywords": [
        "kernels",
        "filters",
        "feature maps",
        "pooling",
        "spatial invariant",
        "relu",
        "stride"
      ]
    },
    {
      "id": 3,
      "round": "Round 3: Evaluation Metrics & Imbalance",
      "type": "Technical",
      "question": "Why is accuracy a misleading metric for imbalanced datasets like fraud detection or medical diagnosis? What metrics (Precision, Recall, F1-Score, ROC-AUC) would you prioritize and why?",
      "idealKeywords": [
        "false positive",
        "false negative",
        "precision",
        "recall",
        "f1",
        "roc auc",
        "confusion matrix"
      ]
    },
    {
      "id": 4,
      "round": "Round 4: MLOps & Production Serving",
      "type": "Technical",
      "question": "How do you transition a trained Scikit-Learn or PyTorch model into production? Discuss containerization with Docker, API inference with FastAPI, and monitoring for data drift.",
      "idealKeywords": [
        "docker",
        "fastapi",
        "latency",
        "batch",
        "data drift",
        "concept drift",
        "monitoring"
      ]
    },
    {
      "id": 5,
      "round": "Round 5: Stakeholder Communication",
      "type": "HR",
      "question": "Tell me about a time you had to explain a complex AI/ML model's predictions or decision-making process to a non-technical manager or client.",
      "idealKeywords": [
        "clarity",
        "analogy",
        "business value",
        "interpretability",
        "metrics",
        "active listening"
      ]
    }
  ],
  "Data Scientist": [
    {
      "id": 1,
      "round": "Round 1: Statistical Foundations",
      "type": "Technical",
      "question": "Explain the Central Limit Theorem and its significance in statistical inference. What is a p-value, and what does rejecting the null hypothesis signify?",
      "idealKeywords": [
        "sample mean",
        "normal distribution",
        "null hypothesis",
        "p-value",
        "significance level",
        "type 1 error"
      ]
    },
    {
      "id": 2,
      "round": "Round 2: A/B Testing & Experimentation",
      "type": "Technical",
      "question": "How would you design an end-to-end A/B test for a new feature? How do you calculate sample size, ensure randomization, and detect statistical significance?",
      "idealKeywords": [
        "hypothesis",
        "sample size",
        "control group",
        "statistical power",
        "p-value",
        "confidence interval"
      ]
    },
    {
      "id": 3,
      "round": "Round 3: Feature Engineering",
      "type": "Technical",
      "question": "What is your approach to handling missing values, extreme outliers, and multicollinearity in a tabular dataset prior to training predictive models?",
      "idealKeywords": [
        "imputation",
        "iqr",
        "vif",
        "correlation matrix",
        "standardization",
        "normalization"
      ]
    },
    {
      "id": 4,
      "round": "Round 4: Ensemble Methods",
      "type": "Technical",
      "question": "Explain the conceptual difference between Bagging (e.g. Random Forest) and Boosting (e.g. XGBoost, LightGBM). When would you choose one over the other?",
      "idealKeywords": [
        "bootstrap",
        "aggregation",
        "weak learners",
        "gradient boosting",
        "variance reduction",
        "sequential"
      ]
    },
    {
      "id": 5,
      "round": "Round 5: Problem Prioritization",
      "type": "HR",
      "question": "When presented with multiple ambiguous business problems, how do you determine which project has the highest ROI and feasibility for data science?",
      "idealKeywords": [
        "data availability",
        "business impact",
        "feasibility",
        "prioritization",
        "stakeholders"
      ]
    }
  ],
  "Cloud Engineer": [
    {
      "id": 1,
      "round": "Round 1: Cloud & Networking Foundations",
      "type": "Technical",
      "question": "Explain the differences between Public Subnets and Private Subnets in a VPC. How do NAT Gateways and Internet Gateways facilitate outbound and inbound routing?",
      "idealKeywords": [
        "vpc",
        "subnet",
        "nat gateway",
        "internet gateway",
        "route table",
        "security groups",
        "cidr"
      ]
    },
    {
      "id": 2,
      "round": "Round 2: Containerization & Kubernetes",
      "type": "Technical",
      "question": "What is the difference between a Docker image and a Docker container? In Kubernetes, explain the role of Pods, Deployments, and Services (ClusterIP vs NodePort vs LoadBalancer).",
      "idealKeywords": [
        "docker",
        "image",
        "container",
        "pod",
        "deployment",
        "service",
        "loadbalancer",
        "ingress"
      ]
    },
    {
      "id": 3,
      "round": "Round 3: Infrastructure as Code (IaC)",
      "type": "Technical",
      "question": "Why is Infrastructure as Code (e.g. Terraform) critical in cloud engineering? How does state management work, and how do you prevent state locking conflicts in teams?",
      "idealKeywords": [
        "terraform",
        "state file",
        "declarative",
        "remote backend",
        "s3",
        "dynamodb",
        "idempotent"
      ]
    },
    {
      "id": 4,
      "round": "Round 4: High Availability & Fault Tolerance",
      "type": "Technical",
      "question": "How do you architect a multi-region, fault-tolerant web application with auto-scaling, database replication, and zero downtime deployments?",
      "idealKeywords": [
        "multi-az",
        "multi-region",
        "auto scaling",
        "read replicas",
        "rto",
        "rpo",
        "health checks"
      ]
    },
    {
      "id": 5,
      "round": "Round 5: Incident Management",
      "type": "HR",
      "question": "Describe how you would respond if critical cloud infrastructure went down during peak production traffic. How do you triage, communicate, and conduct post-mortems?",
      "idealKeywords": [
        "triage",
        "rollback",
        "monitoring",
        "communication",
        "root cause",
        "runbook",
        "sla"
      ]
    }
  ],
  "Data Analyst": [
    {
      "id": 1,
      "round": "Round 1: Advanced SQL Queries",
      "type": "Technical",
      "question": "What are SQL Window Functions (e.g. ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG), and how do they differ from standard GROUP BY aggregations?",
      "idealKeywords": [
        "window function",
        "over",
        "partition by",
        "order by",
        "rank",
        "lead lag",
        "row number"
      ]
    },
    {
      "id": 2,
      "round": "Round 2: Data Cleaning & Wrangling",
      "type": "Technical",
      "question": "Walk me through how you identify and clean messy data in Pandas. How do you handle duplicate rows, date parsing inconsistencies, and datatype conversions?",
      "idealKeywords": [
        "pandas",
        "drop duplicates",
        "to datetime",
        "astype",
        "isna",
        "dropna",
        "string cleaning"
      ]
    },
    {
      "id": 3,
      "round": "Round 3: KPI Design & Dashboards",
      "type": "Technical",
      "question": "How do you choose the right chart types (e.g. line, bar, scatter, heatmap) in Power BI or Tableau to communicate actionable business KPIs effectively?",
      "idealKeywords": [
        "tableau",
        "power bi",
        "kpi",
        "storytelling",
        "trend",
        "distribution",
        "comparison",
        "executive"
      ]
    },
    {
      "id": 4,
      "round": "Round 4: Statistical Interpretation",
      "type": "Technical",
      "question": "What is the difference between correlation and causation? Give a business example where high correlation led to an incorrect business decision.",
      "idealKeywords": [
        "correlation",
        "causation",
        "spurious",
        "confounding variable",
        "experimentation"
      ]
    },
    {
      "id": 5,
      "round": "Round 5: Executive Presentation",
      "type": "HR",
      "question": "How do you present data findings and technical metrics to non-technical executive stakeholders who have only 5 minutes to make a strategic decision?",
      "idealKeywords": [
        "executive summary",
        "actionable",
        "visual",
        "bottom line",
        "clarity",
        "concise"
      ]
    }
  ]
};
