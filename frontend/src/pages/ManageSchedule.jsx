import {
useState,
useEffect
}
from "react";

import "../styles/ManageSchedule.css";
import logo from "../assets/logo.png";

function ManageSchedule() {

const [slots,setSlots]=
useState([]);

const [day,setDay]=
useState("");

const [time,setTime]=
useState("");


const loadSchedule=()=>{

const username=
localStorage.getItem(
"username"
);

fetch(

`http://127.0.0.1:8000/api/schedule/?username=${username}`

)

.then(
res=>res.json()
)

.then(
data=>{

setSlots(data);

})

.catch(
err=>
console.log(err)
);

};


useEffect(()=>{

loadSchedule();

},[]);

const addSlot=
async()=>{

try{

const response=

await fetch(

"http://127.0.0.1:8000/api/schedule/",

{

method:"POST",

headers:{
"Content-Type":
"application/json"},

body:

JSON.stringify({

username:

localStorage.getItem(
"username"),

day,

time

})});

if(response.ok){

loadSchedule();

setDay("");

setTime("");}

else{

alert(
"Failed to add slot");}}

catch(error){

console.log(
error);}};

const deleteSlot=
async(slot)=>{

await fetch(

"http://127.0.0.1:8000/api/schedule/",

{method:"DELETE",

headers:{"Content-Type":
"application/json"},

body:

JSON.stringify({

username:

localStorage.getItem(
"username"),

day:

slot.day,

time:

slot.time

})});
loadSchedule();};


return(

<div
className="schedule-page"
>
<div className="schedule-header">

<img
src={logo}
alt="logo"
className="schedule-logo"/>

</div>

<div
className="add-card">

<select

value={day}

onChange={(e)=>

setDay(
e.target.value
)}>

<option value="">

Select Day

</option>

<option>

Monday

</option>

<option>

Tuesday

</option>

<option>

Wednesday

</option>

<option>

Thursday

</option>

<option>

Friday

</option>

</select>


<input

type="time"

value={time}

onChange={(e)=>

setTime(
e.target.value)}/>


<button

onClick={addSlot}>

Add Slot

</button>

</div>

<div
className="slot-list">{

slots.length>0
?

slots.map(

(slot,index)=>(

<div

key={index}

className="slot-card">

<div>

{slot.day}

—

{slot.time}

</div>


<button
onClick={()=>

deleteSlot(
slot)}>

Delete

</button>

</div>
)):

<p>

No slots yet

</p>}

</div>

</div>

);}

export default ManageSchedule;