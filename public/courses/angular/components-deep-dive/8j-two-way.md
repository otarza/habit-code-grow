---
title: "8j. ორმხრივი (Two-Way) მონაცემთა ბაინდინგი"
order: 810
videoUrl: "https://youtu.be/T_tHIA7vLq0"
videoDuration: "15:06"
isPreview: false
---

HTML:

`<h2>Add Task</h2>
<form>
 <div>
   <label for="title">Title</label>
   <input type="text" id="title" name="title" />
 </div>
 <div>
   <label for="description">Description</label>
   <textarea name="description" id="summery" rows="5"></textarea>
 </div>
<div>
   <label for="assignee">Title</label>
   <input type="text" id="assignee" name="assignee" />
 </div>
 <div>
   <label for="due-date">Title</label>
   <input type="text" id="due-date" name="due-date" />
 </div>
</form>`CSS:

```
form {
   max-width: 600px;
   margin: 0 auto;
   padding: 20px;
   background-color: #f9f9f9;
   border-radius: 8px;
   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
 }
  form div {
   margin-bottom: 15px;
 }
  label {
   display: block;
   font-weight: bold;
   margin-bottom: 5px;
   color: #333;
 }
  input[type="text"],
 input[type="date"],
 textarea {
   width: 100%;
   padding: 10px;
   font-size: 16px;
   border: 1px solid #ccc;
   border-radius: 4px;
   box-sizing: border-box;
 }
  input[type="text"]:focus,
 input[type="date"]:focus,
 textarea:focus {
   outline: none;
   border-color: #007bff;
   box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
 }
  h2 {
   text-align: center;
   font-size: 24px;
   margin-bottom: 20px;
   color: #007bff;
 }
  app-button {
   margin: 20px auto;
 }

```