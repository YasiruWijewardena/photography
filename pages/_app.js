// pages/_app.js
import '../styles/public/global.css'; 
import '../styles/public/loginPromt.css'; 
import { SessionProvider } from 'next-auth/react';
import { PhotoProvider } from '../context/PhotoContext';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <SessionProvider session={session}>
      <PhotoProvider>
        {getLayout(<Component {...pageProps} />)}
      </PhotoProvider>
     
    </SessionProvider>
  );
}
