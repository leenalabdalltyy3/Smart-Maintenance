from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from openai import OpenAI
import base64
import json
from .models import Schedule
from .models import Scan, Appointment
from .models import History
client = OpenAI(api_key="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")


# 🔍 ANALYZE IMAGE
@csrf_exempt
def analyze_problem(request):

    if request.method == 'POST':

        image = request.FILES.get('image')

        if image:

            image_bytes = image.read()

            image_base64 = base64.b64encode(
                image_bytes
            ).decode('utf-8')

            prompt = """
You are an AI electrical maintenance assistant.

Analyze the uploaded electrical issue image.

IMPORTANT:
- Do NOT assume the issue with certainty.
- The image alone may not be enough.
- Suggest possible causes carefully.
- Ask follow-up troubleshooting questions.
- Prioritize electrical safety.

Respond ONLY with valid JSON.

Format:

{
  "category": "short issue category",
  "problem": "short description",
  "risk": "simple/moderate/dangerous",
  "advice": "short advice",
  "questions": [
    "question 1",
    "question 2",
    "question 3"
  ]
}
"""

            try:

                response = client.responses.create(

                    model="gpt-4o-mini",

                    input=[
                        {
                            "role": "user",

                            "content": [
                                {
                                    "type": "input_text",
                                    "text": prompt
                                },

                                {
                                    "type": "input_image",

                                    "image_url":
                                    f"data:image/png;base64,{image_base64}"
                                }
                            ]
                        }
                    ]
                )

                text = response.output[0].content[0].text.strip()

                if text.startswith("```"):

                    text = text.replace(
                        "```json",
                        ""
                    ).replace(
                        "```",
                        ""
                    ).strip()

                try:

                    parsed = json.loads(text)
                    print(parsed)
                    History.objects.create(
    problem=parsed.get("problem"),
    risk=parsed.get("risk"),
    advice=parsed.get("advice")
)
                except:

                    parsed = {
                        "problem": text,
                        "risk": "unknown",
                        "advice": text,
                        "questions": []
                    }

                parsed["problem"] = parsed.get(
                    "problem",
                    ""
                )[:100]

                parsed["advice"] = parsed.get(
                    "advice",
                    ""
                )[:150]

                if request.user.is_authenticated:

                    Scan.objects.create(
                        user=request.user,

                        problem=parsed.get("problem"),

                        risk=parsed.get("risk"),

                        advice=parsed.get("advice")
                    )

                return JsonResponse(parsed)

            except Exception as e:

                return JsonResponse({
                    "error": str(e)
                })

        return JsonResponse({
            "error": "No image uploaded"
        })

    return JsonResponse({
        "error": "Invalid request"
    })
# 📜 HISTORY (USER ONLY)
def get_history(request):

    history = History.objects.all().order_by("-created_at")

    data = []

    for item in history:

        data.append({
            "problem": item.problem,
            "risk": item.risk,
            "advice": item.advice
        })

    return JsonResponse(data, safe=False)
# 👤 REGISTER
@csrf_exempt
def register_user(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "User already exists"})

        User.objects.create_user(username=username, password=password)

        return JsonResponse({"message": "User created successfully"})

    return JsonResponse({"error": "Invalid request"})


# 🔐 LOGIN
@csrf_exempt

def login_user(request):

    if request.method == "POST":

        try:

            data = json.loads(request.body)

            username = data.get("username")

            password = data.get("password")
            print(username)
            print(password)
            user = authenticate(
                username=username,
                password=password
            )

            if user is not None:

                login(request, user)

                return JsonResponse({

                    "message":
                    "Login successful",

                    "is_staff":
                    user.is_staff
                })

            else:

                return JsonResponse({

                    "error":
                    "Invalid username or password"
                })

        except Exception as e:

            return JsonResponse({

                "error": str(e)
            })
