# Build stage
FROM python:3.12-alpine AS builder

WORKDIR /app

RUN apk add --no-cache build-base gcc musl-dev libffi-dev openssl-dev cargo postgresql-dev

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

# Final stage
FROM python:3.12-alpine

WORKDIR /app

# Install runtime dependencies only
RUN apk add --no-cache libffi openssl postgresql-libs

# Copy installed packages and code from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /app /app

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
