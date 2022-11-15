import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css'
import { RainbowKitProvider, getDefaultWallets, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Layout from '../components/Layout/Layout';
import { ThemeProvider } from 'next-themes'
import {useTheme} from 'next-themes'
const { chains, provider, webSocketProvider } = configureChains(
  [
    // chain.mainnet,
    // chain.polygon,
    // chain.optimism,
    // chain.arbitrum,
    chain.polygonMumbai,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [chain.goerli, chain.kovan, chain.rinkeby, chain.ropsten]
      : []),
  ],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }) {

  return (
    <ThemeProvider  enableSystem={true} attribute="class">
      <Wrappers>
        <Component {...pageProps} />
      </Wrappers>
    </ThemeProvider>
  );
}
function Wrappers({children}) {
  const {systemTheme} = useTheme()
  console.log('theme: ', systemTheme)
  return (
    <WagmiConfig client={wagmiClient}  >
      <RainbowKitProvider chains={chains} theme = {systemTheme === 'dark'? darkTheme() :lightTheme()} >
        <Layout>
          {children}
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
export default MyApp;