@csrf_exempt
def book_appointment(request):

    if request.method == "POST":

        try:

            data = json.loads(
                request.body
            )

            technician = data.get(
                "technician"
            )

            date = data.get(
                "date"
            )

            time = data.get(
                "time"
            )

            existing = Appointment.objects.filter(

                technician=technician,

                date=date,

                time=time

            )

            if existing.exists():

                return JsonResponse({

                    "error":
                    "This time is already booked"

                })


            Appointment.objects.create(

                technician=technician,

                date=date,

                time=time,

                phone=data.get(
                    "customer_phone"
                )

            )
                

            Schedule.objects.filter(

                technician__username=

                technician,

                day=date,

                time=time

            ).update(

                booked=True

            )


            return JsonResponse({

                "message":

                "Appointment booked successfully"

            })


        except Exception as e:

            return JsonResponse({

                "error":
                str(e)

            })


    return JsonResponse({

        "error":

        "Invalid request"

    })
@csrf_exempt
def ai_chat(request):

    if request.method == "POST":

        data = json.loads(request.body)

        user_message = data.get("message")
        chat_history = data.get("chat_history", [])

        
        try:

            prompt = f"""
You are a smart household electrical maintenance assistant.

Your job is to HELP solve simple electrical problems safely before recommending a technician.

Conversation history:

{chat_history}

Latest user reply:

{user_message}

{user_message}

IMPORTANT RULES:

- First suggest safe troubleshooting steps.
- Ask follow-up questions if needed.
- Suggest simple household checks.
- Do NOT immediately recommend an electrician.
- ONLY recommend contacting a technician if:
  - there is exposed wiring,
  - burning smell,
  - repeated breaker trips,
  - sparks,
  - serious danger,
  - or the issue cannot be solved safely.

Keep the response short, helpful, and natural.
"""

            response = client.responses.create(
                model="gpt-4o-mini",
                input=prompt
            )

            ai_reply = response.output_text

            return JsonResponse({
                "reply": ai_reply
            })

        except Exception as e:

            return JsonResponse({
                "error": str(e)
            })

            response = client.responses.create(
                model="gpt-4o-mini",
                input=prompt
            )

            ai_reply = response.output_text

            return JsonResponse({
                "reply": ai_reply
            })

        except Exception as e:

            return JsonResponse({
                "error": str(e)
            })

    return JsonResponse({
        "error": "Invalid request"
    })
@csrf_exempt

def signup_view(request):

    if request.method == "POST":

        try:

            data = json.loads(request.body)

            username = data.get("username")

            email = data.get("email")

            password = data.get("password")

            role = data.get(
                "role",
                "customer"
            )

            if not username or not email or not password:

                return JsonResponse({
                    "error":
                    "Please fill all fields"
                })

            if User.objects.filter(
                username=username
            ).exists():

                return JsonResponse({
                    "error":
                    "Username already exists"
                })

            user = User.objects.create_user(

                username=username,

                email=email,

                password=password
            )

            # Technician

            if role == "technician":

                user.is_staff = True

            # Customer

            else:

                user.is_staff = False

            user.save()

            return JsonResponse({

                "message":
                "Account created successfully",

                "role":
                role,

                "is_staff":
                user.is_staff
            })

        except Exception as e:

            return JsonResponse({

                "error":
                str(e)
            })

    return JsonResponse({

        "error":
        "POST request required"
    })

from .models import *

# OR if explicit imports:

