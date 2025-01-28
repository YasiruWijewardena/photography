// pages/_app.js
import '../styles/public/global.css'; 
import '../styles/public/loginPromt.css'; 
import { SessionProvider } from 'next-auth/react';
import { PhotoProvider } from '../context/PhotoContext';
import { Toaster } from 'react-hot-toast';
import { ConfirmProvider } from '../context/ConfirmContext';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <SessionProvider session={session}>
      <PhotoProvider>
        <ConfirmProvider>
          {getLayout(<Component {...pageProps} />)}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontFamily: "Parkinsans", 
              },
              success: {
                iconTheme: {
                  primary: 'black',
                  secondary: 'white', 
                },
                style: {
                  background: '#fff',
                  color: '#000',
                },
              },
              error: {
                iconTheme: {
                  primary: 'red', 
                  secondary: 'white', 
                },
                style: {
                  background: '#fff', 
                  color: '#000', 
                },
              },
              // **Customizing Other Toast Types (optional)**
              // You can add similar blocks for 'loading', 'default', etc.
            }}
          />
        </ConfirmProvider>
      </PhotoProvider>
    </SessionProvider>
  );
}
