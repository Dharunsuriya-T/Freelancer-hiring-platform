FreelanceHub is a streamlined MERN (MongoDB, Express.js, React.js, Node.js) web application designed to connect clients with freelancers in a simple, efficient, and real-time environment.
The platform provides two different user roles — Client and Freelancer — each receiving a customized dashboard, navigation, and feature set.

Built using lean and agile principles, FreelanceHub focuses on the essential features required for a functional hiring system, allowing fast development while maintaining a clear and scalable structure.

**User Roles**

1. Client

The client is the user who posts jobs and hires freelancers.
Clients can:

View all freelancers in the platform

Open freelancer profiles

Post new jobs

View their created jobs

See freelancers who applied

Accept a freelancer (assigning the job)

Chat with the assigned freelancer in real time

Mark the project as finished

2. Freelancer

The freelancer applies to jobs and completes the assigned work.
Freelancers can:

View all open jobs

View job details

Apply to jobs

View ongoing assigned jobs

Chat with the client in real time

Mark project as completed

Update their profile (profile picture, specialization, portfolio link)

View completed projects

**Core Features**
1. Secure Authentication

Signup & login for both roles

Password hashing using bcrypt

JWT-based login sessions

Role-based redirection after login

Client → /client/home

Freelancer → /freelancer/home

**2. Role-Based Dashboards**

FreelanceHub maintains two completely different user interfaces:

Client Dashboard

View freelancers

Create jobs

Manage posted jobs

Accept applications

Chat with freelancer

Freelancer Dashboard

View available jobs

Apply for jobs

View ongoing projects

Chat with client

Manage personal profile

**3. Job Management**
Clients can:

Create jobs with required details

View their posted jobs

See applicants

Accept a freelancer (which assigns the job and opens a chat)

Freelancers can:

Browse available jobs

View details

Apply instantly

Each job goes through states:

open → assigned → awaiting-client → completed

**4. Real-Time Chat (Socket.io)**

FreelanceHub includes a real-time communication system for collaboration.

Features:

Each job has a unique chat room

Instant messaging between client & freelancer

Messages stored in MongoDB

Chat available only after a freelancer is accepted

Once both users mark the job as finished, chat closes automatically

**5. Profile Management**

Freelancers can customize:

Profile picture

Specialization

Portfolio/Resume link

Clients can view these profiles before hiring.

**6. Project Completion Workflow**
Freelancer Action:

“Mark Completed”

Client Action:

“Finish Project”

Once both confirm:

Project chat is closed

Job is moved to completed list for the freelancer

**Technology Stack**
Frontend

React (Vite)

React Router

Axios

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Socket.io for live chat

REST API architecture

Backend runs Express + Socket.io

Frontend build served via Express

Database connected via MongoDB Atlas

Goal of the Project

The purpose of FreelanceHub is to:

Demonstrate full MERN stack development

Implement real-time features

Apply role-based logic

Build an end-to-end working application in a short time

Follow agile principles by focusing on essential functionality

FreelanceHub successfully delivers:

Secure login system

Full job posting & hiring flow

Real-time project communication

Profile management

Clean UI for both roles
