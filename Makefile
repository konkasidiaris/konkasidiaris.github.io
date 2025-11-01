.PHONY: help dev build clean serve css css-watch

help:
	@echo "Available commands:"
	@echo "  make dev        - Start development server with live reload"
	@echo "  make build      - Build the site for production"
	@echo "  make css        - Build Tailwind CSS"
	@echo "  make css-watch  - Watch and rebuild Tailwind CSS"
	@echo "  make serve      - Serve the built site"
	@echo "  make clean      - Remove built files"

css:
	tailwindcss -i ./assets/css/main.css -o ./public/css/main.css --minify

css-watch:
	@echo "Watching Tailwind CSS..."
	tailwindcss -i ./assets/css/main.css -o ./public/css/main.css --watch

dev: css
	@trap 'kill 0' EXIT; \
	$(MAKE) css-watch & \
	$(MAKE) serve

build: css
	hugo --minify

serve:
	hugo server --bind 0.0.0.0 --disableFastRender

clean:
	rm -rf public resources

new-post:
	@read -p "Enter post title: " title; \
	hugo new content "posts/$$title/index.md"