from .models import (
Schedule,
Appointment,
Technician
)
from django.views.decorators.csrf import csrf_exempt
import json
@csrf_exempt
def schedule_view(request):

    if request.method == "GET":

        username = request.GET.get(
            "username"
        )

        slots = Schedule.objects.filter(
            technician__username=username
        )

        data = []

        for slot in slots:

            data.append({

                "day":
                slot.day,

                "time":
                slot.time,

                "booked":
                slot.booked,

                "technician":
                slot.technician.username

            })

        return JsonResponse(
            data,
            safe=False
        )


    elif request.method == "POST":

        data = json.loads(
            request.body
        )

        user = User.objects.get(

            username=
            data["username"]

        )

        Schedule.objects.create(

            technician=user,

            day=data["day"],

            time=data["time"],

            booked=False

        )

        return JsonResponse({

            "message":
            "added"

        })


    elif request.method == "DELETE":

        data = json.loads(
            request.body
        )

        Schedule.objects.filter(

            technician__username=
            data["username"],

            day=
            data["day"],

            time=
            data["time"]

        ).delete()


        Appointment.objects.filter(

            technician__username=
            data["username"],

            date=
            data["day"],

            time=
            data["time"]

        ).update(

            status="Deleted"

        )


        return JsonResponse({

            "message":
            "deleted"

        })


    return JsonResponse({

        "error":
        "invalid"

    })
def customer_schedule(request):

    technician = request.GET.get(
        "technician"
    )

    slots = Schedule.objects.filter(

        technician__username=
        technician

    )

    data = []

    for slot in slots:

        data.append({

            "day":
            slot.day,

            "time":
            slot.time,

            "booked":
            slot.booked

        })

    return JsonResponse(

        data,

        safe=False

    )
@csrf_exempt
def book_slot(request):

    if request.method=="POST":

        data=json.loads(
            request.body
        )

        Schedule.objects.filter(

            day=data.get("day"),

            time=data.get("time")

        ).update(

            booked=True

        )

        return JsonResponse({

            "message":
            "booked"

        })

    return JsonResponse({

        "error":
        "invalid"

    })
def technician_appointments(request):

    username = request.GET.get(
        "username"
    )

    appointments = Appointment.objects.filter(

        technician=username

    ).exclude(

        status="Deleted"

    )

    data=[]

    for appointment in appointments:

        data.append({

            "id":
            appointment.id,

            "technician":
            appointment.technician,

            "phone":
            appointment.phone,

            "date":
            appointment.date,

            "time":
            appointment.time,

            "status":
            appointment.status

        })

    return JsonResponse(

        data,

        safe=False

    )
@csrf_exempt
def technician_profile(request):

    username = request.GET.get(
        "username"
    )


    technician = Technician.objects.filter(

        user__username=username

    ).first()


    if request.method == "GET":

        if technician:

            return JsonResponse({

                "name":

                technician.user.username,

                "phone":

                technician.phone,

                "specialty":

                technician.specialty,

                "description":

                technician.description

            })


        return JsonResponse({

            "name":

            username,

            "phone":"",

            "specialty":"",

            "description":""

        })



    elif request.method == "PUT":

        data = json.loads(

            request.body

        )


        username = data.get(

            "name"

        )


        user = User.objects.filter(

            username=username

        ).first()


        if not user:

            return JsonResponse({

                "error":

                "user not found"

            })


        technician = Technician.objects.filter(

            user=user

        ).first()



        if technician:

            technician.phone = data.get(

                "phone",

                ""

            )


            technician.specialty = data.get(

                "specialty",

                ""

            )


            technician.description = data.get(

                "description",

                ""

            )


            technician.save()


        else:

            Technician.objects.create(

                user=user,

                phone=data.get(

                    "phone",

                    ""

                ),

                specialty=data.get(

                    "specialty",

                    ""

                ),

                description=data.get(

                    "description",

                    ""

                )

            )


        return JsonResponse({

            "message":

            "saved"

        })



    return JsonResponse({

        "error":

        "invalid"

    })
@csrf_exempt
def technicians_list(request):

    technicians = Technician.objects.all()

    data = []

    for tech in technicians:

        data.append({

            "id":
            tech.id,

            "name":
            tech.user.username,

            "phone":
            tech.phone,

            "specialty":
            tech.specialty,

            "description":
            tech.description

        })

    return JsonResponse(

        data,

        safe=False

    )
