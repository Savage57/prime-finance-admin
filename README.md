# MyPrime - Loan & Bill Payment Frontend

A modern, production-ready React + TypeScript frontend for a comprehensive financial services platform featuring loans, savings, transfers, and bill payments.

## 🚀 Features

### Core Functionality
- **Personal Loans**: Apply, track, and manage loan repayments with visual progress indicators
- **Savings Management**: High-yield savings with deposit/withdrawal capabilities
- **Money Transfers**: Internal and external transfers with idempotency protection
- **Bill Payments**: Pay utilities and subscriptions seamlessly
- **Transaction History**: Comprehensive tracking with requery functionality
- **Admin Dashboard**: Loan disbursement and transaction monitoring

### Technical Features
- **React 18+ with TypeScript**: Modern React with strict TypeScript configuration
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Dark/Light Mode**: Persistent theme toggle with system preference detection
- **Framer Motion**: Smooth animations and micro-interactions
- **React Query**: Optimized data fetching with caching and background updates
- **Responsive Design**: Mobile-first approach with tailored layouts
- **Accessibility**: WCAG compliant with proper ARIA semantics

## 🎨 Design System

### Colors
```typescript
Primary Brand: #16A34A (Green)
Light Theme: White background
Dark Theme: #071428 (Very dark blue)
Accent Colors: Teal (#00BFA6), Cyan (#00C6FF), Violet (#8A5FFF)
```

### Typography
- **Body Text**: 150% line height for optimal readability
- **Headings**: 120% line height with proper hierarchy
- **Maximum 3 font weights** used throughout the application

### Spacing
- **8px grid system** for consistent spacing
- **Responsive breakpoints**: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

### Environment Variables
Create a `.env` file in the project root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Optional: Analytics & Monitoring
VITE_GA_TRACKING_ID=your_google_analytics_id
VITE_SENTRY_DSN=your_sentry_dsn
```

## 🔗 API Integration

### Endpoints Used
All API calls are made to `VITE_API_BASE_URL` with the following endpoints:

#### Authentication
- `POST /api/users/login` - User login
- `GET /backoffice/profile` - User profile (requires JWT)

#### Loans
- `GET /backoffice/loans` - List user loans
- `POST /backoffice/loans/disburse` - Disburse loan (admin)
- `GET /backoffice/loans/stats` - Loan statistics

#### Savings
- `GET /backoffice/savings/:userId` - Get savings account
- `POST /backoffice/savings/deposit` - Deposit money
- `POST /backoffice/savings/withdraw` - Withdraw money

#### Transfers
- `POST /backoffice/transfers` - Create transfer
- `GET /backoffice/transfers/:id` - Get transfer details
- `POST /backoffice/transfers/:id/requery` - Requery transfer status

#### Transactions
- `GET /backoffice/transactions/:traceId` - Get transaction by trace ID
- `GET /backoffice/transactions/flagged` - Get flagged transactions (admin)

#### Dashboard
- `GET /backoffice/dashboard` - Dashboard statistics

### Idempotency Protection
All money-moving operations include an `Idempotency-Key` header to prevent duplicate processing:

```typescript
// Example usage
const idempotencyKey = crypto.randomUUID();
await postWithIdempotency('/backoffice/transfers', transferData, idempotencyKey);
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```
Tests cover:
- Core components (LoanCalculator, LoanCard, TransferModal)
- Utility functions (currency formatting, date handling)
- Custom hooks (useAuth, useLoans, useTransfers)

### E2E Tests
```bash
npm run test:e2e
```
E2E test coverage:
1. User login flow
2. Dashboard data loading
3. Internal transfer creation
4. Loan application process

### Accessibility Testing
```bash
npm run test:a11y
```
Runs axe-core accessibility checks on all major pages.

## 📁 Project Structure

```
src/
├── api/
│   ├── apiClient.ts          # Axios instance with interceptors
│   └── endpoints.ts          # Typed API endpoint functions
├── components/
│   ├── Button.tsx            # Primary button component
│   ├── LoanCalculator.tsx    # Interactive loan calculator
│   ├── LoanCard.tsx          # Loan display card
│   ├── TransferModal.tsx     # Multi-step transfer flow
│   ├── ThemeToggle.tsx       # Dark/light mode toggle
│   └── RingProgress.tsx      # Circular progress indicator
├── design/
│   └── tokens.ts             # Design system tokens
├── hooks/
│   ├── useAuth.ts            # Authentication management
│   ├── useLoans.ts           # Loan data fetching
│   ├── useTransfers.ts       # Transfer operations
│   ├── useSavings.ts         # Savings management
│   └── useTheme.ts           # Theme state management
├── pages/
│   ├── Home.tsx              # Marketing homepage
│   ├── Login.tsx             # Authentication page
│   └── Dashboard.tsx         # Main user dashboard
└── utils/
    ├── currency.ts           # Currency formatting utilities
    └── format.ts             # General formatting functions
