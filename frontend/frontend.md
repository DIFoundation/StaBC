# StaBC Frontend Specification

## 1. Dashboard Page
### Overview
- Displays key metrics and quick actions
- Shows current network status
- Quick access to staking and governance

### Components
1. **Header**
   - Network selector
   - Wallet connection
   - Navigation menu

2. **Stats Overview**
   - Total Value Locked (TVL)
   - Current APY
   - Active validators
   - Total stakers

3. **Quick Actions**
   - Stake tokens
   - Bridge assets
   - View proposals

### Contract Functions
```solidity
// Get TVL
function getTotalValueLocked() external view returns (uint256);

// Get current APY
function getCurrentAPY() external view returns (uint256);

// Get total stakers
function getTotalStakers() external view returns (uint256);
```

---

## 2. Staking Page
### Overview
- Stake/Unstake tokens
- View staking positions
- Claim rewards

### Components
1. **Staking Form**
   - Amount input
   - Stake/Unstake toggle
   - Current APR display
   - Transaction preview

2. **Position Overview**
   - Staked amount
   - Pending rewards
   - Unbonding period
   - Reward history

### Contract Functions
```solidity
// Stake tokens
function stake(uint256 amount) external;

// Unstake tokens
function unstake(uint256 amount) external;

// Claim rewards
function claimRewards() external;

// Get user staking info
function getUserStake(address user) external view returns (uint256 staked, uint256 rewards);
```

---

## 3. Governance Page
### Overview
- View and create proposals
- Vote on active proposals
- Track proposal status

### Components
1. **Proposal List**
   - Active proposals
   - Past proposals
   - Proposal status indicators

2. **Proposal Detail**
   - Description
   - Voting options
   - Current results
   - Time remaining

3. **Create Proposal**
   - Title/description input
   - Parameter changes
   - Transaction builder

### Contract Functions
```solidity
// Get all proposals
function getProposals() external view returns (Proposal[] memory);

// Get proposal details
function getProposal(uint256 proposalId) external view returns (Proposal memory);

// Create proposal
function propose(string calldata description, address[] calldata targets, uint256[] calldata values, bytes[] calldata calldatas) external returns (uint256);

// Vote on proposal
function castVote(uint256 proposalId, uint8 support) external;
```

---

## 4. Bridge Page
### Overview
- Cross-chain asset transfers
- Transaction history
- Bridge status

### Components
1. **Bridge Form**
   - Source/destination chain selector
   - Asset selector
   - Amount input
   - Fee display

2. **Transaction History**
   - Pending transactions
   - Completed transfers
   - Status tracking

### Contract Functions
```solidity
// Bridge tokens
function bridgeTokens(address token, uint256 amount, uint256 destChainId, address recipient) external payable;

// Get bridge fee
function getBridgeFee(address token, uint256 amount, uint256 destChainId) external view returns (uint256);

// Get transaction status
function getTransactionStatus(bytes32 txHash) external view returns (uint8);
```

---

## 5. Portfolio Page
### Overview
- Asset balances
- Transaction history
- Performance metrics

### Components
1. **Asset Overview**
   - Token balances
   - Value in USD
   - Allocation chart

2. **Transaction History**
   - All transactions
   - Filtering options
   - Export functionality

### Contract Functions
```solidity
// Get user's token balances
function getBalances(address user) external view returns (TokenBalance[] memory);

// Get transaction history
function getTransactionHistory(address user, uint256 limit, uint256 offset) external view returns (Transaction[] memory);
```

---

## 6. Settings Page
### Overview
- Wallet management
- Network configuration
- Display preferences

### Components
1. **Wallet Settings**
   - Connect/disconnect wallet
   - View wallet address
   - Transaction settings

2. **Network Settings**
   - Network selector
   - Custom RPC configuration
   - Gas price settings

3. **Display**
   - Theme selection
   - Currency display
   - Language settings

### Contract Functions
```solidity
// No direct contract interaction for most settings
// Uses web3 providers and local storage
```

---

## 7. FAQ/Help Page
### Overview
- Documentation links
- Tutorials
- Support contact

### Components
1. **Documentation**
   - Getting started
   - Guides
   - API references

2. **Support**
   - Contact form
   - Community links
   - Status page

---

## 8. Admin Dashboard
### Overview
- Protocol management
- Parameter configuration
- Emergency controls

### Components
1. **Protocol Parameters**
   - Fee settings
   - Rate limits
   - Access controls

2. **System Status**
   - Contract status
   - Pause/unpause
   - Upgrade controls

### Contract Functions
```solidity
// Pause protocol
function pause() external onlyOwner;

// Update fees
function setFee(uint256 newFee) external onlyOwner;

// Add/remove admin
function setAdmin(address admin, bool status) external onlyOwner;
```

## Implementation Notes
- All contract calls should include proper error handling
- Implement loading states for async operations
- Include transaction confirmation dialogs
- Support wallet connection (MetaMask, WalletConnect, etc.)
- Follow responsive design principles for mobile compatibility
- Include proper input validation on all forms
- Implement proper state management for complex interactions

## Security Considerations
- Verify all contract addresses before interaction
- Validate all user inputs
- Handle wallet disconnections gracefully
- Display transaction hashes for all on-chain actions
- Include transaction simulation before execution

## Testing Requirements
- Unit tests for all components
- Integration tests for contract interactions
- End-to-end tests for user flows
- Cross-browser/device testing
- Performance testing for complex operations
