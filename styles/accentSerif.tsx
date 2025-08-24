import { Inter, Instrument_Serif } from "next/font/google";

// Fonts
export const inter = Inter({ subsets: ["latin"] });
export const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["italic"],
  subsets: ["latin"],
});


// Accent serif helper

export function SerifAccent({ children }: { children: React.ReactNode }) {
  return (
    <em
      className={`${instrumentSerif.className} italic tracking-tight`}
    >
      {children}
    </em>
  );
}