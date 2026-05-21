# ASAP Admin Panel - Items Management

A React-based admin interface for managing items in the ASAP backend system.

## Features

- **List Items**: View all items with search and filter capabilities
- **Create Items**: Add new items with code, name, category, and stock info
- **Edit Items**: Update existing item details
- **Delete Items**: Remove items from the system
- **Real-time Search**: Filter items by name, code, or category

## Setup

### Prerequisites
- Node.js 14+ and npm

### Installation

1. Install dependencies:
```bash
cd admin
npm install
```

2. Start the development server:
```bash
npm run dev
```

The admin panel will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## Configuration

The admin panel connects to the backend API via a proxy configured in `vite.config.js`. Make sure your backend is running on `http://localhost:3001` or update the proxy target accordingly.

## API Endpoints Used

- `GET /api/admin/items` - List all items
- `GET /api/admin/items/{id}` - Get item details
- `POST /api/admin/items` - Create/Update item
- `DELETE /api/admin/items/{id}` - Delete item
- `GET /api/admin/categories` - List categories (optional)

## Project Structure

```
admin/
├── src/
│   ├── components/
│   │   ├── ItemsList.jsx      # Items list and search
│   │   └── ItemForm.jsx       # Item creation/edit form
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── vite.config.js            # Vite configuration
└── package.json              # Dependencies
```

## Features Roadmap

- [ ] Price Levels management
- [ ] Zone management
- [ ] Stock management
- [ ] Batch operations
- [ ] Export to CSV
- [ ] User authentication
