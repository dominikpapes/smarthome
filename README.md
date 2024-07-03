# Završni rad na temu "Razvoj kognitivnih usluga u prostoru Interneta stvar"

## Upute Win10/Win11

Pokretanje poslužiteljske aplikacije
- cd backend
- pyhton -m venv .venv
- .venv\Scripts\activate
- cd smarthome
- pip install django djangorestframework tensorflow pandas keras-tuner --upgrade
- python manage.py runserver
- python manage.py migrate #u slučaju pojave greške vezane uz migraciju

Pokretanje klijentske aplikacije (potrebno instalirati alat npm)
- cd frontend\smarthome
- npm i
- npm run dev

Pokretanje simulacije rada - sve sobe ažuriraju se s novim vremenima i temperaturama te se potom predvidaju stanja uređaja za to vrijeme i temperaturu
- cd backend\smarthome
- python auto.py -> pokretanje simulacijske skripte koja simulira promjene svakih 10 sekundi
- python auto.py single -> pokretanje simulacijske skripte koja simulira jednu promjenu

## Upute Linux

Pokretanje poslužiteljske aplikacije
- cd backend
- pyhton3 -m venv .venv
- source .venv/bin/activate
- cd smarthome
- pip install django djangorestframework tensorflow pandas keras-tuner --upgrade
- python3 manage.py runserver
- python3 manage.py migrate #u slučaju pojave greške vezane uz migraciju

Pokretanje klijentske aplikacije (potrebno instalirati alat npm)
- cd frontend/smarthome
- npm i
- npm run dev

Pokretanje simulacije rada - sve sobe ažuriraju se s novim vremenima i temperaturama te se potom predvidaju stanja uređaja za to vrijeme i temperaturu
- cd backend/smarthome
- python3 auto.py -> pokretanje simulacijske skripte koja simulira promjene svakih 10 sekundi
- python3 auto.py single -> pokretanje simulacijske skripte koja simulira jednu promjenu
