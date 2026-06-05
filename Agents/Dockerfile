# Используем Python 3.10 (самый стабильный для ML сейчас)
# Не важно, что у тебя на Маке 3.14, внутри контейнера будет свой Питон.
FROM python:3.12-slim

# Рабочая папка внутри контейнера
WORKDIR /app

# Копируем requirements.txt и ставим библиотеки
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Копируем ВЕСЬ код (включая папку Agents и всё остальное)
COPY . .

# ВАЖНО: Говорим Питону, что корневая папка - это /app
# Без этого он может не найти модули Agents...
ENV PYTHONPATH=/app

EXPOSE 8000
# ВАЖНО: Запуск сервера по твоему пути.
# Путь: Agents/src/api/server.py  -> превращается в -> Agents.src.api.server
# :app - это название переменной app = FastAPI() внутри файла server.py
CMD ["uvicorn", "src.api.server:app", "--host", "0.0.0.0", "--port", "8000"]