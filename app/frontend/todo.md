# Anonimax.com - Plateforme de Messagerie Anonyme

## Design Guidelines

### Design References (Primary Inspiration)
- **Session.org**: Dark theme, privacy-focused, clean UI
- **ProtonMail.com**: Security-oriented design, professional
- **Style**: Cyberpunk Dark Mode + Privacy-First + Modern Minimalism

### Color Palette
- Primary Background: #0A0A0F (Deep Black)
- Secondary Background: #12121A (Dark Purple-Black)
- Card Background: #1A1A25 (Charcoal Purple)
- Accent Primary: #00D9FF (Cyan Neon)
- Accent Secondary: #8B5CF6 (Purple)
- Accent Tertiary: #10B981 (Emerald Green for crypto)
- Text Primary: #FFFFFF (White)
- Text Secondary: #94A3B8 (Slate Gray)
- Border: #2D2D3A (Dark Border)
- Success: #10B981 (Green)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Red)

### Typography
- Font Family: Inter (Google Fonts)
- Heading1: font-weight 800 (48px) - Hero titles
- Heading2: font-weight 700 (36px) - Section titles
- Heading3: font-weight 600 (24px) - Card titles
- Body: font-weight 400 (16px) - Regular text
- Small: font-weight 400 (14px) - Secondary text
- Mono: JetBrains Mono - For IDs and crypto addresses

### Key Component Styles
- **Buttons**: Gradient cyan-purple, rounded-lg, hover glow effect
- **Cards**: Dark background with subtle border, rounded-xl, hover lift
- **Inputs**: Dark background, cyan border on focus, rounded-lg
- **Badges**: Semi-transparent with colored border
- **Anonimax ID Display**: Mono font, cyan color, copy button

### Layout & Spacing
- Hero section: Full viewport with animated gradient background
- Content max-width: 1280px
- Section padding: 80px vertical
- Card gaps: 24px
- Border radius: 12px (cards), 8px (buttons/inputs)

### Images to Generate
1. **hero-anonymous-network.jpg** - Abstract dark network visualization with glowing nodes and connections, cyber aesthetic, purple and cyan colors
2. **feature-privacy-shield.jpg** - Digital shield icon with lock symbol, dark background, neon glow effect
3. **feature-crypto-payment.jpg** - Cryptocurrency symbols (BTC, ETH, XMR) floating in dark space with holographic effect
4. **feature-session-messenger.jpg** - Abstract messaging bubbles with encryption symbols, dark cyber theme

---

## Development Tasks

### 1. Setup & Configuration
- [x] Backend tables created (profiles, listings, categories)
- [x] Categories data inserted
- [ ] Generate hero and feature images
- [ ] Update index.html title and meta

### 2. Core Pages
- [ ] Landing Page (/) - Hero, features, stats, CTA
- [ ] Auth Callback (/auth/callback) - Handle login redirect
- [ ] Dashboard (/dashboard) - User profile management
- [ ] Search (/search) - Search users by Anonimax ID
- [ ] Listings (/listings) - Browse all listings with filters
- [ ] Create Listing (/listings/new) - Create new service listing
- [ ] Listing Detail (/listings/:id) - View listing details

### 3. Components
- [ ] Header - Navigation with auth state
- [ ] Footer - Links and info
- [ ] ProfileCard - Display user profile info
- [ ] ListingCard - Display listing preview
- [ ] SearchFilters - City, category, keywords filters
- [ ] AnonymaxIdDisplay - Styled ID with copy button
- [ ] CryptoAddressDisplay - Wallet address display

### 4. Features
- [ ] User registration with auto-generated Anonimax ID
- [ ] Profile creation/editing
- [ ] Listing CRUD operations
- [ ] Search with filters
- [ ] Session ID contact integration