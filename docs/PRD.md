# CampusConnect AI
## Smart College Discovery & Admission Experience Platform

Product Requirement Document (PRD)

Version: 1.0
Project Type: AI Powered Full Stack Application

---

# 1. Product Overview

## Product Name

CampusConnect AI

## Target Institution

Sri Satya Institute of Engineering and Technology

## Product Category

AI-powered College Discovery and Admission Assistance Platform


---

# 2. Vision Statement

CampusConnect AI is a digital platform designed to help students and parents explore Sri Satya Institute of Engineering and Technology before admission.

The platform provides complete college information including:

- Courses
- Branches
- Fees
- Infrastructure
- Placements
- Faculty
- Campus life
- Admission process

along with AI-powered assistance through:

- Website AI Assistant
- WhatsApp RAG Chatbot


The goal is to create a personalized digital admission experience available 24/7.


---

# 3. Problem Statement


Students searching for colleges usually face problems:

- Lack of complete information in one place
- Difficulty understanding fee structures
- Confusion about available branches
- Lack of instant admission guidance
- Difficulty comparing colleges
- No personalized career guidance


CampusConnect AI solves these problems by providing:

A complete digital college discovery platform with AI assistance.


---

# 4. Target Users


## Primary Users

### Students

Students who want:

- College information
- Course details
- Fee details
- Admission guidance
- Career information


### Parents

Parents who want:

- Safety information
- Infrastructure details
- Fees
- Hostel information
- Placement details


## Secondary Users

### College Administration

Manage:

- College content
- Courses
- Fees
- Documents
- Announcements


---

# 5. Core Product Features


# Phase 1: Foundation & UI Development


## 1. Landing Page


Features:

- Premium hero section
- College introduction
- AI generated campus video
- Call-to-action buttons


Sections:

- About college
- Courses
- Placements
- Infrastructure
- Admission


---

## 2. College Profile


Display:

- College history
- Establishment details
- Vision
- Mission
- Achievements
- Accreditation
- Rankings


UI:

Interactive timeline


---

## 3. College Statistics


Animated counters:


Example:

- Total students
- Faculty count
- Years of excellence
- Courses offered
- Placement percentage


---

# Phase 2: Academic Information System


# 4. Course Explorer


Students can explore:


Engineering branches:


- Computer Science Engineering
- Artificial Intelligence and Data Science
- Electronics and Communication Engineering
- Mechanical Engineering
- Civil Engineering


Each course contains:


- Overview
- Eligibility
- Duration
- Subjects
- Career opportunities
- Higher studies
- Department facilities


Features:

- Search
- Filtering
- Course comparison


---

# 5. Fee Structure Module


Students can view:


Fee categories:


- Tuition fees
- Hostel fees
- Transport fees
- Examination fees


Features:


- Branch-wise fees
- Year-wise fees
- Scholarship details
- Download fee brochure


---

# Phase 3: Campus Experience Platform


# 6. Infrastructure Showcase


Display:


Academic Facilities:

- Smart classrooms
- Laboratories
- Library
- Research centers


Student Facilities:

- Hostel
- Cafeteria
- Sports
- Transportation
- Medical facilities


Advanced:

Interactive campus map


---

# 7. AI Generated Visual Gallery


Create unique AI generated media:


Images:

- Campus
- Buildings
- Labs
- Students
- Events
- Departments


Videos:

- Virtual campus tour
- College promotional video
- Department introduction videos


---

# 8. Faculty Showcase


Display:


- Faculty name
- Department
- Qualification
- Experience
- Research interests


---

# Phase 4: Admission Experience


# 9. Admission Information System


Features:


Admission process:


Step 1:
Eligibility checking


Step 2:
Application


Step 3:
Counselling


Step 4:
Document verification


Step 5:
Admission confirmation


Information:

- Required documents
- Entrance exams
- Important dates


---

# 10. Scholarship Information


Display:


- Scholarship programs
- Eligibility
- Application process


---

# Phase 5: Placement & Student Success


# 11. Placement Portal


Features:


Placement statistics:


