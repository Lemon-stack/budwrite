"use server";

import { SpeechClient, protos } from "@google-cloud/speech";

// Add type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface TranscriptionResult {
  success: boolean;
  text?: string;
  error?: string;
}

export async function transcribeAudio(
  audioBuffer: ArrayBuffer
): Promise<TranscriptionResult> {
  try {
    // Initialize the Speech-to-Text client
    const client = new SpeechClient();

    // Convert ArrayBuffer to base64
    const audioBytes = Buffer.from(audioBuffer).toString("base64");

    // Configure the request
    const request = {
      audio: {
        content: audioBytes,
      },
      config: {
        encoding:
          protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding
            .LINEAR16,
        sampleRateHertz: 16000,
        languageCode: "en-US",
      },
    };

    // Perform the transcription
    const [response] = await client.recognize(request);
    const transcription = response.results
      ?.map((result) => result.alternatives?.[0]?.transcript)
      .join("\n");

    if (!transcription) {
      throw new Error("No transcription results found");
    }

    return {
      success: true,
      text: transcription,
    };
  } catch (error) {
    console.error("Transcription error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
