# src/text_preprocess.py

import re

_raw_chat_word = {
    'CEO': 'Chief Executive Officer',
    'EVM': 'Ethereum Virtual Machine',
    'SEC': 'Securities and Exchange Commission',
    'DAO': 'Decentralized Autonomous Organization',
    'ETF': 'Exchange Traded Fund',
    'FOMO': 'Fear Of Missing Out',
    'FUD': 'Fear Uncertainty Doubt',
    'DYOR': 'Do Your Own Research',
    'BTFD': 'Buy The Fucking Dip',
    'HODL': 'Hold On For Dear Life',
    'ATH': 'All Time High',
    'ATL': 'All Time Low',
    'IPO': 'Initial Public Offering',
    'ROI': 'Return On Investment',
    'EPS': 'Earnings Per Share',
    'P/E': 'Price To Earnings Ratio',
    'YTD': 'Year To Date',
    'YOY': 'Year Over Year',
    'SL': 'Stop Loss',
    'TP': 'Take Profit',
    'PT': 'Price Target',
    'MCAP': 'Market Capitalization',
    'VOL': 'Trading Volume',
    'CFD': 'Contract For Difference',
    'MOON': 'To The Moon',
    'BEAR': 'Bearish Sentiment',
    'BULL': 'Bullish Sentiment',
    'TradFi': 'Traditional Finance',
    'DeFi': 'Decentralized Finance',
    'CeFi': 'Centralized Finance',
    'REKT': 'Severely lost money',
    'NFT': 'Non Fungible Token',
    'TRADFI': 'Traditional Finance',
    'DEFI': 'Decentralized Finance',
    'CEFI': 'Centralized Finance',
}

chat_word = {k.upper(): v for k, v in _raw_chat_word.items()}

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
    r'\bdefi\b': 'decentralized finance',
}

_acro_pat = re.compile(
    r'\b(' + '|'.join(re.escape(k) for k in chat_word.keys()) + r')\b',
    flags=re.IGNORECASE,
)

def expand_slang(text: str) -> str:
    return _acro_pat.sub(lambda m: chat_word[m.group(0).upper()], text)

def normalize_terms(text: str) -> str:
    for pat, replacement in normalize_map.items():
        text = re.sub(pat, replacement, text, flags=re.IGNORECASE)
    return text

def clean_text(text: str) -> str:
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def preprocess_for_model(text: str) -> str:
    text = expand_slang(text)
    text = normalize_terms(text)
    text = clean_text(text)
    return text
