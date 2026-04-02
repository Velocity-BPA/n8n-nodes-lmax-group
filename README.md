# n8n-nodes-lmax-group

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with LMAX Group's trading platform, offering 7 key resources for professional trading automation. Access account information, manage instruments, execute orders, monitor positions, retrieve market data, and maintain system connectivity through automated heartbeat functionality.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Trading Platform](https://img.shields.io/badge/LMAX%20Group-Trading-green)
![Financial Data](https://img.shields.io/badge/Market%20Data-Real--Time-orange)
![Order Management](https://img.shields.io/badge/Order%20Management-Professional-purple)

## Features

- **Account Management** - Retrieve account details, balances, and trading permissions
- **Instrument Discovery** - Access comprehensive instrument data and trading specifications
- **Order Execution** - Place, modify, cancel, and monitor trading orders with professional precision
- **Position Monitoring** - Track open positions, P&L, and exposure across all instruments
- **Real-Time Market Data** - Stream live prices, depth of market, and trading statistics
- **System Connectivity** - Maintain connection health with automated heartbeat functionality
- **Authentication Management** - Secure API key-based authentication with session handling
- **Professional Trading Tools** - Built for high-frequency and algorithmic trading environments

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-lmax-group`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-lmax-group
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-lmax-group.git
cd n8n-nodes-lmax-group
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-lmax-group
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your LMAX Group API key for authentication | Yes |
| Environment | Trading environment (Live/Demo) | Yes |
| Server URL | LMAX Group server endpoint URL | Yes |

## Resources & Operations

### 1. Authentication

| Operation | Description |
|-----------|-------------|
| Login | Authenticate with LMAX Group platform |
| Logout | Terminate current session |
| Get Session Status | Check current authentication status |
| Refresh Token | Renew authentication token |

### 2. Account

| Operation | Description |
|-----------|-------------|
| Get Account Details | Retrieve account information and settings |
| Get Account Balance | Fetch current account balance and equity |
| Get Account Permissions | List trading permissions and restrictions |
| Get Account History | Retrieve account transaction history |

### 3. Instrument

| Operation | Description |
|-----------|-------------|
| List Instruments | Get all available trading instruments |
| Get Instrument Details | Retrieve specific instrument information |
| Get Instrument Specifications | Fetch trading specifications and limits |
| Search Instruments | Find instruments by name or symbol |

### 4. Order

| Operation | Description |
|-----------|-------------|
| Place Order | Submit new trading order |
| Cancel Order | Cancel existing order |
| Modify Order | Update order parameters |
| Get Order Status | Check order execution status |
| List Orders | Retrieve all orders |
| Get Order History | Fetch historical order data |

### 5. Position

| Operation | Description |
|-----------|-------------|
| List Positions | Get all open positions |
| Get Position Details | Retrieve specific position information |
| Get Position History | Fetch historical position data |
| Calculate Position P&L | Compute profit and loss for positions |

### 6. MarketData

| Operation | Description |
|-----------|-------------|
| Get Market Prices | Retrieve current market prices |
| Get Market Depth | Fetch order book depth data |
| Get Historical Prices | Access historical price data |
| Get Trading Statistics | Retrieve market trading statistics |
| Subscribe to Price Feed | Set up real-time price streaming |

### 7. Heartbeat

| Operation | Description |
|-----------|-------------|
| Send Heartbeat | Maintain connection with ping |
| Check Connection Status | Verify platform connectivity |
| Get Server Time | Retrieve server timestamp |

## Usage Examples

```javascript
// Place a market order
{
  "instrumentId": "4001",
  "orderType": "MARKET",
  "side": "BUY",
  "quantity": "1.0",
  "timeInForce": "IOC"
}
```

```javascript
// Get real-time market data
{
  "instrumentId": "4001",
  "subscriptionType": "PRICE",
  "includeDepth": true,
  "depthLevels": 5
}
```

```javascript
// Monitor account balance
{
  "accountId": "12345",
  "currency": "USD",
  "includeUnrealized": true
}
```

```javascript
// Retrieve position details
{
  "instrumentId": "4001",
  "includeHistory": false,
  "calculatePnL": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Authentication Failed | Invalid API key or expired session | Verify credentials and re-authenticate |
| Insufficient Funds | Account balance too low for order | Check account balance and adjust order size |
| Invalid Instrument | Instrument not found or not tradeable | Verify instrument ID and trading hours |
| Order Rejected | Order parameters violate trading rules | Check order specifications and limits |
| Connection Timeout | Network connectivity issues | Retry request and check network status |
| Rate Limit Exceeded | Too many API requests | Implement request throttling and backoff |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-lmax-group/issues)
- **LMAX Group API Documentation**: [LMAX Group Developer Portal](https://www.lmax.com/developer)