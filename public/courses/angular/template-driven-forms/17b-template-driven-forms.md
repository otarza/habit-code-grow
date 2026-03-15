---
title: "17b, Template Driven Forms შესავალი"
order: 1702
videoUrl: "https://youtu.be/CZ23M8zzFww"
videoDuration: "10:55"
isPreview: false
---

HMTL:

`<form>
 <h2>Login</h2>
 <div class="control-row">
   <div class="control">
     <label for="email">Email</label>
     <input id="email" type="email" />
   </div>
   <div class="control">
     <label for="password">Password</label>
     <input id="password" type="password" />
   </div>
   <button>Login</button>
 </div>
</form>`CSS:

`form {
   width: 500px;
   height: 230px;
   background-color: bisque;
}

h2 {
   text-align: center;
   padding-top: 10px;
}

.control-row {
   display: flex;
   flex-direction: column;
   align-items: center;
}

.control {
   display: flex;
   flex-direction: row;
 margin-top: 20px;
}

label {
   min-width: 100px;
}

button {
   margin-top: 30px;
}
`