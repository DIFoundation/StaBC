import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { baseSepolia, celoSepolia } from '@reown/appkit/networks'

// Get projectId from https://dashboard.reown.com
export const projectId = "3815d2e1168083c700a0d194dafdb7d2"

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [baseSepolia, celoSepolia]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig