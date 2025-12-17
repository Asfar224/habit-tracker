# Database Dockerfile
FROM postgres:15-alpine
# Copy initialization script
COPY init.sql /docker-entrypoint-initdb.d/
# Set environment variables
ENV POSTGRES_DB=habit_tracker
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres123
EXPOSE 5432
# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD pg_isready -U postgres || exit 1

