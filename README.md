# ClubShare Frontend

ClubShare is a comprehensive club management platform that allows users to discover, join, and manage clubs and events. The platform connects club members, managers, and administrators through an intuitive interface.

## Features

- **Multi-role Authentication**: User, Club Manager, and Admin roles with distinct permissions
- **Club Discovery**: Browse and join available clubs
- **Event Management**: Create, manage, and participate in events
- **Dashboard**: Role-based dashboards for different user types
- **Profile Management**: Personal and club profiles
- **Real-time Updates**: Powered by React Query for efficient data handling
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Tech Stack

- **Frontend**: React.js, Vite
- **Styling**: Tailwind CSS, DaisyUI
- **State Management**: React Context API, React Query
- **Routing**: React Router v6
- **UI Components**: React Icons, DaisyUI
- **Notifications**: React Toastify
- **Maps**: React Leaflet (for contact page)

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd clubsphare-a11
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_auth_domain
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_storage_bucket
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id
```

4. Start the development server
```bash
npm run dev
```

## Environment Variables

- `VITE_API_URL`: Backend API URL
- `VITE_FIREBASE_API_KEY`: Firebase API key
- `VITE_AUTH_DOMAIN`: Firebase auth domain
- `VITE_PROJECT_ID`: Firebase project ID
- `VITE_STORAGE_BUCKET`: Firebase storage bucket
- `VITE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `VITE_APP_ID`: Firebase app ID

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Lint code

## Project Structure

```
src/
├── Components/          # React components
│   ├── Common/          # Shared components (Navbar, Footer, etc.)
│   ├── Dashboard/       # Role-based dashboards
│   ├── HomePage/        # Home page components
│   └── LoginRegister/   # Authentication components
├── Contexts/            # React context providers
├── Layout/              # Layout components
├── Services/            # API services
└── Utils/               # Utility functions
```

## API Endpoints

The frontend communicates with the backend API for various operations including authentication, club management, and event handling.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License