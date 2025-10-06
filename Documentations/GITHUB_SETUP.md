# Typeflow - GitHub Repository Setup Guide

## 🚀 Quick Setup

Follow these steps to set up your Typeflow GitHub repository.

---

## 1. Create GitHub Repository

### Option A: Via GitHub Website
1. Go to https://github.com/new
2. Repository name: `typeflow`
3. Description: `Open source markdown editor with AI assistance, live preview, and advanced features`
4. Choose: **Public** (for open source)
5. Add README: ✅ Yes
6. Add .gitignore: Node
7. Choose license: MIT (recommended) or Apache 2.0
8. Click "Create repository"

### Option B: Via GitHub CLI
```bash
gh repo create typeflow --public --description "Open source markdown editor with AI assistance" --license mit
```

---

## 2. Update Repository URL in Code

Replace `https://github.com/yourusername/typeflow` with your actual URL in:

### Files to Update:
1. **components/editor-header.tsx** (line ~20)
2. **app/landing/page.tsx** (footer sections)
3. **package.json** (repository field)

### Find and Replace:
```
Find: https://github.com/yourusername/typeflow
Replace: https://github.com/YOUR_ACTUAL_USERNAME/typeflow
```

---

## 3. Initialize Git (if not already done)

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Typeflow - Open source markdown editor"

# Add remote origin (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/typeflow.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 4. Create README.md for GitHub

Create a comprehensive README.md in your repository root:

```markdown
# Typeflow

> Open source markdown editor with AI assistance, live preview, and advanced features

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/typeflow.svg)](https://github.com/YOUR_USERNAME/typeflow/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/typeflow.svg)](https://github.com/YOUR_USERNAME/typeflow/issues)

## ✨ Features

- 📝 **Real-time Preview** - See your markdown rendered instantly
- 🤖 **AI Writing Assistant** - Improve, summarize, and transform text
- 📊 **Math Equations** - Beautiful LaTeX rendering with KaTeX
- 📈 **Mermaid Diagrams** - 10+ diagram types
- ☁️ **Word Cloud** - Analyze your writing patterns
- 💬 **Document Chat** - AI chatbot for your documents
- 📧 **Email Sharing** - Send documents via email
- 🎨 **Themes** - Light, dark, and system themes
- 💾 **Cloud Storage** - Supabase integration
- 🔒 **Authentication** - Secure user accounts

## 🚀 Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/typeflow.git

# Install dependencies
cd typeflow
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Documentation

- [Setup Guide](EMAIL_SETUP_QUICK_START.md)
- [Email Feature](README_EMAIL.md)
- [All Documentation](EMAIL_DOCS_INDEX.md)

## 🛠️ Tech Stack

- **Framework:** Next.js 13 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **AI:** Google Gemini
- **Email:** Nodemailer

## 📦 Installation

See [INSTALL_EMAIL_FEATURE.md](INSTALL_EMAIL_FEATURE.md) for detailed setup instructions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Markdown parsing with [marked](https://marked.js.org/)

## 📧 Contact

- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- Twitter: [@YOUR_TWITTER](https://twitter.com/YOUR_TWITTER)

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**Made with ❤️ by the Typeflow community**
```

---

## 5. Add GitHub Topics

Add relevant topics to your repository for better discoverability:

1. Go to your repository on GitHub
2. Click "About" (gear icon)
3. Add topics:
   - `markdown`
   - `markdown-editor`
   - `nextjs`
   - `typescript`
   - `ai`
   - `open-source`
   - `supabase`
   - `tailwindcss`
   - `editor`
   - `writing`

---

## 6. Set Up GitHub Pages (Optional)

If you want to host a demo:

1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / `docs` (or create `gh-pages`)
4. Save

---

## 7. Add Badges to README

Common badges to add:

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/typeflow.svg)](https://github.com/YOUR_USERNAME/typeflow/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/typeflow.svg)](https://github.com/YOUR_USERNAME/typeflow/network)
[![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/typeflow.svg)](https://github.com/YOUR_USERNAME/typeflow/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/YOUR_USERNAME/typeflow.svg)](https://github.com/YOUR_USERNAME/typeflow/pulls)
[![Next.js](https://img.shields.io/badge/Next.js-13-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
```

---

## 8. Create CONTRIBUTING.md

```markdown
# Contributing to Typeflow

Thank you for your interest in contributing to Typeflow!

## How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## Code Style

- Use TypeScript
- Follow existing code style
- Add comments for complex logic
- Update documentation

## Reporting Issues

- Use GitHub Issues
- Provide clear description
- Include steps to reproduce
- Add screenshots if applicable

## Feature Requests

We welcome feature requests! Please:
- Check existing issues first
- Describe the feature clearly
- Explain the use case
- Be open to discussion
```

---

## 9. Add LICENSE File

Choose a license (MIT recommended for open source):

```
MIT License

Copyright (c) 2024 Typeflow

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 10. Set Up GitHub Actions (Optional)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm ci
    - name: Build
      run: npm run build
    - name: Lint
      run: npm run lint
```

---

## 11. Create Social Preview

1. Go to Settings → Options
2. Scroll to "Social preview"
3. Upload an image (1280x640px recommended)
4. This appears when sharing on social media

---

## 12. Enable Discussions (Optional)

1. Go to Settings → Features
2. Enable "Discussions"
3. Great for community Q&A

---

## 13. Add Code of Conduct

Create `CODE_OF_CONDUCT.md`:

```markdown
# Code of Conduct

## Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

## Our Standards

- Be respectful
- Be collaborative
- Be constructive
- Be welcoming

## Enforcement

Report issues to: your-email@example.com
```

---

## ✅ Checklist

- [ ] Create GitHub repository
- [ ] Update repository URLs in code
- [ ] Push code to GitHub
- [ ] Add comprehensive README.md
- [ ] Add LICENSE file
- [ ] Add CONTRIBUTING.md
- [ ] Add CODE_OF_CONDUCT.md
- [ ] Add GitHub topics
- [ ] Add badges to README
- [ ] Set up GitHub Actions (optional)
- [ ] Enable Discussions (optional)
- [ ] Add social preview image
- [ ] Announce on social media

---

## 🎉 You're Done!

Your Typeflow repository is now set up and ready for the open source community!

**Next Steps:**
1. Share on social media
2. Submit to awesome lists
3. Write blog posts
4. Engage with contributors

---

**Happy Open Sourcing! 🚀**
