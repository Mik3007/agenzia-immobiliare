# 🏡 Agenzia Immobiliare Fullstack MERN

Progetto fullstack sviluppato con stack MERN per la gestione completa di un'agenzia immobiliare.

---

## 🚀 Tech Stack

### Frontend

* React + Vite
* Tailwind CSS
* Framer Motion
* React Router

### Backend

* Node.js + Express
* MongoDB (Mongoose)
* JWT Authentication

### Servizi

* Cloudinary → gestione immagini
* Vercel → deploy frontend
* Render → deploy backend

---

## 📦 Funzionalità

### 🏠 Pubbliche

* Home con Hero + ricerca
* Ricerca dinamica immobili
* Sezione risultati filtrati
* Slider immobili in evidenza
* Mappa con immobili geolocalizzati
* Pagina dettaglio immobile

  * gallery immagini
  * planimetrie
  * mappa
  * contatto diretto
* Sezione recensioni
* Sezione "Chi sono"
* Sezione valutazione immobile

### 🔐 Admin

* Login con JWT
* Dashboard immobili
* CRUD completo immobili
* Upload immagini (Cloudinary)
* Drag & drop immagini
* Gestione recensioni:

  * approvazione
  * rifiuto
  * eliminazione

---

## 🔍 API Principali

### Properties

* GET /api/properties
* GET /api/properties/:id
* GET /api/properties/latest
* POST /api/properties
* PATCH /api/properties/:id
* DELETE /api/properties/:id

### Reviews

* GET /api/reviews
* GET /api/reviews/admin
* PATCH /api/reviews/:id/approve
* PATCH /api/reviews/:id/reject
* DELETE /api/reviews/:id

### Auth

* POST /api/auth/login

### Contact

* POST /api/contact

---

## ⚙️ Setup Locale

### 1. Clona repo

```
git clone <repo-url>
cd agenzia-immobiliare
```

### 2. Backend

```
cd backend
npm install
```

Crea file `.env`:

```
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_secret
ADMIN_EMAIL=admin@email.com
ADMIN_PASSWORD=password
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLIENT_URL=http://localhost:5173
```

Avvia:

```
npm run dev
```

---

### 3. Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🌐 Deploy

### Frontend (Vercel)

* collega repo
* aggiungi variabili env se necessarie

### Backend (Render)

* crea Web Service
* aggiungi env variables
* collega MongoDB Atlas

---

## 🧠 Struttura progetto

### Backend

```
src/
 ├── controllers/
 ├── routes/
 ├── models/
 ├── middleware/
 ├── utils/
 └── config/
```

### Frontend

```
src/
 ├── components/
 ├── pages/
 ├── layouts/
 ├── api/
 ├── utils/
```

---

## 🧹 Best Practices implementate

* Codice modulare (controller/service separation)
* Protezione API con JWT
* Gestione errori centralizzata
* Upload immagini con cleanup
* UI responsive (mobile first)
* Commenti codice per manutenzione

---

## 📌 TODO (post deploy)

* Migliorie UI/UX (animazioni, spacing)
* Ottimizzazione mobile
* SEO base
* Eventuale sistema email free

---

## 👨‍💻 Autore

Michele Altieri

Fullstack MERN Developer

---

## 📄 Licenza

Progetto sviluppato per uso freelance / portfolio.
