# GreenLeaf Plant Nursery — Final Project

A responsive customer-facing plant nursery shopping website built with **HTML, CSS, JavaScript, Node.js and Express**. Plant catalogue and order records are stored in JSON files on the server; the shopping cart and demo account are stored in the browser.

## Features
- Responsive home page, plant collection, care section and order history
- Plant catalogue with 10 sample plants, photos, prices, descriptions, sunlight and watering guidance
- Search by plant name, description or category; filter by category; sort by price/name
- Create account, sign in, sign out and client-side form validation
- Shopping cart with quantity increase/decrease, item removal and subtotal
- Checkout with name, email, 10-digit phone, city and address validation
- Place order, reduce available stock, generate order number and show confirmation
- View order history by signed-in email
- Express REST API for plant catalogue and order creation/retrieval
- Persistent server-side JSON data in `data/plants.json` and `data/orders.json`
- No MongoDB or external API key required

## Requirements
- Node.js 18 or newer
- npm
- Internet connection for Google Fonts and remote plant photos

## Run locally
1. Extract the ZIP.
2. Open the extracted `GreenLeaf-Nursery-Final` folder in VS Code.
3. Open a terminal in that folder.
4. Run `npm install`.
5. Run `npm start`.
6. Open **http://localhost:3000** in your browser.

Do not open `public/index.html` directly; use the local server so the API works.

## Main project structure
```text
GreenLeaf-Nursery-Final/
├── data/
│   ├── plants.json       # Plant catalogue and available stock
│   └── orders.json       # Placed order records
├── public/
│   ├── index.html        # Website structure and forms
│   ├── style.css         # Responsive styling
│   └── script.js         # Frontend logic, validation, cart and API calls
├── server.js             # Express server and REST API
├── package.json
├── .gitignore
└── README.md
```

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check server status |
| GET | `/api/plants` | List plants; optional `search` and `category` query parameters |
| GET | `/api/plants/:id` | Get one plant |
| POST | `/api/orders` | Validate and place an order; updates stock |
| GET | `/api/orders?email=user@example.com` | Get orders for an email |

## Testing checklist
1. Register a new account and try registering the same email again.
2. Sign out, then sign in with correct and incorrect credentials.
3. Search for a plant, filter by category and change sorting.
4. Add multiple plants to the cart; increase/decrease quantities and remove an item.
5. Try checkout with invalid phone/email/address, then submit valid details.
6. Confirm that the order number and total appear, cart empties, and stock decreases.
7. Visit **My orders** and confirm the order appears for the signed-in email.
8. Restart the server and confirm the plant stock and order record remain saved.

## Important limitations
- This is an academic demonstration, not a production e-commerce system.
- Demo account credentials are stored in browser `localStorage` as plain text. Do not use real/reused passwords. Production authentication requires server-side accounts, password hashing, secure sessions and authorization.
- Checkout records an order only; it does not process online payment, calculate delivery charges, or integrate a courier.
- JSON file storage is suitable for a small local demonstration, not concurrent production traffic. Deployments with ephemeral storage may reset JSON data; use MongoDB or another persistent database for a production deployment.
- Plant photos are loaded from Unsplash and need internet access.
