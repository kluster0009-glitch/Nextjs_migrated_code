<div align="center">

# 🌐 KLUSTER

### *Campus Social Network Platform*

*A cutting-edge, cyberpunk-themed social networking platform designed exclusively for college communities*

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[Features](#-features) • [Quick Start](#-installation) • [Documentation](#-project-structure) • [Contributing](#-contributing)

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="700">

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 Core Functionality

```typescript
✓ User Authentication & Authorization
✓ Customizable User Profiles
✓ Social Feed (Cluster)
✓ Real-time Direct Messaging
✓ Campus Events Management
✓ Push Notifications
✓ Q&A Community Forum
✓ Resource Library
✓ Leaderboard System
✓ Professor Directory
```

</td>
<td width="50%">

### 💎 User Experience

```typescript
✓ Cyberpunk UI/UX Design
✓ Fully Responsive Layout
✓ Dark/Light Theme Toggle
✓ Smooth Page Transitions
✓ Modern Component Library
✓ Real-time Updates
✓ Image Upload & Preview
✓ Advanced Search & Filters
✓ Infinite Scroll Loading
✓ Optimized Performance
```

</td>
</tr>
</table>

<details>
<summary><b>🔥 Feature Highlights</b></summary>

#### Social Networking
- 📱 **Dynamic Feed** - Share posts with images, interact through likes and comments
- 💬 **Real-time Chat** - Instant messaging with conversation history and unread indicators
- 👥 **Profile Management** - Customizable avatars, banners, and bio information
- 🔔 **Smart Notifications** - Stay updated with all platform activities

#### Campus Integration
- 📅 **Event Calendar** - Create, discover, and RSVP to campus events
- 📚 **Resource Sharing** - Library for academic materials and resources
- 👨‍🏫 **Faculty Connect** - Direct access to professor profiles and information
- 🏆 **Engagement Tracking** - Leaderboards showcasing top contributors

#### Technical Excellence
- ⚡ **Blazing Fast** - Server-side rendering with Next.js 16
- 🔐 **Secure** - Enterprise-grade authentication and data protection
- 📊 **Scalable** - Built on Supabase PostgreSQL infrastructure
- 🎨 **Beautiful** - Cyberpunk-themed UI with smooth animations

</details>

## 🛠️ Tech Stack

<div align="center">

### Frontend Architecture

| Technology | Version | Purpose |
|:-----------|:-------:|:--------|
| ![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js) | `16.0` | React Framework & App Router |
| ![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react) | `19.2` | UI Library |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript) | `5.9` | Type Safety |
| ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css) | `3.4` | Utility-First CSS |
| ![Framer](https://img.shields.io/badge/Framer_Motion-12.x-0055FF?style=flat-square&logo=framer) | `12.x` | Animations |
| ![Radix UI](https://img.shields.io/badge/Radix_UI-Latest-161618?style=flat-square) | `latest` | Headless Components |
| ![React Query](https://img.shields.io/badge/React_Query-5.x-FF4154?style=flat-square) | `5.x` | Server State Management |
| ![Zustand](https://img.shields.io/badge/Zustand-5.0-443E38?style=flat-square) | `5.0` | Client State Management |

### Backend Infrastructure

| Service | Technology | Purpose |
|:--------|:-----------|:--------|
| 🗄️ **Database** | Supabase PostgreSQL | Relational Database |
| 🔐 **Auth** | Supabase Auth | User Authentication |
| 📦 **Storage** | Supabase Storage | File & Image Storage |
| ⚡ **Real-time** | Supabase Realtime | Live Data Sync |
| 🔗 **API** | Supabase REST API | Backend Communication |

### Development Tools

```bash
📝 Language          TypeScript, JavaScript
📦 Package Manager   npm
🔍 Linting           ESLint
🎨 Code Format       Prettier
🧪 Validation        Zod
📋 Forms             React Hook Form
```

</div>

## 📦 Installation

<details open>
<summary><b>⚡ Quick Start Guide</b></summary>

### Prerequisites

Before you begin, ensure you have the following installed:

- ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white) **Node.js 18+**
- ![npm](https://img.shields.io/badge/npm-10+-CB3837?style=flat-square&logo=npm&logoColor=white) **npm** or **yarn**
- 🔑 **Supabase Account** ([Free Tier Available](https://supabase.com))

---

### 🚀 Setup Steps

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/kluster0009-glitch/Nextjs_migrated_code.git
cd Nextjs_migrated_code
```

#### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install
```

#### 3️⃣ Environment Configuration

Create a `.env.local` file in the project root:

```env
# 🔐 Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# 🌐 Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> 💡 **Tip:** Get your Supabase credentials from your [project settings](https://app.supabase.com)

#### 4️⃣ Database Setup

In your Supabase SQL Editor, run migrations to create:

- ✅ User profiles table
- ✅ Posts & comments tables
- ✅ Messages & conversations tables
- ✅ Events & notifications tables
- ✅ Row Level Security (RLS) policies
- ✅ Storage buckets for images

#### 5️⃣ Launch Development Server

```bash
npm run dev
```

🎉 **Success!** Open [http://localhost:3000](http://localhost:3000) in your browser

</details>

<details>
<summary><b>🐳 Docker Setup (Optional)</b></summary>

```bash
# Build the image
docker build -t kluster-app .

# Run the container
docker run -p 3000:3000 kluster-app
```

</details>

## 🚀 Deployment

<div align="center">

### Deploy to Production

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kluster0009-glitch/Nextjs_migrated_code)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/kluster0009-glitch/Nextjs_migrated_code)

</div>

<details>
<summary><b>📡 Vercel Deployment (Recommended)</b></summary>

**Why Vercel?**
- ✅ Built by Next.js creators
- ✅ Zero configuration needed
- ✅ Automatic HTTPS & CDN
- ✅ Instant rollbacks
- ✅ Edge network deployment

**Steps:**

1. Push your code to GitHub
2. Visit [Vercel Dashboard](https://vercel.com/new)
3. Import your repository
4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   NEXT_PUBLIC_SITE_URL
   ```
5. Click **Deploy** 🚀

**Build Commands:**
```bash
npm run build    # Production build
npm start        # Start production server
```

</details>

<details>
<summary><b>🌐 Alternative Platforms</b></summary>

KLUSTER supports deployment on any Next.js-compatible platform:

| Platform | Difficulty | Features |
|:---------|:-----------|:---------|
| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel) | ⭐ Easy | Auto-deploy, Analytics |
| ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify) | ⭐ Easy | Form handling, Split testing |
| ![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=flat-square&logo=railway) | ⭐⭐ Medium | Database hosting, Docker |
| ![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazon-aws) | ⭐⭐⭐ Advanced | Full control, Scaling |
| ![DigitalOcean](https://img.shields.io/badge/DigitalOcean-0080FF?style=flat-square&logo=digitalocean) | ⭐⭐ Medium | App Platform, Droplets |

</details>

## 📁 Project Structure

```
Nextjs_migrated_code/
├── public/                 # Static files (images, icons)
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (protected)/  # Protected routes (requires auth)
│   │   │   ├── chat/     # Direct messaging
│   │   │   ├── cluster/  # Social feed
│   │   │   ├── events/   # Events page
│   │   │   ├── library/  # Resource library
│   │   │   ├── profile/  # User profiles
│   │   │   └── ...
│   │   ├── auth/         # Authentication pages
│   │   ├── login/        # Login page
│   │   ├── signup/       # Signup page
│   │   └── layout.js     # Root layout
│   ├── components/        # React components
│   │   ├── ui/           # UI components (shadcn/ui)
│   │   ├── landing/      # Landing page components
│   │   └── ...
│   ├── contexts/          # React contexts (Auth, Profile)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions & configs
│   │   └── supabase/    # Supabase client setup
│   └── styles/           # Global styles
├── components.json        # shadcn/ui configuration
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Dependencies
```

## 🎨 Key Components

### Authentication
- Email/password authentication
- Email verification required
- Forgot password functionality
- Protected routes with middleware

### Chat System
- Real-time direct messaging
- Conversation list with unread indicators
- Message history
- User avatars and status
- Horizontal scrolling tabs for conversation filters

### Social Feed (Cluster)
- Create posts with text and images
- Like, comment, and save posts
- Category filtering
- Real-time updates
- Post analytics

### Profile Management
- Customizable profile with avatar and banner
- Bio, college, and department information
- Activity tracking (posts, likes, comments)
- Follow/follower system
- Statistics dashboard

## 🔐 Environment Variables

Required environment variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `NEXT_PUBLIC_SITE_URL` | Your site URL (for redirects) |

## 🤝 Contributing

We love contributions! Help us make KLUSTER better 🚀

<details>
<summary><b>💡 How to Contribute</b></summary>

### Step-by-Step Guide

1. **Fork the Repository**
   ```bash
   # Click the 'Fork' button at the top right of this page
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Nextjs_migrated_code.git
   cd Nextjs_migrated_code
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments where necessary
   - Test your changes thoroughly

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m '✨ Add amazing feature'
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click 'New Pull Request'
   - Select your branch
   - Describe your changes in detail

### 📋 Contribution Guidelines

- ✅ Write clear commit messages
- ✅ Update documentation if needed
- ✅ Follow code style conventions
- ✅ Test before submitting
- ✅ One feature per pull request

</details>

---

## 📄 License

<div align="center">

This project is licensed under the **MIT License**

See [LICENSE](LICENSE) file for details

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## 👥 Team

<div align="center">

### Built with 💜 by KLUSTER Team

[![GitHub](https://img.shields.io/badge/GitHub-@kluster0009--glitch-181717?style=for-the-badge&logo=github)](https://github.com/kluster0009-glitch)

**Core Contributors**
- Lead Developer: [@kluster0009-glitch](https://github.com/kluster0009-glitch)

</div>

---

## 🙏 Acknowledgments

<div align="center">

Built with amazing open-source technologies

| Technology | Purpose |
|:-----------|:--------|
| [Next.js](https://nextjs.org/) | React Framework |
| [Supabase](https://supabase.com/) | Backend Infrastructure |
| [Tailwind CSS](https://tailwindcss.com/) | Styling Framework |
| [Radix UI](https://www.radix-ui.com/) | Accessible Components |
| [shadcn/ui](https://ui.shadcn.com/) | Beautiful Components |
| [Framer Motion](https://www.framer.com/motion/) | Animation Library |
| [Lucide Icons](https://lucide.dev/) | Icon Library |

</div>

---

## 📞 Support & Community

<div align="center">

### Need Help?

[![Email](https://img.shields.io/badge/Email-kluster0009@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:kluster0009@gmail.com)
[![Issues](https://img.shields.io/badge/Issues-Report_Bug-red?style=for-the-badge&logo=github)](https://github.com/kluster0009-glitch/Nextjs_migrated_code/issues)
[![Discussions](https://img.shields.io/badge/Discussions-Ask_Question-blue?style=for-the-badge&logo=github)](https://github.com/kluster0009-glitch/Nextjs_migrated_code/discussions)

</div>

---

## 🔗 Useful Links

<div align="center">

| Resource | Link |
|:---------|:-----|
| 📚 **Documentation** | [View Docs](https://github.com/kluster0009-glitch/Nextjs_migrated_code/wiki) |
| 🐛 **Report Bug** | [Create Issue](https://github.com/kluster0009-glitch/Nextjs_migrated_code/issues/new) |
| 💡 **Request Feature** | [Submit Request](https://github.com/kluster0009-glitch/Nextjs_migrated_code/issues/new) |
| 📖 **Changelog** | [View Changes](https://github.com/kluster0009-glitch/Nextjs_migrated_code/releases) |
| ⭐ **Star this Repo** | [Give a Star](https://github.com/kluster0009-glitch/Nextjs_migrated_code) |

</div>

---

<div align="center">

### ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=kluster0009-glitch/Nextjs_migrated_code&type=Date)](https://star-history.com/#kluster0009-glitch/Nextjs_migrated_code&Date)

---

**If you found this project helpful, please consider giving it a ⭐!**

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="700">

### Made with 💜 by the KLUSTER Team

*Connecting Campuses, Building Communities*

</div>
