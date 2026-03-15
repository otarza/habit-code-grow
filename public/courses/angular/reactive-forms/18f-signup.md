---
title: "18f. SignUp ფორმის შექმნა"
order: 1806
videoUrl: "https://youtu.be/wiMlplAwf8s"
videoDuration: "7:48"
isPreview: false
---

HTML:

`<form>
 <h2>Sign Up</h2>
 <div class="control-row">
   <div class="control">
     <label for="email">Email</label>
     <input id="email" type="email" />
   </div>
 </div>
 <div class="control-row">
   <div class="control">
     <label for="password">Password</label>
     <input id="password" type="password" />
   </div>
   <div class="control">
     <label for="confirmPassword">Confirm Password</label>
     <input id="confirmPassword" type="password" />
   </div>
 </div>
 <div class="control-row">
   <div class="control">
     <label for="city">City</label>
     <input id="city" type="text" />
   </div>
   <div class="control">
     <label for="zip">Zip</label>
     <input id="zip" type="text" />
   </div>
   <div class="control">
     <label for="country">Country</label>
     <input id="country" type="text" />
   </div>
 </div>
 <div class="control-row">
   <div class="control">
     <label for="sex">Sex</label>
     <select id="sex">
       <option value="male">Male</option>
       <option value="female">Female</option>
     </select>
   </div>
 </div>


 <div class="control-row">
   <label for="acceptTerms">From where did you hear about us?</label>
   <div class="control">
     <input id="google" type="checkbox" />
     <label for="google">Google</label>
   </div>
   <div class="control">
     <input id="facebook" type="checkbox" />
     <label for="facebook">Facebook</label>
   </div>
   <div class="control">
     <input id="twitter" type="checkbox" />
     <label for="twitter">Twitter</label>
   </div>
 </div>
 <button>Sign Up</button>
</form>
`
CSS:

```
:host {
 display: flex;
 height: 100vh;
}


form {
 width: 500px;
 height: 550px;
 background-color: bisque;
 padding: 10px;


}


.control-row {
 display: flex;
 flex-direction: row;
 justify-content: flex-start;
 gap: 20px;
 padding-top: 20px;
 padding-bottom: 20px;
 border-top: 1px solid black;
}


.control {
 display: flex;
 flex-direction: column;
 align-items: center;
}


label {
 min-width: 100px;
}


button {
 margin-top: 30px;
}

```