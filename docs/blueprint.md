# **App Name**: X-Reply Autopilot

## Core Features:

- Post Queue: Display a live queue of incoming posts with infinite scroll, showing post text, author, time, tags, priority & risk scores. Uses a hook that listens to Firestore 'posts' collection and returns an ordered list by priorityScore then createdAt.
- Candidate Generation: Call the 'generateCandidates' Firebase Function upon receiving a new post in the queue, passing the postId to the backend which returns 3 candidate objects which get stored under 'candidates/{candidateId}'.
- Candidate Approval/Rejection: Implement action buttons for each candidate (Approve/Edit & Post/Reject) which update Firestore and display status updates, including a way to edit inline candidates with character count and emoji selector.
- Safety Checks: Integrate with the 'safetyCheck' Firebase Function (tool) by calling it upon candidate generation to assess toxicity, political, medical, and doxx risks with confidence scores, then present this SafetyPanel component (color-coded) with these checks on '/queue/[postId]' view.
- Prompt Template Editor: Implement a prompt bank editor at '/templates' for listing, creating, editing, and versioning prompt templates.  The template editor shows seed, tone, tags, safety flags, and includes a mock generator and voice guide based on the provided document to see sample outputs. Pull seed prompt examples from the template collection
- Rate Limit Configuration: Implement a form at '/settings' to set global caps, per-author caps, and jitter parameters, persisting these configurations to Firestore 'config/system'.
- Posting Simulation and Audit Trail: Upon candidate approval, the UI should trigger the 'postReply' callable function (stub), and it must show a simulated response including 'xReplyId' if the post was a success, and keep record of this history in replies/. Audit entries are also created in 'replies/'

## Style Guidelines:

- Primary color: HSL(210, 75%, 50%) which is a vivid blue (#29ABE2) to represent trust and automation.
- Background color: HSL(210, 20%, 95%) which is a light, desaturated blue (#F0F8FF).
- Accent color: HSL(180, 60%, 40%) which is a medium-brightness teal (#2ab0b0), complementing the primary with a contrasting color representing reliability.
- Headline font: 'Space Grotesk', sans-serif for a modern, tech-forward feel. Body font: 'Inter', sans-serif for clean and readable UI text.
- Use simple, line-based icons for clarity and to maintain a consistent visual language across the interface.
- Implement a clean, card-based layout to present information in an organized manner with a mobile-first responsive design.
- Use subtle animations and transitions to provide feedback on user interactions, such as loading states or successful posting events.