import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { bsc } from 'wagmi/chains';
import BaseThemeProvider from './providers/BaseThemeProvider';
import { DarkModeProvider } from './providers/DarkModeProvider';

//WAGMI + WALLETCONNECT
if (!import.meta.env.VITE_WALLETCONNECT_CLOUD_ID) {
  throw new Error('You need to provide WALLETCONNECT_CLOUD_ID env variable');
}
const projectId = import.meta.env.VITE_WALLETCONNECT_CLOUD_ID;
const chains = [bsc];
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    version: '1',
    appName: 'BanditLsdtSwap',
    chains,
    projectId,
  }),
  provider,
});

const ethereumClient = new EthereumClient(wagmiClient, chains);

function App({ children }) {
  return (
    <DarkModeProvider>
      <BaseThemeProvider>
        <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
        <Web3Modal
          projectId={projectId}
          ethereumClient={ethereumClient}
          disableScrollLock
        />
      </BaseThemeProvider>
    </DarkModeProvider>
  );
}

export default App;
