# Root Dockerfile (deployment-ready) for hosts that REQUIRE ./Dockerfile at repo root.
# Builds React frontend, runs FastAPI backend, and serves everything via Nginx in ONE container.
#
# Works on platforms like "Deploy from Dockerfile" UIs.
# For a VPS, you can still use docker compose (see docker-compose.yml).
#
# Default DB: SQLite (DATABASE_URL=sqlite:///./pfc.db) unless overridden.

########## Frontend build ##########
FROM node:20-alpine AS frontend_build
WORKDIR /app
COPY frontend/package.json ./frontend/package.json
COPY frontend/package-lock.json* ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend
RUN cd frontend && npm run build
RUN mkdir -p /out && cp -r frontend/dist /out/dist

########## Backend build ##########
FROM python:3.11-slim AS backend_build
WORKDIR /app
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY backend/app ./backend/app
RUN mkdir -p /out/app && cp -r backend/app /out/app

########## Runtime ##########
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx supervisor ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

# Copy installed python deps
COPY --from=backend_build /usr/local /usr/local

# Copy backend app
WORKDIR /app
COPY --from=backend_build /out/app ./app

# Copy built frontend
COPY --from=frontend_build /out/dist /usr/share/nginx/html

# Nginx: SPA + proxy to backend
RUN rm -f /etc/nginx/sites-enabled/default /etc/nginx/conf.d/default.conf || true
RUN printf '%s\n' \
'server {' \
'  listen 80;' \
'  server_name _;' \
'' \
'  root /usr/share/nginx/html;' \
'  index index.html;' \
'' \
'  location / {' \
'    try_files $uri $uri/ /index.html;' \
'  }' \
'' \
'  location /api/ {' \
'    proxy_pass http://127.0.0.1:8000/api/;' \
'    proxy_set_header Host $host;' \
'    proxy_set_header X-Real-IP $remote_addr;' \
'    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' \
'    proxy_set_header X-Forwarded-Proto $scheme;' \
'  }' \
'' \
'  location /ws/ {' \
'    proxy_pass http://127.0.0.1:8000/ws/;' \
'    proxy_http_version 1.1;' \
'    proxy_set_header Upgrade $http_upgrade;' \
'    proxy_set_header Connection "upgrade";' \
'    proxy_set_header Host $host;' \
'    proxy_set_header X-Real-IP $remote_addr;' \
'    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' \
'    proxy_set_header X-Forwarded-Proto $scheme;' \
'  }' \
'}' \
> /etc/nginx/conf.d/default.conf

# Supervisor: run uvicorn + nginx
RUN printf '%s\n' \
'[supervisord]' \
'nodaemon=true' \
'logfile=/dev/null' \
'pidfile=/tmp/supervisord.pid' \
'' \
'[program:backend]' \
'command=uvicorn app.main:app --host 0.0.0.0 --port 8000' \
'directory=/app' \
'autostart=true' \
'autorestart=true' \
'stdout_logfile=/dev/fd/1' \
'stdout_logfile_maxbytes=0' \
'stderr_logfile=/dev/fd/2' \
'stderr_logfile_maxbytes=0' \
'' \
'[program:nginx]' \
'command=/usr/sbin/nginx -g "daemon off;"' \
'autostart=true' \
'autorestart=true' \
'stdout_logfile=/dev/fd/1' \
'stdout_logfile_maxbytes=0' \
'stderr_logfile=/dev/fd/2' \
'stderr_logfile_maxbytes=0' \
> /etc/supervisor/conf.d/supervisord.conf

# Defaults (override in Hostinger env vars)
ENV DATABASE_URL=sqlite:///./pfc.db
ENV ALLOWED_ORIGINS=*
ENV SEED_ADMIN=true
ENV SEED_ADMIN_EMAIL=admin@pfc.local
ENV SEED_ADMIN_PASSWORD=admin123!
ENV SECRET_KEY=change-me-to-a-long-random-secret

EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s --retries=10 CMD curl -fsS http://localhost/api/health || exit 1
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
