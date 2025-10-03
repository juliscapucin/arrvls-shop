# ARRVLS Shop

A modern headless commerce storefront built with Shopify Hydrogen, featuring a custom component library with GSAP animations and Tailwind CSS styling.

## Tech Stack

- **Framework**: [Shopify Hydrogen](https://shopify.dev/custom-storefronts/hydrogen) with React Router 7
- **Runtime**: [Oxygen](https://shopify.dev/custom-storefronts/oxygen) (Shopify's edge runtime)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design tokens
- **Animations**: [GSAP](https://gsap.com/) for smooth interactions
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Type Safety**: TypeScript with GraphQL code generation
- **Linting**: ESLint + Prettier
- **Font**: Custom PPAcma font with Inter fallback

## Features

- 🛍️ **Shopify Integration**: Products, collections, cart, and customer accounts
- 🎨 **Custom Design System**: Tailwind-based component library with branded styling
- ✨ **Smooth Animations**: GSAP-powered interactions and transitions
- 📱 **Responsive Design**: Mobile-first approach with desktop enhancements
- 🔐 **Customer Authentication**: Secure login and account management
- 🛒 **Shopping Cart**: Persistent cart with session management
- 🔍 **Search & Filtering**: Product discovery with predictive search
- 📄 **Content Management**: Blog posts, pages, and policies
- 🚀 **Edge Performance**: Deployed on Shopify's global CDN

## Project Structure

```
app/
├── components/          # Reusable UI components
├── routes/             # Page routes and API endpoints
├── lib/                # Utilities and configurations
├── styles/             # Global CSS and Tailwind config
├── data/               # Static data and constants
└── graphql/            # GraphQL queries and fragments
```

## Getting Started

**Requirements:**

- Node.js version 20.0.0 or higher
- Access to a Shopify store with Hydrogen app installed

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd arrvls-shop

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Shopify store credentials to .env
```

### Environment Setup

```bash
# Link to your Shopify store (requires proper permissions)
npx shopify hydrogen link

# Pull environment variables from Shopify
npx shopify hydrogen env pull
```

### Development

```bash
# Start development server with type generation
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## Design System

### Color Palette

- **Primary**: Dark theme with light accents
- **Secondary**: High contrast text and borders
- **Accents**: Branded purple and orange highlights

### Typography

- **Primary Font**: PPAcma (custom brand font)
- **Secondary Font**: Inter (web-safe fallback)
- **Type Scale**: Responsive sizing from label to display

### Components

- Responsive layout with mobile-first approach
- Custom buttons, forms, and navigation
- Animated product cards and interactions
- Accessible modals and overlays

## Customer Account Setup

For customer authentication to work properly:

1. **Configure Public Domain**: Set up ngrok or similar for local development
2. **Environment Variables**: Ensure `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID` and related vars are set
3. **Shopify Settings**: Enable Customer Account API in your Shopify store

Refer to [Shopify's Customer Account API docs](https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen) for detailed setup.

## Development Commands

```bash
npm run dev          # Start dev server with type generation
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Run TypeScript checks
npm run lint         # Lint code with ESLint
npm run codegen      # Generate GraphQL types
```

## GraphQL & Types

The project uses automatic GraphQL code generation:

- **Storefront API**: Product data, collections, cart operations
- **Customer Account API**: Authentication and account management
- **Type Safety**: Fully typed GraphQL operations with auto-completion

## Deployment

This project is designed to deploy on Shopify's Oxygen platform:

```bash
# Deploy to Oxygen (requires Shopify CLI authentication)
npx shopify hydrogen deploy
```

## Learn More

- [Hydrogen Documentation](https://shopify.dev/custom-storefronts/hydrogen)
- [React Router 7 Guide](https://reactrouter.com/en/main)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [GSAP Documentation](https://gsap.com/docs/)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)

---

**ARRVLS** - Modern commerce, beautifully crafted.
