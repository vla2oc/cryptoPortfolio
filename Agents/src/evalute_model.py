from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import os
import requests
from dotenv import load_dotenv

load_dotenv()

MODEL_PATH = './model/finbert-crypto-sentiment'

_tokenizer = None
_model = None
_pipeline = None

def load_sentiment_model():
    global _tokenizer, _model, _pipeline
    if _pipeline is None:
        print(f"[ML] Loading sentiment model from {MODEL_PATH}...")
        _tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
        _model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
        _pipeline = pipeline(
            "text-classification",
            model=_model,
            tokenizer=_tokenizer,
             max_length=256,
             truncation=True,
        )
    return _pipeline

def analyze_texts(texts: list[str]):
   
    clf = load_sentiment_model()
    results = []
    for t in texts:
        t = (t or "").strip()
        if not t:
            continue
        pred = clf(t)[0]
        results.append({
            "text": t,
            "label": pred["label"],
            "score": float(pred["score"]),
        })
    return results