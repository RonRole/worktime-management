import { SessionContextProvider } from '@/components/containers/SessionContextProvider';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SessionContextProvider>
            <Component {...pageProps} />
        </SessionContextProvider>
    );
}
