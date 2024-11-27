# https://docs.astral.sh/uv/guides/integration/docker/#non-editable-installs

FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project

ADD . /app

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen

ENV PORT=8000
EXPOSE $PORT

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "$PORT"]
