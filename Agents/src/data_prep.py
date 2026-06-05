import re
import pandas as pd


chat_word = {

    'CEO': 'Chief Executive Officer',
    'EVM': 'Ethereum Virtual Machine',
    'SEC': 'Securities and Exchange Commission',
    'DAO': 'Decentralized Autonomous Organization',
    'ETF': 'Exchange Traded Fund',
    "ETFS" : 'Exchange Traded Funds',

    'FOMO': 'Fear Of Missing Out', 
    'FUD': 'Fear Uncertainty Doubt', 
    'FAD': 'Short lived hype trend',
    'DYOR': 'Do Your Own Research', 
    'BTFD': 'Buy The Fucking Dip', 
    'HODL': 'Hold On For Dear Life', 
    'ATH': 'All Time High', 
    'ATL': 'All Time Low', 
    'IPO': 'Initial Public Offering', 
    'ROI': 'Return On Investment', 'EPS': 'Earnings Per Share', 
    'P/E': 'Price To Earnings Ratio', 
    'YTD': 'Year To Date', 
    'YOY': 'Year Over Year',  
    'SL': 'Stop Loss', 'TP': 'Take Profit', 
    'PT': 'Price Target', 
    'MCAP': 'Market Capitalization', 
    'VOL': 'Trading Volume', 
    'ETF': 'Exchange Traded Fund', 
    'CFD': 'Contract For Difference', 
    'MOON': 'To The Moon', 
    'BEAR': 'Bearish Sentiment', 
    'BULL': 'Bullish Sentiment',
    'TradFi': 'Traditional Finance',
    'DeFi':'Decentralized Finance',
    'CeFi': 'Centralized Finance',
    'REKT': 'Severely lost money',
    'NFT': 'Non Fungible Token',
    'TRADFI': 'Traditional Finance', #
    'DEFI': 'Decentralized Finance',   # 
    'CEFI': 'Centralized Finance',     # 
}
chat_word = {k.upper(): v for k, v in chat_word.items()}

normalize_map = {
    r'\bBTC\b': 'bitcoin',
    r'\bETH\b': 'ethereum',
    r'\bDOGE\b': 'dogecoin',
    r'\bXRP\b': 'ripple',
    r'\bSOL\b': 'solana',
    r'\bBNB\b': 'binance',
    r'\bADA\b': 'cardano',
    r'\bUSDT\b': 'tether',
    r'\bUSDC\b': 'usd coin',
    r'\bcrypto\b': 'cryptocurrency',
    r'\btradfi\b': 'traditional finance',
    r'\bdefi\b': 'decentralized finance'
}



_acro_pat = re.compile(
    r'\b(' + '|'.join(re.escape(k) for k in chat_word) + r')\b',
    flags=re.IGNORECASE
    )


def combine_title_text(row):
    title = str(row.get('title_news','')).strip()
    body = str(row.get('text_news','')).strip()

    if title and body:
        return f"{title}. {body}"
    elif title:
        return title
    else:
        return body
        



def expand_slang(text: str) -> str:
    """Раскрывает крипто-аббревиатуры."""
    return _acro_pat.sub(lambda m: chat_word[m.group(0).upper()], text)

def clean_text(text: str) -> str:
    """Удаляет ссылки, эмодзи, цифры и лишние пробелы."""
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip().lower()

def normalize_terms(text: str) -> str:
    """Приводит тикеры и термины к нормальной форме."""
    for pat, replacement in normalize_map.items():
        text = re.sub(pat, replacement, text, flags=re.IGNORECASE)
    return text

def preprocess_text(text: str) -> str:
    """Комбинированная предобработка."""
    text = expand_slang(text)
    text = normalize_terms(text)
    text = clean_text(text)
    return text

def preprocess_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Применяет все этапы очистки."""
    df = df.copy()
    df['text'] = df.apply(combine_title_text, axis=1)

    df['text'] = df['text'].astype(str)
    df['text_clean'] = df['text'].apply(preprocess_text)
    return df[['text_clean', 'label']]

if __name__ == "__main__":
    df = pd.read_csv("data/news_with_sentiment.csv")

    df_clean = preprocess_dataframe(df)

    df_clean.to_csv("data/processed/news_clean2.csv", index=False)


    print(f"✅ Done! Saved cleaned data to data/processed/news_clean2.csv")