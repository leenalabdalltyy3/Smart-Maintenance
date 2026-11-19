from django.urls import path
from .views import ai_chat
from .views import *
from .views import (
    analyze_problem,
    get_history,
    login_user,
    book_appointment,
    signup_view,
    technician_appointments,
    schedule_view,
    customer_schedule
)
urlpatterns = [
    path('analyze/', analyze_problem),
    path('history/', get_history),
    path('login/', login_user),  
    path('signup/', signup_view), # 🔥 IMPORTANT
    path('book/', book_appointment),
    path('chat/', ai_chat),
    path('technician-appointments/',technician_appointments),
    path("schedule/",schedule_view),
    path("customer-schedule/",customer_schedule),
    path("book-slot/",book_slot),
    path("technician-profile/",technician_profile),
    path("technicians/",technicians_list),
    path("technicians/",technicians_list),
]