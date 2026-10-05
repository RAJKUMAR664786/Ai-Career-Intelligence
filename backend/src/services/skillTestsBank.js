// Dedicated Bank of Separated Skill Assessment Tests
export const SKILL_QUIZZES = {
  "Python": [
    {
      "id": 1,
      "question": "Which of the following built-in data structures in Python is mutable?",
      "options": [
        "tuple",
        "string",
        "list",
        "frozenset"
      ],
      "correctIndex": 2,
      "explanation": "Lists in Python are mutable, meaning their elements can be modified in-place, unlike tuples, strings, and frozensets."
    },
    {
      "id": 2,
      "question": "What is the average time complexity of searching for a key in a standard Python dictionary (dict)?",
      "options": [
        "O(n)",
        "O(log n)",
        "O(1)",
        "O(n log n)"
      ],
      "correctIndex": 2,
      "explanation": "Python dictionaries use hash tables, offering O(1) amortized constant time complexity for key lookups."
    },
    {
      "id": 3,
      "question": "What is the primary role of Python's Global Interpreter Lock (GIL)?",
      "options": [
        "Accelerates multi-core CPU bound parallel tasks",
        "Prevents multiple native threads from executing Python bytecodes simultaneously to protect reference count memory management",
        "Compiles Python bytecode to native machine assembly",
        "Forces all functions to be purely functional without side effects"
      ],
      "correctIndex": 1,
      "explanation": "The GIL is a mutex that prevents multiple native threads from executing Python bytecodes at once, ensuring CPython's memory management remains thread-safe."
    },
    {
      "id": 4,
      "question": "What will `[x**2 for x in range(5) if x % 2 == 0]` evaluate to?",
      "options": [
        "[0, 4, 16]",
        "[0, 1, 4, 9, 16]",
        "[4, 16]",
        "[0, 2, 4]"
      ],
      "correctIndex": 0,
      "explanation": "For range(5) (0, 1, 2, 3, 4), the even numbers are 0, 2, 4. Their squares are 0, 4, 16."
    },
    {
      "id": 5,
      "question": "Which decorator is used to define a method that operates on the class itself rather than an object instance?",
      "options": [
        "@staticmethod",
        "@classmethod",
        "@property",
        "@abstractmethod"
      ],
      "correctIndex": 1,
      "explanation": "@classmethod passes the class (cls) as its first implicit parameter."
    },
    {
      "id": 6,
      "question": "What keyword is used inside a Python function to turn it into a Generator that yields values lazily?",
      "options": [
        "return",
        "emit",
        "yield",
        "generator"
      ],
      "correctIndex": 2,
      "explanation": "`yield` pauses the function state and produces values on demand during iteration."
    }
  ],
  "JavaScript": [
    {
      "id": 1,
      "question": "In the JavaScript Event Loop, which queue takes priority and is executed immediately after the current synchronous call stack empties?",
      "options": [
        "Macrotask Queue (setTimeout)",
        "Microtask Queue (Promises, queueMicrotask)",
        "RequestAnimationFrame",
        "I/O Callback Queue"
      ],
      "correctIndex": 1,
      "explanation": "Microtasks (Promise callbacks, process.nextTick) have higher priority and run to completion before the next macrotask is processed."
    },
    {
      "id": 2,
      "question": "What is a Closure in JavaScript?",
      "options": [
        "A method to close browser tabs programmatically",
        "The combination of a function bundled together with references to its surrounding lexical environment",
        "A private class keyword introduced in ES2022",
        "A way to terminate asynchronous promises early"
      ],
      "correctIndex": 1,
      "explanation": "A closure gives an inner function access to its outer enclosing function's scope even after the outer function has finished executing."
    },
    {
      "id": 3,
      "question": "What will `console.log(typeof null)` output in standard JavaScript?",
      "options": [
        "'null'",
        "'undefined'",
        "'object'",
        "'boolean'"
      ],
      "correctIndex": 2,
      "explanation": "`typeof null === 'object'` is a historical artifact in JavaScript's initial type tag implementation."
    },
    {
      "id": 4,
      "question": "How do Arrow Functions handle the `this` context compared to standard function declarations?",
      "options": [
        "Arrow functions create their own dynamic `this` context bound to the caller",
        "Arrow functions retain the lexical `this` from their enclosing execution context",
        "Arrow functions always set `this` to undefined",
        "Arrow functions can only be bound using .bind()"
      ],
      "correctIndex": 1,
      "explanation": "Arrow functions do not bind their own `this`; they lexically inherit `this` from the enclosing outer scope."
    },
    {
      "id": 5,
      "question": "Which Promise method returns as soon as any one of the input promises settles (either resolves or rejects)?",
      "options": [
        "Promise.all()",
        "Promise.race()",
        "Promise.allSettled()",
        "Promise.any()"
      ],
      "correctIndex": 1,
      "explanation": "Promise.race() resolves or rejects as soon as the first promise in the iterable settles."
    }
  ],
  "React": [
    {
      "id": 1,
      "question": "What does `useEffect` with an empty dependency array `[]` represent in React component lifecycle?",
      "options": [
        "Runs on every state and prop update",
        "Runs once after the initial render (analogous to componentDidMount)",
        "Runs only when the component encounters an error",
        "Disables rendering completely"
      ],
      "correctIndex": 1,
      "explanation": "An empty dependency array tells React to execute the effect callback only once when the component mounts."
    },
    {
      "id": 2,
      "question": "Why does React require a unique `key` prop when rendering arrays of components or elements?",
      "options": [
        "To assign CSS selectors automatically",
        "To help React identify which items have changed, been added, or removed for efficient Virtual DOM diffing",
        "To enforce sorting order in JavaScript",
        "To securely encrypt user list data"
      ],
      "correctIndex": 1,
      "explanation": "Keys provide stable identity across renders, allowing React's reconciliation engine to reuse existing DOM nodes efficiently."
    },
    {
      "id": 3,
      "question": "What is the difference between `useMemo` and `useCallback` in React?",
      "options": [
        "`useMemo` caches a calculated value, while `useCallback` caches a function definition",
        "`useCallback` caches a calculated value, while `useMemo` caches DOM nodes",
        "`useMemo` runs asynchronously; `useCallback` runs synchronously",
        "They are identical and can be used interchangeably"
      ],
      "correctIndex": 0,
      "explanation": "`useMemo` returns a memoized result of a calculation; `useCallback` returns a memoized function reference."
    },
    {
      "id": 4,
      "question": "How does React 18+ handle state batching inside promises, timeouts, and native event handlers?",
      "options": [
        "State updates are never batched outside React event handlers",
        "Automatic Batching groups multiple state updates into a single re-render across all asynchronous boundaries",
        "Developers must manually wrap updates with flushSync()",
        "Only one state update is allowed per second"
      ],
      "correctIndex": 1,
      "explanation": "React 18 introduced Automatic Batching across promises, setTimeout, and native event listeners to minimize re-renders."
    },
    {
      "id": 5,
      "question": "What is the purpose of the `useRef` hook?",
      "options": [
        "Triggers a re-render whenever its `.current` value changes",
        "Persists a mutable reference across renders without causing component re-render when mutated",
        "Handles global state management without Context",
        "Creates deep copies of props"
      ],
      "correctIndex": 1,
      "explanation": "useRef creates a mutable object whose `.current` property persists between renders without triggering re-renders."
    }
  ],
  "SQL": [
    {
      "id": 1,
      "question": "Which clause is used to filter aggregate groupings produced by a `GROUP BY` clause in SQL?",
      "options": [
        "WHERE",
        "HAVING",
        "ORDER BY",
        "FILTER"
      ],
      "correctIndex": 1,
      "explanation": "`HAVING` filters aggregated groups, whereas `WHERE` filters individual rows prior to grouping."
    },
    {
      "id": 2,
      "question": "What is the key difference between `DELETE` and `TRUNCATE` in SQL databases?",
      "options": [
        "`DELETE` is faster than `TRUNCATE`",
        "`DELETE` is a DML command that logs row deletions and supports WHERE filters; `TRUNCATE` is a DDL command that deallocates data pages quickly",
        "`TRUNCATE` can only delete individual columns",
        "There is no difference in PostgreSQL and MySQL"
      ],
      "correctIndex": 1,
      "explanation": "TRUNCATE drops and recreates table pages (DDL), making it much faster, while DELETE removes rows individually (DML) with full undo logging."
    },
    {
      "id": 3,
      "question": "What does the 'I' in the database ACID acronym stand for?",
      "options": [
        "Indexation",
        "Integrity",
        "Isolation",
        "Immutable"
      ],
      "correctIndex": 2,
      "explanation": "Isolation guarantees that concurrently running transactions do not interfere with each other's execution states."
    },
    {
      "id": 4,
      "question": "Which type of SQL JOIN preserves all rows from the Left table, inserting NULLs for rows that have no match in the Right table?",
      "options": [
        "INNER JOIN",
        "CROSS JOIN",
        "LEFT OUTER JOIN",
        "FULL OUTER JOIN"
      ],
      "correctIndex": 2,
      "explanation": "A LEFT JOIN keeps every row from the left table and populates columns with NULL when the join condition fails on the right table."
    },
    {
      "id": 5,
      "question": "What data structure is standard for primary key B-Tree indexes in relational databases?",
      "options": [
        "Balanced Search Tree (B-Tree/B+ Tree)",
        "Singly Linked List",
        "Min Heap",
        "Adjacency Matrix"
      ],
      "correctIndex": 0,
      "explanation": "B+ Trees maintain sorted order with logarithmic time O(log N) for searching, range scans, and insertions."
    }
  ],
  "Firebase": [
    {
      "id": 1,
      "question": "What is the structural difference between Cloud Firestore and Firebase Realtime Database?",
      "options": [
        "Realtime Database is document-oriented; Firestore is a giant JSON tree",
        "Firestore organizes data into collections of documents with subcollections; Realtime DB is one large JSON tree",
        "Firestore does not support real-time listeners",
        "Realtime DB supports multi-region data redundancy"
      ],
      "correctIndex": 1,
      "explanation": "Firestore is a NoSQL document database structured into collections and documents with scalable querying."
    },
    {
      "id": 2,
      "question": "How do Cloud Firestore Security Rules enforce authentication checks on write requests?",
      "options": [
        "allow write: if request.auth != null;",
        "requireAuth = true;",
        "grant write to authenticated;",
        "auth.checkCredentials();"
      ],
      "correctIndex": 0,
      "explanation": "`request.auth != null` ensures the incoming request is signed by an authenticated user token."
    },
    {
      "id": 3,
      "question": "How does Firestore handle offline capabilities on web clients?",
      "options": [
        "Offline usage is impossible in web browsers",
        "Firestore provides offline persistence through IndexedDB caching with `enableIndexedDbPersistence()`",
        "Data is stored in unencrypted cookies",
        "Web workers write to local SQLite files"
      ],
      "correctIndex": 1,
      "explanation": "Firestore web SDK caches documents in browser IndexedDB, synchronizing changes once connectivity resumes."
    }
  ],
  "Machine Learning": [
    {
      "id": 1,
      "question": "What happens when a machine learning model exhibits High Variance?",
      "options": [
        "Underfitting: Model fails to capture underlying patterns on both train and test data",
        "Overfitting: Model fits training data noise too closely and fails to generalize to unseen test data",
        "The model produces constant predictions",
        "The learning rate is too low"
      ],
      "correctIndex": 1,
      "explanation": "High variance leads to overfitting, where the model learns specific training noise instead of generalizable patterns."
    },
    {
      "id": 2,
      "question": "What is the key difference in mathematical penalty between L1 (Lasso) and L2 (Ridge) Regularization?",
      "options": [
        "L1 adds squared weights; L2 adds absolute weights",
        "L1 adds the absolute value of coefficients (|w|), causing sparse weights; L2 adds squared coefficients (w^2), shrinking weights smoothly",
        "L1 is only for classification; L2 is only for regression",
        "There is no difference in loss formulation"
      ],
      "correctIndex": 1,
      "explanation": "L1 regularization drives coefficients strictly to zero (feature selection), while L2 regularization shrinks coefficients asymptotically."
    },
    {
      "id": 3,
      "question": "Which metric is the harmonic mean of Precision and Recall?",
      "options": [
        "ROC-AUC",
        "F1-Score",
        "Mean Squared Error",
        "Accuracy"
      ],
      "correctIndex": 1,
      "explanation": "The F1-Score balances Precision and Recall: 2 * (Precision * Recall) / (Precision + Recall)."
    },
    {
      "id": 4,
      "question": "In Random Forest algorithms, what ensemble technique is utilized?",
      "options": [
        "Boosting: Trees are trained sequentially to correct previous errors",
        "Bagging (Bootstrap Aggregating): Independent trees are trained on random subsets of data and features",
        "Stacking: A meta-model combines outputs",
        "Gradient clipping"
      ],
      "correctIndex": 1,
      "explanation": "Random Forest combines Bagging with random feature subspace selection across multiple decision trees."
    },
    {
      "id": 5,
      "question": "What is the purpose of K-Fold Cross Validation?",
      "options": [
        "Increases the number of training examples artificially",
        "Assesses model generalizability by partitioning data into K subsets, iteratively training on K-1 folds and validating on 1 fold",
        "Reduces hyperparameter tuning time",
        "Replaces gradient descent optimization"
      ],
      "correctIndex": 1,
      "explanation": "K-Fold cross validation gives a robust, low-bias estimate of model performance across the entire dataset."
    }
  ],
  "Statistics": [
    {
      "id": 1,
      "question": "What does the Central Limit Theorem state?",
      "options": [
        "All populations must be normally distributed",
        "The sampling distribution of the sample mean approaches a normal distribution as sample size increases (n >= 30), regardless of population distribution",
        "The mean is always equal to the median in skewed data",
        "Variance decreases to zero with large samples"
      ],
      "correctIndex": 1,
      "explanation": "The CLT proves that the distribution of sample means approaches normality as sample size increases."
    },
    {
      "id": 2,
      "question": "What is a Type I error in statistical hypothesis testing?",
      "options": [
        "Failing to reject a false null hypothesis (False Negative)",
        "Rejecting a true null hypothesis (False Positive)",
        "Calculating the wrong degrees of freedom",
        "Setting alpha = 0.05"
      ],
      "correctIndex": 1,
      "explanation": "A Type I error occurs when the null hypothesis is true, but we mistakenly reject it."
    },
    {
      "id": 3,
      "question": "What percentage of data falls within 2 standard deviations of the mean in a standard Normal Distribution (Empirical Rule)?",
      "options": [
        "50%",
        "68%",
        "95%",
        "99.7%"
      ],
      "correctIndex": 2,
      "explanation": "The 68-95-99.7 rule dictates that approximately 95% of data falls within +/- 2 standard deviations of the mean."
    },
    {
      "id": 4,
      "question": "What is the value range of Pearson's Correlation Coefficient (r)?",
      "options": [
        "0 to 1",
        "-1 to +1",
        "-infinity to +infinity",
        "0 to 100"
      ],
      "correctIndex": 1,
      "explanation": "Pearson's correlation ranges from -1 (perfect negative linear correlation) to +1 (perfect positive linear correlation)."
    }
  ],
  "TensorFlow": [
    {
      "id": 1,
      "question": "What is a Tensor in TensorFlow?",
      "options": [
        "A Python database driver",
        "A multi-dimensional array of uniform data type with GPU/TPU acceleration support",
        "A web worker thread",
        "An image processing file format"
      ],
      "correctIndex": 1,
      "explanation": "Tensors are immutable n-dimensional arrays optimized for high-performance vectorized computation."
    },
    {
      "id": 2,
      "question": "Which activation function is widely used in hidden layers of Deep Neural Networks to mitigate vanishing gradient problems?",
      "options": [
        "Sigmoid",
        "ReLU (Rectified Linear Unit)",
        "Step Function",
        "Linear"
      ],
      "correctIndex": 1,
      "explanation": "ReLU: f(x) = max(0, x), provides constant gradient of 1 for positive inputs, avoiding gradient vanishing in deep networks."
    },
    {
      "id": 3,
      "question": "In Keras / TensorFlow, which callback stops model training when a monitored metric (e.g. val_loss) stops improving?",
      "options": [
        "ModelCheckpoint",
        "EarlyStopping",
        "ReduceLROnPlateau",
        "TensorBoard"
      ],
      "correctIndex": 1,
      "explanation": "EarlyStopping monitors validation loss and halts training once patience epochs pass without improvement."
    },
    {
      "id": 4,
      "question": "What optimizer is commonly used in Deep Learning combining Momentum and RMSprop?",
      "options": [
        "SGD",
        "Adam (Adaptive Moment Estimation)",
        "Adagrad",
        "Nesterov"
      ],
      "correctIndex": 1,
      "explanation": "Adam calculates adaptive learning rates for each parameter using both first and second moments of gradients."
    }
  ],
  "Data Analysis": [
    {
      "id": 1,
      "question": "In Pandas, what is the difference between `df.drop_duplicates()` and `df.dropna()`?",
      "options": [
        "`drop_duplicates` removes identical rows; `dropna` removes rows containing missing/null values",
        "`dropna` removes duplicate columns",
        "`drop_duplicates` resets the index",
        "They perform identical operations"
      ],
      "correctIndex": 0,
      "explanation": "drop_duplicates eliminates repeated rows; dropna filters out rows or columns with missing (NaN/None) values."
    },
    {
      "id": 2,
      "question": "Which method is commonly used to detect statistical outliers in skewed datasets using percentiles?",
      "options": [
        "Interquartile Range (IQR): Values < Q1 - 1.5*IQR or > Q3 + 1.5*IQR",
        "Sorting ascending",
        "MinMax Scaler",
        "One-hot encoding"
      ],
      "correctIndex": 0,
      "explanation": "The 1.5 * IQR rule is the standard robust statistical method for identifying outliers."
    },
    {
      "id": 3,
      "question": "What technique converts categorical string columns (e.g. 'Red', 'Green', 'Blue') into binary columns for modeling?",
      "options": [
        "One-Hot Encoding (get_dummies)",
        "StandardScaler",
        "Log Transform",
        "PCA"
      ],
      "correctIndex": 0,
      "explanation": "One-Hot Encoding creates binary 0/1 indicator columns for each unique categorical level."
    }
  ]
};

export const getSkillQuiz = (skillName) => {
  const matchedKey = Object.keys(SKILL_QUIZZES).find(k => k.toLowerCase() === (skillName || '').toLowerCase());
  const quiz = matchedKey ? SKILL_QUIZZES[matchedKey] : SKILL_QUIZZES['Python'];
  return {
    skillName: matchedKey || skillName,
    questions: quiz,
    totalQuestions: quiz.length
  };
};
