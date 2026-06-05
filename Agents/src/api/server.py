from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from src.evalute_model  import analyze_texts
from src.news_service import analyze_latest_news

app = FastAPI(title="Crypto Agent API")

class SentimentRequest(BaseModel):
    texts: List[str]

@app.post("/api/sentiment")
def api_sentiment(req: SentimentRequest):

    results = analyze_texts(req.texts)
    return {"results": results}

@app.get("/api/news-sentiment")
def api_news_sentiment(
    q: str = "cryptocurrency",
    limit: int = 10,
):
    
    try:
        results = analyze_latest_news(q=q, limit=limit)
        return {"results": results}
    except Exception as e:
        return {"error": str(e)}
