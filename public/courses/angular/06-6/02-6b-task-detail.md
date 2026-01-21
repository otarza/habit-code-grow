---
title: "6b. Task Detail კომპონენტის შექმნა"
order: 602
videoUrl: "https://youtu.be/GlRwvxyuqHk"
videoDuration: "10:15"
isPreview: false
---

Dummy Task Details:

`export const DUMMY_TASK_DETAILS = [
   {
       id: 1,
       description: 'Design and implement a user authentication flow using Firebase Authentication. This will include user registration, login, password reset, and email verification. Ensure that proper error handling is implemented, and the UI is responsive for both desktop and mobile devices.',
       dueDate: '11-10-24'
   },
   {
       id: 2,
       description: 'Set up and integrate the Stripe API into our e-commerce platform to allow users to securely process payments. Ensure that various payment methods (credit card, Apple Pay, Google Pay) are supported, and handle successful/failed transaction responses efficiently.',
       dueDate: '11-05-24'
   },
   {
       id: 3,
       description: 'Set up and integrate the Stripe API into our e-commerce platform to allow users to securely process payments. Ensure that various payment methods (credit card, Apple Pay, Google Pay) are supported, and handle successful/failed transaction responses efficiently.',
       dueDate: '12-11-24'
   },
   {
       id: 4,
       description: 'Perform a full audit of the website to identify bottlenecks affecting load times. Optimize images, reduce JavaScript and CSS files, and implement caching strategies. Ensure the website scores above 90 on Google PageSpeed Insights.',
       dueDate: '24-11-24'
   },
   {
       id: 5,
       description: 'Design and deploy a customer support chatbot using Dialogflow. The chatbot should be able to answer common customer queries, provide order status updates, and escalate issues to a human representative when necessary. Ensure integration with our existing support ticket system.',
       dueDate: '12-11-24'
   }


]
`
Dummy tasks:

`export const DUMMY_TASKS = [
   {
       id: 1,
       title: 'Create User Authentication Flow',
       assignee: 'JD',
       status: 'To Do'
   },
   {
       id: 2,
       title: 'Integrate Payment Gateway API',
       assignee: 'OL',
       status: 'In Progress'
   },
   {
       id: 3,
       title: 'Product Recommendation System',
       assignee: 'OL',
       status: 'Done'
   },
   {
       id: 4,
       title: 'Optimize Website Load Speed',
       assignee: 'OL',
       status: 'Done'
   },
   {
       id: 5,
       title: 'Build a Customer Support Chatbot',
       assignee: 'OL',
       status: 'Done'
   }
]
`
Task detail styles:

`.task-detail {
   border-radius: 10px;
   border: 1px solid #D3D3D3;
   padding: 20px;
}

div {
   padding: 10px;
}

.title {
   font-size: 22px;
   font-weight: 800;
   border-bottom: 1px solid #D3D3D3;
}

.description {
   font-size: 15px;
   font-weight: 400;
   border-bottom: 1px solid #D3D3D3;
}

.due-date {
   font-size: 12px;
}
`App component css:

```
main {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

div {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
}

p {
  text-align: center;
  margin-top: 40px;
  font-size: 20px;
  font-weight: 800;
}

```