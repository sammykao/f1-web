import os
os.environ["HOME"] = "/tmp"
import json
from otf_api import Otf, OtfUser
from otf_api.filters import ClassFilter, ClassType, DoW
from otf_api.models.enums import ChallengeCategory, EquipmentType, StatsTime
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Get credentials from environment variables
            email = os.environ.get("OTF_EMAIL")
            password = os.environ.get("OTF_PASSWORD")
            print(email, password)
            if not email or not password:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Missing OTF_EMAIL or OTF_PASSWORD env vars"}).encode())
                return

            # Authenticate and fetch data
            otf = Otf(user=OtfUser(email, password))

            # Classes
            classes = [c.model_dump() for c in otf.get_classes()]
            bookings = [b.model_dump() for b in otf.get_bookings()]

            # Challenge Data
            equipment_challenges = {}
            for et in list(EquipmentType)[:2]:  # Limit for performance
                equipment_challenges[et.name] = [b.model_dump() for b in otf.get_benchmarks_by_equipment(et)]
            category_challenges = {}
            for ct in list(ChallengeCategory)[:2]:  # Limit for performance
                category_challenges[ct.name] = [b.model_dump() for b in otf.get_benchmarks_by_challenge_category(ct)]

            # Lifetime stats
            stats = otf.get_member_lifetime_stats_in_studio().model_dump()
            stats_this_month = otf.get_member_lifetime_stats_in_studio(StatsTime.ThisMonth).model_dump()

            # Performance summaries
            performance_summaries = [s.model_dump() for s in otf.get_performance_summaries()]

            # Studio data
            studios_by_geo = [s.model_dump() for s in otf.search_studios_by_geo()]
            studio_detail = otf.get_studio_detail().model_dump()
            studio_services = []
            if 'studio_uuid' in studio_detail:
                studio_services = [svc.model_dump() for svc in otf.get_studio_services(studio_detail['studio_uuid'])]
            favorite_studios = [f.model_dump() for f in otf.get_favorite_studios()]

            # Combine all data
            data = {
                "classes": classes,
                "bookings": bookings,
                "equipment_challenges": equipment_challenges,
                "category_challenges": category_challenges,
                "stats": stats,
                "stats_this_month": stats_this_month,
                "performance_summaries": performance_summaries,
                "studios_by_geo": studios_by_geo,
                "studio_detail": studio_detail,
                "studio_services": studio_services,
                "favorite_studios": favorite_studios,
            }

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode())
        except Exception as e:
            # Log the error to the console
            print("Error in handler:", e)
            import traceback
            traceback.print_exc()
            # Respond with 500 and error message
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
        return 