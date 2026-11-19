import { useState, useEffect }
from "react";

import { useNavigate }
from "react-router-dom";

import "../styles/AiDiagnosis.css";
import logo from "../assets/logo.png";
function AiDiagnosis() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");
  };

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const [result, setResult] =
    useState(null);

  const [history, setHistory] =
    useState([]);

  const [userReply, setUserReply] =
    useState("");

  const [chatMessages, setChatMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );

    setResult(null);
  };

  const handleSubmit = async () => {

    if (!image) {

      alert("Upload an image first");

      return;
    }

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("image", image);

      const response = await fetch(
        "http://127.0.0.1:8000/api/analyze/",
        {
          method: "POST",

          body: formData,

          credentials: "include"
        }
      );

      const data =
        await response.json();

      setResult(data);

      fetchHistory();

    } catch (error) {

      console.error(error);

      alert("Error occurred");
    }

    setLoading(false);
  };

  const fetchHistory = async () => {

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/history/",
        {
          credentials: "include"
        }
      );

      const data =
        await res.json();

      setHistory(data);

    } catch (err) {

      console.error(err);
    }
  };

  useEffect(() => {

    fetchHistory();

  }, []);

  return (

    <div className="ai-page">

      {/* NAVBAR */}
<div className="ai-navbar">

<div className="ai-logo-area">

<img
src={logo}
alt="logo"
className="ai-logo"
/>


</div>

        <button
          className="logout-btn"

          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* MAIN CARD */}

      <div className="ai-main-card">

        {/* UPLOAD */}

        <div className="upload-section">

          <input
            type="file"
            onChange={handleChange}
          />

          <br />

          {preview && (

            <img
              src={preview}
              alt="preview"

              className="preview-image"
            />
          )}

          <br /><br />

          <button
            className="analyze-btn"

            onClick={handleSubmit}
          >
            {loading
              ? "Analyzing..."
              : "Analyze"}
          </button>

        </div>

        {/* RESULT */}

        {result && (

          <div className="result-card">

            <h3>
              AI Diagnosis Result
            </h3>

            <p>
              <b>Category:</b>
              {result.category}
            </p>

            <p>
              <b>Problem:</b>
              {result.problem}
            </p>

            <p>
              <b>Risk:</b>
              {result.risk}
            </p>

            <p>
              <b>Advice:</b>
              {result.advice}
            </p>

            {/* QUESTIONS */}

            {result.questions && (

              <div className="questions-section">

                <h3>
                  AI Questions
                </h3>

                {result.questions.map(
                  (q, index) => (

                    <p key={index}>
                      • {q}
                    </p>
                  )
                )}

               {/* CHAT */}

<div className="chat-box">

{chatMessages.map(
(msg,index)=>(

<div
key={index}

className={
msg.sender==="user"
?
"user-msg"
:
"ai-msg"
}
>

<b>

{
msg.sender==="user"
?
"You"
:
"AI"
}

:</b>

{" "}

{msg.text}

</div>

))
}

</div>


{/* CHAT INPUT */}

<div className="chat-input">

<input
type="text"

placeholder="Reply to AI..."

value={userReply}

onChange={(e)=>
setUserReply(
e.target.value
)
}
/>


<button

className="send-btn"

onClick={async()=>{

if(!userReply)
return;

const newMessages=[

...chatMessages,

{

sender:"user",

text:userReply

}

];

setChatMessages(
newMessages
);

try{

const response=
await fetch(

"http://127.0.0.1:8000/api/chat/",

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

credentials:
"include",

body:
JSON.stringify({

message:
userReply,

chat_history:
newMessages

})

}

);

const data=
await response.json();

setChatMessages([

...newMessages,

{

sender:"ai",

text:data.reply

}

]);

}

catch(error){

console.error(
error
);

}

setUserReply("");

}}

>

Send
</button>

</div>

</div>

)}   

                 
            

            {/* BOOK BUTTON */}

            {result?.risk
              ?.toLowerCase()
              .includes("danger") && (

              <button
                className="book-btn"

                onClick={() =>
                  navigate("/booking")
                }
              >
                Book Technician
              </button>
            )}

          </div>
        )}

        {/* HISTORY */}

        <div className="history-section">

          <h2>
            Previous Diagnoses
          </h2>

          {history.map(
            (item, index) => (

              <div
                key={index}

                className="history-card"
              >

                <p>
                  <b>Problem:</b>
                  {item.problem}
                </p>

                <p>
                  <b>Risk:</b>
                  {item.risk}
                </p>

                <p>
                  <b>Advice:</b>
                  {item.advice}
                </p>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}

export default AiDiagnosis ;