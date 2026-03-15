---
title: "3e. Task component-ის გამოყენება"
order: 305
videoUrl: "https://youtu.be/PsFHK0yOOOk"
videoDuration: "5:27"
isPreview: false
---

HTML:

`<div class="task">
   <div class="title">Title</div>
   <div class="assignee">OL</div>
   <div class="status">In Progress</div>
</div>` 

CSS:

```
.task {
   width: 500px;
   height: 70px;
   background-color: #C8E6C9;
   cursor: pointer;
   border-radius: 10px;
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
}


.title {
   font-size: 20px;
   font-weight: 600;
   margin-left: 10px;
}


.assignee {
   width: 40px;
   height: 40px;
   background-color: #FFD600;
   border-radius: 50%;
   display: flex;
   align-items: center;
   justify-content: center;
   font-weight: 800;
}


.status {
   width: 100px;
   height: 30px;
   background-color: #0052CC;
   color: #fff;
   align-items: center;
   display: flex;
   justify-content: center;
   border-radius: 5px;
   margin-right: 10px;
}

main {
   display: flex;
   justify-content: center;
   margin-top: 20px;
}
```