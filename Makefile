.PHONY: build_prod

build_prod:
	@yarn
	@rm -rf build/
	@yarn build-prod
	@./scripts/build_frontend.sh

deploy:
	@docker build -t ashwinath/poe-search-bot $* .
	@docker tag ashwinath/poe-search-bot ashwinath/poe-search-bot:latest
	@docker push ashwinath/poe-search-bot:latest
	@./scripts/deploy.sh
