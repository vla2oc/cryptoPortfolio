// /lib/agent.js
import { axiosInstance } from './axios';

export async function askCryptoBertAgent(message) {
    const res = await axiosInstance.post('/agent/chat', { message });
    return res.data; // { answer, news }
}
