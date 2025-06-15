import { VoiceChat } from "./components/VoiceChat";


export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-4 bg-slate-800 text-white shadow-md">
        <h1 className="text-2xl font-bold text-center">Voice AI Chat</h1>
        <p className="text-sm text-center text-blue-100 mt-1">Speak naturally with AI</p>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6 flex justify-center items-center">
        <VoiceChat />
      </main>
      <footer className="p-4 bg-gray-100 text-center text-gray-600 text-sm">
        Powered by OpenAI Whisper & GPT-3.5
      </footer>
    </div>
  );
}