import React from "react";
import AppHeader from "../components/AppHeader";
import { useState } from "react";
import { useCrypto } from "../context/crypto-context";
import { askCryptoBertAgent } from "../lib/agent";

export default function AppAgent() {
  const { items } = useCrypto();
  const [showContent, setShowContent] = useState(false);
  const [message, setMessages] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      setLoading(true);
      setAnswer("");
      const data = await askCryptoBertAgent(message);
      setAnswer(data.answer || "");
      setMessages("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const news = items.slice(0, 5);

  const toggleContent = () => {
    setShowContent((prevShowContent) => !prevShowContent);
  };

  return (
    <div className="m-0 p-0 min-h-screen bg-backGr">
      <AppHeader />
      {!showContent && (
        <div className="flex fixed justify-center items-center top-40 w-full bg-backGr">
          <div>
            <h1 className="text-5xl font-display font-bold justify-center flex text-purple-100">
              What is CryptoBert agent?
            </h1>
            <p className="mt-10 text-purple-50 text-center font-display leading-relaxed  text-xl max-w-3xl">
              CryptoBert scans live crypto news, tags each headline as bullish,
              bearish, or neutral, and gives you a clear view of the current
              market mood in seconds.
            </p>
            <p className="mt-3 text-purple-100 leading-relaxed text-center font-display text-lg max-w-3xl">
              Ask about overall sentiment, specific coins, regulations, hacks,
              ETFs, or narratives – it responds using real headlines, not hype.
            </p>
            <div className="flex justify-center mt-6">
              <button
                onClick={toggleContent}
                className="inline-flex p-0.5 mb-2  overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
              >
                <span className="px-5 py-2.5 font-display text-m transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                  Lets get started
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      {showContent && (
        <div>
          {!answer && (
            <div className="flex justify-center items-center flex-col p-6 mt-8">
              <h1 className="text-5xl font-display text-purple-100 leading-relaxed">
                Crypto Market News Sentiment
              </h1>
              <ul className="w-full max-w-4xl  mt-4">
                {news.map((item, i) => (
                  <li
                    key={i}
                    className="p-4 m-5 rounded-xl bg-slate-500/60 border border-slate-500 text-purple-50"
                  >
                    <div>
                      <strong>[{item.label}]</strong>{" "}
                      <span>({item.score?.toFixed(3)})</span>
                    </div>
                    <div className="font-bold m-1">{item.title}</div>
                    {item.link && (
                      <a
                        href={item.link}
                        className="hover:text-purple-300 font-mono"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Source
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {answer && (
            <div className="w-full justify-center px-6 mt-8 mb-6">
              <h2 className="text-3xl flex justify-center font-display text-purple-100 mb-2">
                CryptoBert summary
              </h2>
              <div className="w-full flex justify-center mt-6">
                <div className="p-4 rounded-xl max-w-5xl  bg-slate-900/80 border border-slate-700 text-purple-50 whitespace-pre-wrap">
                  {answer}
                </div>
              </div>
            </div>
          )}
          <footer className="w-full flex justify-center p-4 border-t border-slate-800 bg-backGr/90 fixed bottom-0 left-0">
            <div className="w-full max-w-4xl flex gap-3">
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessages(e.target.value)}
                className="block p-2.5 w-full text-sm text-purple-50 bg-slate-900 rounded-lg
                           border border-slate-700 focus:ring-purple-500 focus:border-purple-500
                           placeholder-purple-400"
                placeholder="Ask CryptoBert about today’s market or your coins..."
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="h-fit px-4 py-2 mt-auto mb-1 rounded-lg bg-gradient-to-r
                           from-purple-600 to-blue-500 text-white text-sm font-medium
                           hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Ask"}
              </button>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
