# Developer Blog

A modern software developer blog built with Hugo, Tailwind CSS, Make, and Go.

## Technologies

- **Hugo** - Fast static site generator
- **Tailwind CSS** - Utility-first CSS framework (standalone CLI)
- **Make** - Build automation
- **Go** - Utility scripts

## Quick Start

### Prerequisites

- Docker (everything else will be installed while building the devcontainer)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/konkasidiaris/konkasidiaris.github.io.git
cd konkasidiaris.github.io
```

1. Check dependencies:

```txt
>Dev Containers: Build Container
```

### Development

Start the development server:

```bash
make dev
```

This will:

- Build Tailwind CSS
- Start Hugo server with live reload
- Watch for changes

Visit `http://localhost:1313` to view your blog.

### Building for Production

Build the site:

```bash
make build
```

The built site will be in the `public/` directory.

## Creating Content

### New Blog Post

Use the Go utility script:

```bash
make new-post
```

Or manually:

```bash
go run scripts/newpost.go "Your Post Title"
```

This creates a new post in `content/posts/` with proper frontmatter.

### Edit Content

Posts are in `content/posts/` in Markdown format.

Set `draft: false` in the frontmatter when ready to publish.

## Available Commands

```bash
make help        # Show all available commands
make install     # Check dependencies
make dev         # Development server
make build       # Production build
make css         # Build Tailwind CSS
make css-watch   # Watch Tailwind CSS
make clean       # Remove build artifacts
make deploy      # Deploy to GitHub Pages
make new-post    # Create new blog post
```

## Project Structure

```txt
.
├── archetypes/       # Content templates
├── assets/
│   └── css/         # Tailwind source files
├── content/
│   ├── posts/       # Blog posts
│   └── about.md     # About page
├── layouts/
│   ├── _default/    # Default templates
│   ├── partials/    # Reusable components
│   └── index.html   # Homepage
├── scripts/         # Go utility scripts
├── static/          # Static assets
├── hugo.toml        # Hugo configuration
├── tailwind.config.js  # Tailwind configuration
└── Makefile         # Build automation
```

## Customization

### Site Configuration

Edit `hugo.toml` to customize:

- Site title and description
- Author information
- Social media links
- Menu items

### Styling

Modify `tailwind.config.js` to customize:

- Colors
- Typography
- Spacing
- Other design tokens

Edit `assets/css/main.css` for custom styles.

### Layouts

Templates are in `layouts/`:

- `_default/baseof.html` - Base template
- `index.html` - Homepage
- `_default/single.html` - Single post
- `_default/list.html` - Post list
- `partials/` - Header, footer, etc.

## Deployment

### GitHub Pages

Deploy with:

```bash
make deploy
```

Or set up GitHub Actions for automatic deployment.

### Other Platforms

The `public/` directory can be deployed to:

- Any static hosting service

## License

MIT License - feel free to use this for your own blog!

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.
