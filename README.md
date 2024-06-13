# Završni rad na temu "Razvoj kognitivnih usluga u prostoru Interneta stvar"

Kako pokrenuti poslužiteljsku aplikaciju (Win11/Win10):
- cd backend
- pyhton -m venv .venv
- .venv\Scripts\activate
- cd smarthome
- python -m pip install -r requirements.txt
- python manage.py runserver
- python manage.py migrate #u slučaju pojave greške vezane uz migraciju

Kako pokrenuti klijentsku aplikaciju (Win11/Win10; uz prethodno instaliran alat npm):
- cd frontend\smarthome
- npm i
- npm run dev
