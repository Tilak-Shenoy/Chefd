import { AppProps } from 'next/app';
import { ChakraProvider, extendTheme, theme as base } from '@chakra-ui/react';
import '../styles/styles.css';
// import { SessionProvider } from 'next-auth/react';

const App = ({ Component, pageProps }) => {

  //Extend Theme
  const theme = extendTheme({
    fonts: {
      heading: `Montserrat, ${base.fonts?.heading}`,
      body: `Inter, ${base.fonts?.body}`,
    },
  })

    // <SessionProvider session={pageProps.session}>
  return (
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
  );
};

export default App;