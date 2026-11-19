//Main landing page for the ai diagnosis and tech. booking 
import { useNavigate } from "react-router-dom";

import "../styles/Home.css";

import logo from "../assets/logo.png";

function Home() {

const navigate=useNavigate();

const handleLogout=()=>{

localStorage.removeItem("token");

navigate("/");

};

return(

<div className="home-page">

<div className="navbar">

<img
src={logo}
alt=""
className="home-logo"
/>

<button
onClick={handleLogout}
>

Logout

</button>

</div>


<div className="hero-section">

<div className="hero-left">

<h1>

AI-Powered Maintenance
for Smarter Living

</h1>

<p>

Detect issues early,
analyze risks intelligently,
and connect with verified
maintenance professionals.

</p>

<div className="hero-buttons">

<button
className="ai-btn"
onClick={()=>
navigate("/assistant")
}
>

AI Assistant

</button>


<button
className="book-btn"
onClick={()=>
navigate("/booking")
}
>

Book Technician

</button>

</div>

</div>


<div className="hero-right">

<div className="hero-card">

<h3>

Smart Home
Support

</h3>

<p>

Advanced AI support for
electrical maintenance
and household services.

</p>

</div>

</div>

</div>



<div className="features-section">

<div className="feature-card">

<h3>

AI Diagnosis

</h3>

<p>

Upload images and let AI
identify possible issues.

</p>

</div>



<div className="feature-card">

<h3>

Technician Booking

</h3>

<p>

Book experienced
technicians easily.

</p>

</div>



<div className="feature-card">

<h3>

Smart Monitoring

</h3>

<p>

Receive recommendations
and preventive guidance.

</p>

</div>

</div>
<div className="contact-section">

<h2>
Contact Us
</h2>

<p>
Email:
leenalabdallat3@gmail.com
</p>

<p>
Phone:
+962 788522230
</p>

<p>
Amman, Jordan
</p>

</div>

</div>

);

}

export default Home;