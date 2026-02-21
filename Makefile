.PHONY: help dev build clean serve css css-watch pagefind

help:
	@echo "Available commands:"
	@echo "  make build      - Build the site"
	@echo "  make clean      - Remove built files"
	@echo "  make css        - Build Tailwind CSS"
	@echo "  make css-watch  - Watch and rebuild Tailwind CSS"
	@echo "  make dev        - Start development server with live reload"
	@echo "  make new-post   - Scafolds a new post"
	@echo "  make pagefind   - Builds search index"
	@echo "  make production - Builds website for production"
	@echo "  make serve      - Serve the built site"

css:
	tailwindcss -i ./assets/css/main.css -o ./public/css/main.css --minify

css-watch:
	@echo "Watching Tailwind CSS..."
	NODE_ENV=development tailwindcss -i ./assets/css/main.css -o ./public/css/main.css --watch

dev: 
	@trap 'kill 0' EXIT; \
	$(MAKE) build; \
	$(MAKE) serve

build: 
	$(MAKE) css; \
	hugo --cleanDestinationDir --gc --minify; \
	$(MAKE) pagefind

production: 
	$(MAKE) css; \
	hugo --cleanDestinationDir --gc --minify --baseURL "https://konkasidiaris.com"; \
	$(MAKE) pagefind

serve:
	hugo server --bind 0.0.0.0 --disableFastRender

clean:
	rm -rf public resources

new-post:
	@read -p "Enter post title: " title; \
	slug=$$(echo "$$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-\+/-/g' | sed 's/^-\|-$$//g'); \
	hugo new content "posts/$$slug/index.md"

pagefind:
	pagefind --site public