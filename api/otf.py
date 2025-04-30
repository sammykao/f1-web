import os
os.environ["HOME"] = "/tmp"
import json
from otf_api import Otf, OtfUser
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Get credentials from environment variables
        email = os.environ.get("OTF_EMAIL")
        password = os.environ.get("OTF_PASSWORD")
        if not email or not password:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Missing OTF_EMAIL or OTF_PASSWORD env vars"}).encode())
            return

        # Authenticate and fetch data
        otf = Otf(user=OtfUser(email, password))

        # Fetch data
        workouts = [w.model_dump() for w in otf.get_workouts()]
        stats = otf.get_member_lifetime_stats_in_studio().model_dump()
        classes = [c.model_dump() for c in otf.get_classes()]
        bookings = [b.model_dump() for b in otf.get_bookings()]

        # Combine all data
        data = {
            "workouts": workouts,
            "stats": stats,
            "classes": classes,
            "bookings": bookings
        }

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
        return 