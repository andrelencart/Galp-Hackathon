import requests

BASE = "http://127.0.0.1:5000/"

response = requests.put(BASE + "video/3", json={"likes": 10, "views": 27, "name": "Diogo"})
print(response.json())