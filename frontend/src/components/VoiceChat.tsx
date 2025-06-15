import { useEffect, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function VoiceChat() {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const tokenResponse = await fetch("http://localhost:8000/session");
        const data = await tokenResponse.json();
        const EPHEMERAL_KEY = data.client_secret.value;

        const pc = new RTCPeerConnection();

        const audioEl = document.createElement("audio");
        audioEl.autoplay = true;
        document.body.appendChild(audioEl);

        pc.ontrack = (e) => {
          audioEl.srcObject = e.streams[0];
          setIsListening(true);
        };

        const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
        pc.addTrack(ms.getTracks()[0]);

        const dc = pc.createDataChannel("oai-events");
        dc.addEventListener("message", (e) => {
          console.log("Server event:", e.data);
        });

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const baseUrl = "https://api.openai.com/v1/realtime";
        const model = "gpt-4o-realtime-preview-2025-06-03";

        const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${EPHEMERAL_KEY}`,
            "Content-Type": "application/sdp",
          },
        });

        const answer: RTCSessionDescriptionInit = {
          type: "answer",
          sdp: await sdpResponse.text(),
        };
        await pc.setRemoteDescription(answer);
      } catch (error) {
        console.error("Error initializing live chat:", error);
        setIsListening(false);
      }
    };

    init();

    return () => {
      const el = document.querySelector("audio");
      if (el) el.remove();
    };
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${isListening ? 'bg-green-100' : 'bg-gray-100'}`}>
            {isListening ? (
              <FaMicrophone className="w-8 h-8 text-green-600" />
            ) : (
              <FaMicrophoneSlash className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isListening ? "AI is Listening..." : "Voice Chat"}
          </CardTitle>
          <CardDescription className="text-center">
            {isListening 
              ? "Speak naturally and the AI will respond in real-time"
              : "Initializing voice connection..."}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center text-sm text-muted-foreground">
          {isListening && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Active</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
