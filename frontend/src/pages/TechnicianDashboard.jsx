import { useEffect, useState } from "react";

import { useNavigate }
from "react-router-dom";

import "../styles/TechnicianDashboard.css";
import logo from "../assets/logo.png";
import {
Calendar,
User,
Phone,
Clock,
LogOut}
from "lucide-react";

function TechnicianDashboard() {

const navigate=
useNavigate();

const [
appointments,
setAppointments
]=
useState([]);

const [
showProfile,
setShowProfile
]=
useState(false);

const [
profile,
setProfile
]=
useState({

name:"",
phone:"",
specialty:"",
description:""

});

useEffect(()=>{

const username=
localStorage.getItem(
"username");

fetch(

`http://127.0.0.1:8000/api/technician-appointments/?username=${username}`)

.then(
(res)=>
res.json())

.then(
(data)=>{

setAppointments(
data
);})
.catch(
(error)=>{

console.log(
error
);});

},[]);



const loadProfile=
async()=>{

try{

const username=
localStorage.getItem(
"username");

const response=

await fetch(

`http://127.0.0.1:8000/api/technician-profile/?username=${username}`);

const data=

await response.json();

setProfile(
data);

setShowProfile(
true);}

catch(error){

console.log(
error
);}};



const saveProfile=
async()=>{

try{

await fetch(

"http://127.0.0.1:8000/api/technician-profile/",

{

method:"PUT",

headers:{

"Content-Type":
"application/json"

},

body:

JSON.stringify({

name:
profile.name,

phone:
profile.phone,

specialty:
profile.specialty,

description:
profile.description

})});

setShowProfile(
false);

loadProfile();}

catch(error){

console.log(
error
);}};



const handleLogout=
()=>{

localStorage.removeItem(
"token"
);

navigate("/");};

return(

<div className="dashboard-page">
    {/* TOP NAVBAR */}

<div className="dashboard-navbar">

<div className="dashboard-logo">

<img
src={logo}
alt="logo"/>

</div>

<div className="dashboard-actions">

<button
className="nav-btn"
onClick={()=>
navigate("/manage-schedule")}>
Manage Schedule
</button>

<button
className="nav-btn"
onClick={loadProfile}>
My Account
</button>

<button
className="logout-btn"
onClick={handleLogout}>
Logout
</button>

</div>

</div>


{showProfile&&(

<div className="profile-overlay">

<div className="profile-popup">

<h2>
My Account
</h2>

<h3>
{profile.name}
</h3>


<label>
Phone
</label>

<input
value={
profile.phone}

onChange={(e)=>

setProfile({

...profile,

phone:
e.target.value

})}/>

<label>

Specialty

</label>

<input

value={
profile.specialty}

onChange={(e)=>

setProfile({

...profile,

specialty:
e.target.value

})}/>

<label>

Description

</label>

<textarea

value={
profile.description}

onChange={(e)=>

setProfile({

...profile,

description:
e.target.value

})}/>

<button
onClick={
saveProfile}>

Save

</button>
<button

onClick={()=>

setShowProfile(
false
)}>

Close

</button>

</div>

</div>

)}

<div className="stats-card">

<div className="stats-icon">

📅

</div>

<div>

<h2>

Total Appointments

</h2>

<p>

{appointments.length}

</p>

</div>

</div>



<div
className="appointments-grid">
{
appointments.length>

0?(
appointments.map(
(

appointment

)=>(

<div

key={
appointment.id
}

className=
"appointment-card">
<div className="card-user">

<User size={45}/>

<h2>{appointment.technician}</h2>

</div>
<p>

<Phone size={18}/>

{appointment.phone}

</p>
<p>
<Calendar size={18}/>
{appointment.date}

</p>
<p>
<Clock size={18}/>
{appointment.time}

</p>

</div>

))):(

<div
className=
"empty-card">

<h2>

No Appointments Yet

</h2>

<p>

New bookings will appear here.

</p>

</div>

)}

</div>

</div>

);}

export default TechnicianDashboard;