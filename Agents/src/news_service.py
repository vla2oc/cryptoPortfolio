import os
import requests
from .evalute_model import analyze_texts
from dotenv import load_dotenv
from .text_preprocess import preprocess_for_model

load_dotenv()

API_KEY = os.getenv("NEWSDATA_API_KEY")


endpoint = "https://newsdata.io/api/1/crypto"

def fetch_latest_news(q: str = "cryptocurrency", limit: int = 10):
    if not API_KEY:
        raise RuntimeError("API_KEY is not set")

    params = {
        "apikey": API_KEY,
        "q": q,
        "language": "en",
    }

    resp = requests.get(endpoint, params=params, timeout=10)
    if not resp.ok:
        raise RuntimeError(f"News API error {resp.status_code}: {resp.text[:200]}")

    data = resp.json()
    articles = data.get("results") or data.get("articles") or []

    def combine_title_desc(a):
        title = (a.get("title") or "").strip()
        desc = (a.get("description") or a.get("summary") or "").strip()
        if title and desc:
            return f"{title}. {desc}"
        return title or desc

    cleaned = []
    for a in articles[:limit]:
        text = combine_title_desc(a)
        if not text:
            continue

        text = preprocess_for_model(text)

        cleaned.append({
            "title": a.get("title", ""),
            "link": a.get("link") or a.get("source_url"),
            "date": a.get('pubDate', ""),
            "text": text,
        })

    return cleaned

def analyze_latest_news(q: str = "cryptocurrency", limit: int = 10):

    articles = fetch_latest_news(q=q, limit=limit)
    texts = [a["text"] for a in articles]
    sentiments = analyze_texts(texts)

    enriched = []
    for a, s in zip(articles, sentiments):
        enriched.append({
            "title": a["title"],
            "link": a["link"],
            "label": s["label"],
            "score": s["score"],
        })
    return enriched
