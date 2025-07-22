import { YoutubeTranscript } from 'youtube-transcript';

export async function getTranscript(videoIdOrUrl: string): Promise<string> {
  const transcript = await YoutubeTranscript.fetchTranscript(videoIdOrUrl);
  return transcript.map((segment) => segment.text).join(" ");
}
