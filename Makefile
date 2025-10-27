docker-test:
	@echo "⏳ Test container is running..."
	@docker compose -f docker-compose.test.yml up -d
	@echo "Running tests..."
	@sleep 5
	@set -o allexport; \
	. ./env/.env.test > /dev/null 2>&1; \
	export POSTGRES_URL=postgresql://test:test@localhost:5432/test?sslmode=disable; \
	npx vitest --max-concurrency=1 --no-cache $(TEST_ARGS)

docker-test-down:
	@docker compose -f docker-compose.test.yml down
	@echo "✅ Test container is down."

config-s3:
	@echo "Configuring local S3 bucket..."
	@aws --endpoint-url=http://localhost:4566 s3 mb s3://hirable-bucket
	@echo "✅ Local S3 bucket configured."

check-s3:
	@echo "Checking local S3 buckets..."
	@aws --endpoint-url=http://localhost:4566 s3 ls