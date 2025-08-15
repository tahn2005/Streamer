# Stock Server

A real-time stock and cryptocurrency data server built with Node.js, TypeScript, and Express. This server provides live market data, historical closing prices, and financial news through REST APIs and WebSocket connections.

## Features

- **Real-time Stock Data**: Live price updates for stocks via Alpaca Markets API
- **Cryptocurrency Support**: Real-time crypto price data for major cryptocurrencies
- **Historical Data**: Closing prices and historical market data
- **Financial News**: Latest financial news and market updates
- **WebSocket Streaming**: Real-time data streaming for live updates
- **Authentication**: Token-based API authentication
- **CORS Support**: Configurable CORS policies for development and production
- **Caching**: In-memory caching for improved performance

## Tech Stack

- **Backend**: Node.js, TypeScript, Express
- **Real-time**: WebSocket (ws)
- **Market Data**: Alpaca Markets API
- **News**: Financial news API
- **Database**: PostgreSQL (for future enhancements)
- **Development**: ts-node-dev for hot reloading

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Alpaca Markets API credentials
- Financial news API key (optional)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stockserver
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env
```

4. Configure your `.env` file with your API credentials. Note: NEVER push your env files to GitHub. For deplpyment, configure them on the deployment platform instead. Included in the repository is a sample `.env` file for example usage only. Below is how your environment variables should be formatted:
```env
ALPACA_KEY_ID=your_alpaca_id
ALPACA_SECRET_KEY=your_alpaca_secret
DEV=your_development_domains
NEWS_KEY=your_news_key
PORT=your_port
PROD=your_production_domains
SYMBOLS=[{"symbol":"SPY","type":"stock"},{"symbol":"AAPL","type":"stock"},{"symbol":"BTC/USD","type":"crypto"}]
TOKEN=your_custom_auth_token
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ALPACA_KEY_ID` | Your Alpaca Markets API key ID | Yes |
| `ALPACA_SECRET_KEY` | Your Alpaca Markets API secret key | Yes |
| `DEV` | Comma-separated list of allowed development domains | Yes |
| `PROD` | Comma-separated list of allowed production domains | Yes |
| `PORT` | Server port number | Yes |
| `TOKEN` | Custom authentication token for API access | Yes |
| `NEWS_KEY` | Financial news API key | Yes |
| `SYMBOLS` | JSON array of symbols to track | Yes |

### Symbol Configuration

The `SYMBOLS` environment variable should contain a JSON array of objects with the following structure:

```json
[
  {"symbol": "SPY", "type": "stock"},
  {"symbol": "AAPL", "type": "stock"},
  {"symbol": "BTC/USD", "type": "crypto"}
]
```

## Usage

### Development

Start the development server with hot reloading:
```bash
npm run dev
```

### Production

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Endpoints

All API endpoints require authentication via the `Authorization` header:
```
Authorization: Bearer your_custom_auth_token
```

### GET /api/init

Returns initial data including current prices, closing prices, and news. Initializes on server start with preconfigured chosen assets

**Response:**
```json
{
  "prices": {
    "SPY": 450.25,
    "AAPL": 175.50
  },
  "closes": {
    "SPY": 448.75,
    "AAPL": 174.25
  },
  "news": [
    {
      "title": "Market Update",
      "content": "..."
    }
  ]
}
```

### GET /api/sub

Subscribes to specific stocks via websocket data streaming. Send a post request to this endpoint with a json string of assets in array format and it will reset the default assets with automated updates and streaming. Returns same response as /init.

**Response:**
```json
{
  "prices": {
    "SPY": 450.25,
    "AAPL": 175.50
  },
  "closes": {
    "SPY": 448.75,
    "AAPL": 174.25
  },
  "news": [
    {
      "title": "Market Update",
      "content": "..."
    }
  ]
}
```

### GET /api/ping

Health check endpoint.

**Response:**
```
pong
```

## WebSocket API

The server also provides WebSocket connections for real-time data streaming.

### Connection

Connect to the WebSocket endpoint:
```
ws://localhost:PORT
```

### Authentication

Send authentication message after connection:
```json
{
  "type": "auth",
  "token": "your_custom_auth_token"
}
```

### Real-time Data

The WebSocket will stream real-time updates for:
- Stock price changes
- Cryptocurrency price changes
- Market news updates

## Project Structure

```
stockserver/
├── src/
│   ├── index.ts              # Main server entry point
│   ├── routes.ts             # API route definitions
│   ├── stock.ts              # Stock data functions
│   ├── crypto.ts             # Cryptocurrency data functions
│   ├── news.ts               # News data functions
│   ├── db.ts                 # Database configuration
│   ├── websocket.ts          # WebSocket setup
│   └── streaming/
│       ├── current.ts        # Current price streaming
│       ├── closing.ts        # Closing price data
│       ├── closingcache.ts   # Closing price cache
│       ├── stocksocket.ts    # Stock WebSocket handling
│       └── cryptosocket.ts   # Crypto WebSocket handling
├── package.json
├── tsconfig.json
├── sample.env
└── README.md
```

## Error Handling

The server includes comprehensive error handling for:
- Invalid authentication tokens
- CORS policy violations
- API rate limiting
- Network connectivity issues
- Invalid symbol requests

## Security

- Token-based authentication for all API endpoints
- Configurable CORS policies
- Environment variable protection
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License

## Support

For issues and questions, please open an issue in the repository or contact the development team.

## Disclaimer

This software is for educational and informational purposes only. It is not intended to provide financial advice. Always do your own research and consult with financial professionals before making investment decisions.
