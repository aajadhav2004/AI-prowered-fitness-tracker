install node=v22.12.0
install python=3.12.1

run node (backend):
(1)cd server
(2)npm install
(3)npm run dev

run React (frontend):
(1)cd client
(2)npm install
(3)npm start

run python (ml-model):
(1)cd ml-service
(2)python -m venv venv
(3)venv\Scripts\activate
(4)pip install -r requirements.txt
(5)uvicorn app:app --reload

#Admin credentials:
email:admin@fitness.com
password:admin123
