import type { AppProps } from "next/app";
import { ThemeProvider } from "../context/ThemeContext";
import { JiraProvider } from "../context/JiraContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <JiraProvider>
        <Component {...pageProps} />
      </JiraProvider>
    </ThemeProvider>
  );
}