```

## 🎯 Key Components

### LoanCalculator
Interactive loan calculator with:
- Animated number tweening (Framer Motion)
- Slider input with gradient track
- Quick-select amount chips
- Real-time payment calculations

### TransferModal
Multi-step transfer flow:
1. **Amount & Type Selection**
2. **Confirmation with Fee Display**
3. **Processing State**
4. **Success/Error Handling**

### Dashboard
Comprehensive financial overview:
- Wallet balance with gradient card
- Loan progress ring indicator
- Quick action buttons
- Recent transaction list

### Theme System
- Persistent dark/light mode toggle
- CSS custom properties for colors
- Tailwind dark: variants throughout
- Smooth theme transitions

## 🖼️ Assets & Illustrations

### Placeholder Images
The following placeholder images are included with recommended replacements:

1. **loan-hero.svg** (1200×800) - Hero section illustration
   - Replacement: [Undraw.co](https://undraw.co) financial illustrations
   - Alt text: "Person reviewing loan documents with calculator and charts"

2. **loan-illus-1.svg** (800×600) - Loan approval process
   - Replacement: [Storyset](https://storyset.com) business illustrations
   - Alt text: "Digital loan approval process visualization"

3. **loan-photo-1.jpg** (600×400) - Happy customer with phone
   - Replacement: [Pexels](https://pexels.com) search "happy person phone banking"
   - Alt text: "Smiling person using mobile banking app"

4. **loan-photo-2.jpg** (600×400) - Business owner counting money
   - Replacement: [Unsplash](https://unsplash.com) search "small business owner money"
   - Alt text: "Small business owner managing finances"

### Icon Usage
- **Lucide React** for all interface icons
- **Custom logo** using brand gradient
- **Status indicators** with appropriate colors

## 🎨 Animation Details

### Micro-interactions
- **Button Hover**: Scale 1.02, glow effect, 150ms ease-out
- **Card Hover**: Subtle lift with shadow increase
- **Number Animation**: Spring-based tweening for loan amounts
- **Page Transitions**: Fade + slide-up, 200ms duration

### Loading States
- **Skeleton Loaders**: Shimmer effect for content areas
- **Progress Indicators**: Ring progress for loans
- **Button Loading**: Spinner with disabled state

## 🔒 Security Features

- **JWT Token Management**: Automatic refresh with 401 handling
- **Input Validation**: TypeScript types with runtime validation
- **CSRF Protection**: SameSite cookie configuration
- **Content Security Policy**: Strict CSP headers recommended

## 📱 Progressive Web App

The application includes PWA capabilities:
- **Service Worker**: Caching strategy for offline functionality
- **Web Manifest**: App-like experience on mobile devices
- **Push Notifications**: Transaction status updates (optional)

## 🚀 Deployment

### Build Process
```bash
npm run build
```
Generates optimized production build in `dist/` directory.

### Environment-Specific Builds
- **Development**: Hot reloading, source maps, debug tools
- **Staging**: Production build with additional logging
- **Production**: Optimized bundle, no debug tools

### Recommended Hosting
- **Netlify**: Automatic deployment from Git
- **Vercel**: Edge deployment with serverless functions
- **AWS S3 + CloudFront**: Scalable static hosting

## 🔧 Configuration Files

### Tailwind CSS Configuration
Custom design tokens and utilities defined in `tailwind.config.js`:
- Brand color system with 10 shade variations
- Dark mode class strategy
- Custom border radius and shadows
- Animation utilities

### TypeScript Configuration
Strict TypeScript setup with:
- Path mapping for clean imports
- Strict null checks
- No implicit any
- Unused variable detection

### Vite Configuration
Optimized build configuration:
- Code splitting by route
- Asset optimization
- Development server with HMR
- Build analysis tools

## 📈 Performance Optimizations

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Built-in bundle size monitoring
- **Caching Strategy**: Aggressive caching for static assets
- **React Query**: Optimistic updates and background refetching

## 🤝 Contributing

### Development Workflow
1. **Create Feature Branch**: `git checkout -b feature/loan-calculator-improvements`
2. **Implement Changes**: Follow existing patterns and conventions
3. **Add Tests**: Unit tests for new functionality
4. **Update Documentation**: README and code comments
5. **Submit PR**: Include description and manual QA checklist

### Code Standards
- **ESLint + Prettier**: Automated formatting and linting
- **Conventional Commits**: Structured commit messages
- **TypeScript**: Strict typing for all new code
- **Test Coverage**: >80% coverage for new features

## 📞 Support

For technical support or questions:
- **Documentation**: Check this README and code comments
- **Issues**: Create GitHub issue with reproduction steps
- **Email**: dev-support@myprime.com

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Demo Credentials:**
- Email: demo@myprime.com
- Password: demo123

**Live Demo:** [https://myprime-demo.netlify.app](https://myprime-demo.netlify.app)