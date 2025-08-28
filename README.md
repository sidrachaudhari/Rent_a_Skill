# Rent-a-Skill Platform

A modern marketplace platform that connects people who need help with tasks to verified experts across different skill levels - from students to professionals.

## 🚀 Features

- **User Authentication** - Secure login/registration with Supabase
- **Task Management** - Post, browse, and manage tasks
- **Payment Integration** - Secure payments with Razorpay
- **Skill Matching** - Find experts based on skills and ratings
- **Real-time Communication** - Chat between seekers and providers
- **Dashboard** - Comprehensive user dashboard with analytics

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Razorpay
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account
- Razorpay account (for payments)

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd rent-a-skill-landing
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the SQL scripts in the `scripts/` folder:
   - `01-create-database.sql` - Creates all tables
   - `02-seed-data.sql` - Seeds initial data (optional)

### 5. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🗄️ Database Schema

The application uses the following main tables:

- **users** - User profiles and authentication
- **tasks** - Task postings and management
- **transactions** - Payment and transaction records
- **skills** - Available skills and categories
- **reviews** - User ratings and feedback
- **messages** - Real-time communication

## 🔐 Authentication

The app uses Supabase Auth for:
- Email/password authentication
- User session management
- Profile data storage

## 💳 Payment Integration

Razorpay integration provides:
- Secure payment processing
- Multiple payment methods (UPI, cards, net banking)
- Escrow protection
- Transaction verification

## 🎨 UI Components

Built with:
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

## 🔄 Development Mode

The application includes fallback mechanisms for development:
- Mock user profiles when database is not available
- Graceful error handling for missing environment variables
- Development-friendly error messages

## 📊 Analytics

The dashboard includes:
- User statistics
- Task analytics
- Revenue tracking
- Performance metrics

---

**Note**: Make sure to set up your Supabase and Razorpay accounts before running the application in production.

