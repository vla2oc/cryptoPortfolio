import e from "express";
import fetch from "node-fetch";

const router = e.Router()

const PYTHON_URL = process.env.PYTHON_BASE_URL || 'http://127.0.0.1:8000/api'

export async function callPythonService(texts) {
    const res = await fetch(`${PYTHON_URL}/sentiment`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts }),
    })
    if (!res.ok) {
        const msg = await res.text()
        throw new Error(`Python /api/sentiment error: ${res.status} ${msg}`);
    }
    return res.json()
}

export async function fetchNewsSentiment(limit = 10, q = "cryptocurrency") {
    const url = new URL(`${PYTHON_URL}/news-sentiment`);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("q", q);

    const res = await fetch(url.toString());
    if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Python /api/news-sentiment error: ${res.status} ${msg}`);
    }

    return res.json(); // ожидаем { results: [...] }
}

router.post('/sentiment', async (req, res) => {
    try {
        const { texts } = req.body
        if (!Array.isArray(texts) || texts.length === 0) {
            return res.status(400).json({ error: "Field 'texts' must be a non-empty array of strings" })
        }
        const data = await callPythonService(texts)
        return res.json(data)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Failed to fetch sentiment from Python service" })
    }
})

router.get('/news-sentiment', async (req, res) => {
    try {
        const limit = req.query.limit || 10
        const q = req.query.q || 'cryptocurrency'

        const url = new URL(`${PYTHON_URL}/news-sentiment`)
        url.searchParams.set('limit', String(limit))
        url.searchParams.set('q', String(q))

        const pyRes = await fetch(url.toString())
        if (!pyRes.ok) {
            const msg = await pyRes.text()
            throw new Error(`Python /api/news-sentiment error: ${pyRes.status} ${msg}`)
        }
        const data = await pyRes.json()
        return res.json(data)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Failed to fetch news sentiment from Python service" })
    }
})

export default router