- Highest package
- Average package
- Placement percentage
- Recruiting companies


Additional:

- Student success stories
- Alumni achievements


---

# 12. Student Reviews


Features:


- Ratings
- Testimonials
- Campus experiences


---

# Phase 6: AI Integration


# 13. Website AI Assistant


Purpose:

Answer student questions instantly.


Example:


User:

"What is the CSE fee?"


AI:

Provides answer from college knowledge base.


---

# 14. WhatsApp Based RAG Chatbot


## Objective


Provide admission assistance through WhatsApp.


Students can message:

"What are admission requirements?"


AI automatically responds.


---

# RAG Architecture


## Knowledge Sources


Upload:


- College brochure
- Admission documents
- Fee structure
- Course details
- Hostel information
- Scholarship documents
- Placement reports
- College history


Pipeline:


Documents

↓

Document Processing

↓

Text Chunking

↓

Embedding Generation

↓

Pinecone Vector Database

↓

Retriever

↓

LLM

↓

WhatsApp Response



---

# Vector Database


Technology:

Pinecone


Stores:


- College knowledge
- FAQs
- Admission information
- Course information


---

# WhatsApp Integration


Technology options:


- WhatsApp Business API
OR
- Twilio WhatsApp API


Features:


## Admission Query


Example:


Student:

"How to apply for CSE?"


AI:

Provides admission procedure.


---

## Document Checklist


Example:


Student:

"What documents needed?"


AI:

Returns required documents list.


---

## Fee Query


Student:

"What is hostel fee?"


AI:

Provides fee details.


---

# Phase 7: Advanced AI Features


# 15. AI Course Recommendation


Input:


- Marks
- Interests
- Budget
- Career goal


Output:


Recommended:

- Branch
- Course
- Career path


---

# 16. College Comparison


Compare:


- Fees
- Courses
- Facilities
- Placements
- Infrastructure


---

# 17. AI Admission Predictor


Input:


- Entrance rank
- Category
- Preferred branch


Output:


Admission probability.


---

# Technical Architecture


## Frontend


Framework:

Next.js + TypeScript


UI:

- Tailwind CSS
- Shadcn UI
- Framer Motion


---

## Backend


Framework:

FastAPI


Responsibilities:

- API management
- Data processing
- AI integration


---

## Database


PostgreSQL + Supabase


Tables:


College

Courses

Departments

Fees

Faculty

Facilities

Placements

Reviews

Documents

AI Conversations


---

## AI Stack


LLM:

Groq / OpenAI


Framework:

LangChain


Vector Database:

Pinecone


Embeddings:

OpenAI/HuggingFace


---

# Development Roadmap


## Phase 1
Foundation

Duration:
Week 1-2


Tasks:

- Setup project
- Create UI architecture
- Landing page
- College profile


---

## Phase 2
College Information System

Duration:
Week 3-4


Tasks:

- Courses
- Fees
- Infrastructure
- Faculty


---

## Phase 3
Admission Platform

Duration:
Week 5


Tasks:

- Admission guide
- Scholarship
- Documents


---

## Phase 4
Placement & Reviews

Duration:
Week 6


Tasks:

- Placement dashboard
- Testimonials


---

## Phase 5
AI Integration

Duration:
Week 7-8


Tasks:

- Create RAG pipeline
- Setup Pinecone
- Upload documents
- Website chatbot


---

## Phase 6
WhatsApp AI Assistant

Duration:
Week 9


Tasks:

- WhatsApp API integration
- Message handling
- AI responses


---

## Phase 7
Final Enhancement

Duration:
Week 10


Tasks:

- Performance optimization
- Deployment
- Testing
- Documentation


---

# Deployment Architecture


Frontend:

Vercel


Backend:

Render/Railway


Database:

Supabase


Vector Database:

Pinecone


Storage:

Supabase Storage


---

# Final Product Goal


CampusConnect AI should become:

"A complete AI-powered digital admission companion that allows students to discover Sri Satya Institute of Engineering and Technology and get instant admission guidance through website and WhatsApp."

