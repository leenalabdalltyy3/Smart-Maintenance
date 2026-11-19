import {

useState,

useEffect

}

from "react";
import { useNavigate }
from "react-router-dom";

import "../styles/Booking.css";
import logo from "../assets/logo.png";

function Booking() {

const navigate =
useNavigate();

const [

technicians,

setTechnicians

]=

useState([]);

const [selectedTech,
setSelectedTech]=
useState(null);

const [bookingSuccess,
setBookingSuccess]=
useState(false);
useEffect(()=>{

fetch(

"http://127.0.0.1:8000/api/technicians/"

)

.then(
(res)=>
res.json()
)

.then(
(data)=>{

setTechnicians(
data
);

}

)

.catch(
(error)=>{

console.log(
error
);

}

);

},[]);



const openSchedule=
async(tech)=>{

try{
const response=

await fetch(

`http://127.0.0.1:8000/api/customer-schedule/?technician=${tech.name}`

);

const data=

await response.json();

setSelectedTech({

...tech,

schedule:data

});

}

catch(error){

console.log(error);

}

};



const handleLogout=
()=>{

localStorage.removeItem(
"token"
);

navigate("/");

};



return(
<div className="booking-page">

<div className="booking-navbar">

<img
src={logo}
alt="Smart Maintenance"
className="booking-logo"
/>

<button
className="logout-btn"
onClick={handleLogout}
>

Logout

</button>

</div>


{bookingSuccess&&(

<div
className="popup-overlay"
>

<div
className="success-popup"
>

<h2>

Booking Confirmed ✅

</h2>

<button

onClick={()=>{

setBookingSuccess(
false
);

}}

>

OK

</button>

</div>

</div>

)}



<div
className="technicians-grid"
>

{

technicians.map(

(tech)=>(

<div

key={
tech.id
}

className="tech-card"

>

<h2>

{tech.name}

</h2>

<p>

{tech.specialty}

</p>

<p>

{tech.phone}

</p>

<p>

{tech.description}

</p>


<button

className=
"schedule-btn"

onClick={()=>{

if(

selectedTech?.id===

tech.id

){

setSelectedTech(
null
);

}

else{

openSchedule(
tech
);

}

}}

>

{

selectedTech?.id===

tech.id

?

"Hide Schedule"

:

"View Schedule"

}

</button>



{

selectedTech?.id===

tech.id

&&

(

<div
className=
"schedule-box"
>

{

selectedTech.schedule
?.length>0

?

(

<table
className=
"schedule-table"
>

<thead>

<tr>

<th>
Day
</th>

<th>
Time
</th>

<th>
Status
</th>

<th>
Action
</th>

</tr>

</thead>

<tbody>

{

selectedTech.schedule.map(

(
slot,
index
)=>(

<tr
key={index}
>

<td>

{slot.day}

</td>

<td>

{slot.time}

</td>
<td>

{

slot.booked

?

"Unavailable"

:

"Available"

}

</td>

<td>

{

slot.booked

?

(

<button

disabled

className=
"unavailable-btn"

>

Unavailable

</button>

)

:

(

<button

className=
"book-slot-btn"
onClick={async()=>{

await fetch(

"http://127.0.0.1:8000/api/book-slot/",

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},
body:

JSON.stringify({

technician:
selectedTech.name,

customer_phone:
selectedTech.phone,

date:
slot.day,

time:
slot.time

})

}

);


await fetch(

"http://127.0.0.1:8000/api/book-slot/",

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:

JSON.stringify({

day:
slot.day,

time:
slot.time

})

}

);



const booking =

await fetch(

"http://127.0.0.1:8000/api/book/",

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:

JSON.stringify({

technician:
selectedTech.name,

date:
slot.day,

time:
slot.time,

customer_phone:
"0790000000"

})

}

);

console.log(

await booking.json()

);


slot.booked=true;

setSelectedTech({

...selectedTech

});

setBookingSuccess(
true
);

}}

>

Book

</button>

)

}

</td>
</tr>

)

)

}

</tbody>

</table>

)

:

(

<h3>

No slots yet

</h3>

)

}

</div>

)

}

</div>

)

)

}

</div>

</div>

);

}

export default Booking;