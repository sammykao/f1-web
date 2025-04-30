import os
os.environ["HOME"] = "/tmp"
import json
from otf_api import Otf, OtfUser
from otf_api.filters import ClassFilter, ClassType, DoW
from otf_api.models.enums import ChallengeCategory, EquipmentType, StatsTime
from http.server import BaseHTTPRequestHandler
import datetime

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

            # Classes (flatten fields)
            classes = []
            for c in otf.get_classes():
                d = c.model_dump()
                # Flatten
                d_flat = {
                    "name": d.get("name"),
                    "starts_at": d.get("starts_at"),
                    "coach": d.get("coach") if isinstance(d.get("coach"), str) else (
                        f"{d.get('coach', {}).get('first_name', '')} {d.get('coach', {}).get('last_name', '')}".strip() if d.get('coach') else None
                    ),
                    "studio": d.get("studio", {}).get("name") if d.get("studio") else None,
                    "raw": d
                }
                classes.append(d_flat)

            # Bookings (flatten fields)
            bookings = []
            for b in otf.get_bookings():
                d = b.model_dump()
                otf_class = d.get("otf_class", {})
                coach = otf_class.get("coach")
                coach_name = coach if isinstance(coach, str) else (
                    f"{coach.get('first_name', '')} {coach.get('last_name', '')}".strip() if coach else None
                )
                bookings.append({
                    "class_name": otf_class.get("name"),
                    "starts_at": otf_class.get("starts_at"),
                    "studio": otf_class.get("studio", {}).get("name") if otf_class.get("studio") else None,
                    "coach": coach_name,
                    "status": d.get("status"),
                    "raw": d
                })

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

            # Performance summaries (flatten fields)
            performance_summaries = []
            for s in otf.get_performance_summaries():
                d = s.model_dump()
                otf_class = d.get("otf_class", {})
                performance_summaries.append({
                    "class_name": otf_class.get("name"),
                    "starts_at": otf_class.get("starts_at"),
                    "calories_burned": d.get("calories_burned"),
                    "splat_points": d.get("splat_points"),
                    "zone_time_minutes": d.get("zone_time_minutes"),
                    "coach": d.get("coach"),
                    "raw": d
                })

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
            def json_serial(obj):
                if isinstance(obj, (datetime.datetime, datetime.date, datetime.time)):
                    return obj.isoformat()
                raise TypeError(f"Type {type(obj)} not serializable")
            self.wfile.write(json.dumps(data, default=json_serial).encode())
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