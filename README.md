# 👗 FashionWardrobe

**FashionWardrobe** is an AI-powered fashion recommendation web app that analyzes your outfit selections, detects style and color clashes, and suggests perfectly curated accessories — all in real time using Google Gemini AI.

---

## ✨ Features

- 🎯 **Personalized Style Quiz** — Select your gender, occasion, style personality, and budget through an intuitive multi-step flow
- 👔 **Outfit Builder** — Browse and pick items across categories: topwear, bottomwear, outerwear, footwear & accessories
- 🎨 **Color & Pattern Picker** — Assign colors and patterns to each outfit item using an interactive color picker
- 🤖 **AI Clash Detection** — Gemini AI analyzes your selections for item clashes (style conflicts) and color clashes
- 💡 **Dual-Scenario Advisor** — When clashes are found, the AI presents two optimized outfit paths (Scenario A & B) to fix the look
- 📊 **Match Score** — Get a real-time cohesion score for your complete outfit
- 💾 **Saved Looks** — Save your favorite AI-generated recommendations
- ❤️ **Wishlist** — Bookmark accessory items you want to buy later
- 🔐 **Google Auth** — Sign in with Google to persist your saved looks and wishlist

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vanilla HTML, JavaScript, Tailwind CSS (CDN) |
| Fonts | Google Fonts (Montserrat, Inter, Playfair Display) |
| Icons | Google Material Symbols |
| Color Picker | [Pickr](https://simonwep.github.io/pickr/) |
| AI Images | [Pollinations AI](https://pollinations.ai/) |
| Backend | Node.js + Express |
| AI Engine | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| Auth | Google Identity Services (GSI) |

---

## 📁 Project Structure

```
FashionWardrobe/
├── index.html              # Main app shell (SPA)
├── css/
│   └── app.css             # App-wide styles
├── js/
│   ├── app.js              # App entry point & initialization
│   ├── router.js           # Client-side SPA router
│   ├── store.js            # Global state management
│   ├── data/
│   │   └── mock-data.js    # Product catalog (clothing items)
│   ├── engine/
│   │   └── recommend.js    # AI recommendation engine (calls backend)
│   └── pages/
│       ├── landing.js      # Landing / hero page
│       ├── auth.js         # Google Sign-In page
│       ├── gender.js       # Step 1: Gender selection
│       ├── occasion.js     # Step 2: Occasion selection
│       ├── style.js        # Step 3: Style personality selection
│       ├── outfit.js       # Step 4: Outfit item selection
│       ├── color-budget.js # Step 5: Color picker & budget selection
│       ├── results.js      # Results page with AI recommendations
│       ├── saved.js        # Saved looks page
│       └── wishlist.js     # Wishlist page
└── server/
    ├── server.js           # Express backend + Gemini AI integration
    ├── package.json        # Backend dependencies
    └── .env                # 🔒 Environment variables (NOT committed)
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/darkcrownsumeet/FashionWardrobe.git
cd FashionWardrobe
```

### 2. Set up the backend

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server/` directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=4000
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### 4. Start the backend server

```bash
node server.js
```

The API will be available at `http://localhost:4000`.

### 5. Open the frontend

Simply open `index.html` in your browser, or serve it with any static file server:

```bash
# Using Python
python -m http.server 8080

# Using VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

---

## 🌐 API Endpoints

### `POST /api/recommend`

Analyzes the user's outfit and returns AI-powered recommendations.

**Request Body:**
```json
{
  "prefs": {
    "gender": "male",
    "occasions": ["casual"],
    "stylePersonality": ["streetwear", "minimalist"],
    "budget": "Mid-range",
    "itemColors": { "item-id": { "primary": "Navy", "secondary": "White", "pattern": "Solid" } }
  },
  "selectedItems": [
    { "id": "item-id", "name": "White Oversized Tee", "category": "topwear", "image": "..." }
  ]
}
```

**Response:**
```json
{
  "yourLook": [...],
  "clashes": [],
  "mode": "single",
  "matchScore": 92,
  "accessories": [...],
  "explanation": "...",
  "attributes": ["MID-RANGE Tier", "STREETWEAR Style", "CASUAL Ready"]
}
```

---

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `PORT` | Port for the backend server (default: `4000`) |

---

## 🙏 Acknowledgements

- [Google Gemini AI](https://deepmind.google/technologies/gemini/) for powering the fashion intelligence
- [Pollinations AI](https://pollinations.ai/) for AI-generated product imagery
- [Pickr](https://simonwep.github.io/pickr/) for the color picker component
- [Tailwind CSS](https://tailwindcss.com/) for rapid UI styling

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
