import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'testalpacadocs/2.0.0 (api/6.1.3)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * This endpoint provides data about the corporate actions for each given symbol over a
   * specified time period.
   *
   * @summary Corporate actions
   * @throws FetchError<400, types.CorporateActionsResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.CorporateActionsResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  corporateActions(metadata?: types.CorporateActionsMetadataParam): Promise<FetchResponse<200, types.CorporateActionsResponse200>> {
    return this.core.fetch('/v1/corporate-actions', 'get', metadata);
  }

  /**
   * This endpoint returns the latest prices for the given fixed income securities.
   *
   * @summary Latest prices
   * @throws FetchError<400, types.FixedIncomeLatestPricesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.FixedIncomeLatestPricesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  fixedIncomeLatestPrices(metadata: types.FixedIncomeLatestPricesMetadataParam): Promise<FetchResponse<200, types.FixedIncomeLatestPricesResponse200>> {
    return this.core.fetch('/v1beta1/fixed_income/latest/prices', 'get', metadata);
  }

  /**
   * Get the latest forex rates for the given currency pairs.
   *
   * @summary Latest rates for currency pairs
   * @throws FetchError<400, types.LatestRatesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.LatestRatesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  latestRates(metadata: types.LatestRatesMetadataParam): Promise<FetchResponse<200, types.LatestRatesResponse200>> {
    return this.core.fetch('/v1beta1/forex/latest/rates', 'get', metadata);
  }

  /**
   * Get historical forex rates for the given currency pairs in the given time interval and
   * at the given timeframe (snapshot frequency).
   *
   * @summary Historical rates for currency pairs
   * @throws FetchError<400, types.RatesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.RatesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  rates(metadata: types.RatesMetadataParam): Promise<FetchResponse<200, types.RatesResponse200>> {
    return this.core.fetch('/v1beta1/forex/rates', 'get', metadata);
  }

  /**
   * Get the image of the company logo for the given symbol.
   *
   * @summary Logos
   * @throws FetchError<400, types.LogosResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.LogosResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  logos(metadata: types.LogosMetadataParam): Promise<FetchResponse<200, types.LogosResponse200>> {
    return this.core.fetch('/v1beta1/logos/{symbol}', 'get', metadata);
  }

  /**
   * Returns the latest news articles across stocks and crypto. By default, returns the
   * latest 10 news articles.
   *
   * @summary News articles
   * @throws FetchError<400, types.NewsResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.NewsResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  news(metadata?: types.NewsMetadataParam): Promise<FetchResponse<200, types.NewsResponse200>> {
    return this.core.fetch('/v1beta1/news', 'get', metadata);
  }

  /**
   * The historical option bars API provides aggregates for a list of option symbols between
   * the specified dates.
   *
   * The returned results are sorted by symbol first, then by bar timestamp.
   * This means that you are likely to see only one symbol in your first response if there
   * are enough bars for that symbol to hit the limit you requested.
   *
   * In these situations, if you keep requesting again with the `next_page_token` from the
   * previous response, you will eventually reach the other symbols if any bars were found
   * for them.
   *
   * @summary Historical bars
   * @throws FetchError<400, types.OptionBarsResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.OptionBarsResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  optionBars(metadata: types.OptionBarsMetadataParam): Promise<FetchResponse<200, types.OptionBarsResponse200>> {
    return this.core.fetch('/v1beta1/options/bars', 'get', metadata);
  }

  /**
   * Returns the mapping between the condition codes and names.
   *
   * @summary Condition codes
   * @throws FetchError<400, types.OptionMetaConditionsResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.OptionMetaConditionsResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  optionMetaConditions(metadata: types.OptionMetaConditionsMetadataParam): Promise<FetchResponse<200, types.OptionMetaConditionsResponse200>> {
    return this.core.fetch('/v1beta1/options/meta/conditions/{ticktype}', 'get', metadata);
  }

  /**
   * Returns the mapping between the option exchange codes and the corresponding exchanges
   * names.
   *
   * @summary Exchange codes
   * @throws FetchError<400, types.OptionMetaExchangesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.OptionMetaExchangesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  optionMetaExchanges(): Promise<FetchResponse<200, types.OptionMetaExchangesResponse200>> {
    return this.core.fetch('/v1beta1/options/meta/exchanges', 'get');
  }

  /**
   * The latest multi-quotes endpoint provides the latest bid and ask prices for each given
   * contract symbol.
   *
   * @summary Latest quotes
   * @throws FetchError<400, types.OptionLatestQuotesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.OptionLatestQuotesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  optionLatestQuotes(metadata: types.OptionLatestQuotesMetadataParam): Promise<FetchResponse<200, types.OptionLatestQuotesResponse200>> {
    return this.core.fetch('/v1beta1/options/quotes/latest', 'get', metadata);
  }

  /**
   * The snapshots endpoint provides the latest trade, latest quote and greeks for each given
   * contract symbol.
   *
   * @summary Snapshots
   * @throws FetchError<400, types.OptionSnapshotsResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.OptionSnapshotsResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  optionSnapshots(metadata: types.OptionSnapshotsMetadataParam): Promise<FetchResponse<200, types.OptionSnapshotsResponse200>> {
    return this.core.fetch('/v1beta1/options/snapshots', 'get', metadata);
  }

  /**
   * The option chain endpoint provides the latest trade, latest quote, and greeks for each
   * contract symbol of the underlying symbol.
   *
   * @summary Option chain
   * @throws FetchError<400, types.OptionChainResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.OptionChainResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  optionChain(metadata: types.OptionChainMetadataParam): Promise<FetchResponse<200, types.OptionChainResponse200>> {
    return this.core.fetch('/v1beta1/options/snapshots/{underlying_symbol}', 'get', metadata);
  }

  /**
   * The historical option trades API provides trade data for a list of contract symbols
   * between the specified dates, up to 7 days ago.
   *
   * The returned results are sorted by symbol first then by trade timestamp.
   * This means that you are likely to see only one symbol in your first response if there
   * are enough trades for that symbol to hit the limit you requested.
   *
   * In these situations, if you keep requesting again with the `next_page_token` from the
   * previous response, you will eventually reach the other symbols if any trades were found
   * for them.
   *
   * @summary Historical trades
   * @throws FetchError<400, types.OptionTradesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.OptionTradesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  optionTrades(metadata: types.OptionTradesMetadataParam): Promise<FetchResponse<200, types.OptionTradesResponse200>> {
    return this.core.fetch('/v1beta1/options/trades', 'get', metadata);
  }

  /**
   * The latest multi-trades endpoint provides the latest historical trade data for multiple
   * given contract symbols.
   *
   * @summary Latest trades
   * @throws FetchError<400, types.OptionLatestTradesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.OptionLatestTradesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  optionLatestTrades(metadata: types.OptionLatestTradesMetadataParam): Promise<FetchResponse<200, types.OptionLatestTradesResponse200>> {
    return this.core.fetch('/v1beta1/options/trades/latest', 'get', metadata);
  }

  /**
   * Returns the most active stocks by volume or trade count based on real time SIP data. By
   * default, returns the top 10 symbols by volume.
   *
   * @summary Most active stocks
   * @throws FetchError<400, types.MostActivesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.MostActivesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  mostActives(metadata?: types.MostActivesMetadataParam): Promise<FetchResponse<200, types.MostActivesResponse200>> {
    return this.core.fetch('/v1beta1/screener/stocks/most-actives', 'get', metadata);
  }

  /**
   * Returns the top market movers (gainers and losers) based on real time SIP data.
   * The change for each symbol is calculated from the previous closing price and the latest
   * closing price.
   *
   * For stocks, the endpoint resets at market open. Until then, it shows the previous market
   * day's movers.
   * The data is split-adjusted. Only tradable symbols in exchanges are included.
   *
   * For crypto, the endpoint resets at midnight.
   *
   * @summary Top market movers
   * @throws FetchError<400, types.MoversResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.MoversResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  movers(metadata: types.MoversMetadataParam): Promise<FetchResponse<200, types.MoversResponse200>> {
    return this.core.fetch('/v1beta1/screener/{market_type}/movers', 'get', metadata);
  }

  /**
   * The latest bars endpoint returns the latest bar data for the crypto perpetual futures
   * symbols provided.
   *
   * @summary Latest bars
   * @throws FetchError<400, types.CryptoPerpLatestBarsResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.CryptoPerpLatestBarsResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  cryptoPerpLatestBars(metadata: types.CryptoPerpLatestBarsMetadataParam): Promise<FetchResponse<200, types.CryptoPerpLatestBarsResponse200>> {
    return this.core.fetch('/v1beta1/crypto-perps/{loc}/latest/bars', 'get', metadata);
  }

  /**
   * The latest futures pricing endpoint returns the latest pricing data for the crypto
   * perpetual futures symbols provided.
   *
   * @summary Latest pricing
   * @throws FetchError<400, types.CryptoPerpLatestFuturesPricingResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.CryptoPerpLatestFuturesPricingResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  cryptoPerpLatestFuturesPricing(metadata: types.CryptoPerpLatestFuturesPricingMetadataParam): Promise<FetchResponse<200, types.CryptoPerpLatestFuturesPricingResponse200>> {
    return this.core.fetch('/v1beta1/crypto-perps/{loc}/latest/pricing', 'get', metadata);
  }

  /**
   * The latest orderbook endpoint returns the latest bid and ask orderbook for the crypto
   * perpetual futures symbols provided.
   *
   * @summary Latest orderbook
   * @throws FetchError<400, types.CryptoPerpLatestOrderbooksResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.CryptoPerpLatestOrderbooksResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  cryptoPerpLatestOrderbooks(metadata: types.CryptoPerpLatestOrderbooksMetadataParam): Promise<FetchResponse<200, types.CryptoPerpLatestOrderbooksResponse200>> {
    return this.core.fetch('/v1beta1/crypto-perps/{loc}/latest/orderbooks', 'get', metadata);
  }

  /**
   * The latest quotes endpoint returns the latest bid and ask prices for the crypto
   * perpetual futures symbols provided.
   *
   * @summary Latest quotes
   * @throws FetchError<400, types.CryptoPerpLatestQuotesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.CryptoPerpLatestQuotesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  cryptoPerpLatestQuotes(metadata: types.CryptoPerpLatestQuotesMetadataParam): Promise<FetchResponse<200, types.CryptoPerpLatestQuotesResponse200>> {
    return this.core.fetch('/v1beta1/crypto-perps/{loc}/latest/quotes', 'get', metadata);
  }

  /**
   * The latest trades endpoint returns the latest trade data for the crypto perpetual
   * futures symbols provided.
   *
   * @summary Latest trades
   * @throws FetchError<400, types.CryptoPerpLatestTradesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.CryptoPerpLatestTradesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  cryptoPerpLatestTrades(metadata: types.CryptoPerpLatestTradesMetadataParam): Promise<FetchResponse<200, types.CryptoPerpLatestTradesResponse200>> {
    return this.core.fetch('/v1beta1/crypto-perps/{loc}/latest/trades', 'get', metadata);
  }

  /**
   * The crypto bars API provides historical aggregates for a list of crypto symbols between
   * the specified dates.
   *
   * @summary Historical bars
   * @throws FetchError<400, types.CryptoBarsResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.CryptoBarsResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  cryptoBars(metadata: types.CryptoBarsMetadataParam): Promise<FetchResponse<200, types.CryptoBarsResponse200>> {
    return this.core.fetch('/v1beta3/crypto/{loc}/bars', 'get', metadata);
  }

  /**
   * The latest multi-bars endpoint returns the latest minute-aggregated historical bar data
   * for each of the crypto symbols provided.
   *
   * @summary Latest bars
   * @throws FetchError<400, types.CryptoLatestBarsResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.CryptoLatestBarsResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  cryptoLatestBars(metadata: types.CryptoLatestBarsMetadataParam): Promise<FetchResponse<200, types.CryptoLatestBarsResponse200>> {
    return this.core.fetch('/v1beta3/crypto/{loc}/latest/bars', 'get', metadata);
  }

  /**
   * The latest orderbook endpoint returns the latest bid and ask orderbook for the crypto
   * symbols provided.
   *
   * @summary Latest orderbook
   * @throws FetchError<400, types.CryptoLatestOrderbooksResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.CryptoLatestOrderbooksResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  cryptoLatestOrderbooks(metadata: types.CryptoLatestOrderbooksMetadataParam): Promise<FetchResponse<200, types.CryptoLatestOrderbooksResponse200>> {
    return this.core.fetch('/v1beta3/crypto/{loc}/latest/orderbooks', 'get', metadata);
  }

  /**
   * The latest quotes endpoint returns the latest bid and ask prices for the crypto symbols
   * provided.
   *
   * @summary Latest quotes
   * @throws FetchError<400, types.CryptoLatestQuotesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.CryptoLatestQuotesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  cryptoLatestQuotes(metadata: types.CryptoLatestQuotesMetadataParam): Promise<FetchResponse<200, types.CryptoLatestQuotesResponse200>> {
    return this.core.fetch('/v1beta3/crypto/{loc}/latest/quotes', 'get', metadata);
  }

  /**
   * The latest trades endpoint returns the latest trade data for the crypto symbols
   * provided.
   *
   * @summary Latest trades
   * @throws FetchError<400, types.CryptoLatestTradesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.CryptoLatestTradesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  cryptoLatestTrades(metadata: types.CryptoLatestTradesMetadataParam): Promise<FetchResponse<200, types.CryptoLatestTradesResponse200>> {
    return this.core.fetch('/v1beta3/crypto/{loc}/latest/trades', 'get', metadata);
  }

  /**
   * The crypto quotes API provides historical quote data for a list of crypto symbols
   * between the specified dates.
   *
   * @summary Historical quotes
   * @throws FetchError<400, types.CryptoQuotesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.CryptoQuotesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  cryptoQuotes(metadata: types.CryptoQuotesMetadataParam): Promise<FetchResponse<200, types.CryptoQuotesResponse200>> {
    return this.core.fetch('/v1beta3/crypto/{loc}/quotes', 'get', metadata);
  }

  /**
   * The snapshots endpoint returns the latest trade, latest quote, latest minute bar, latest
   * daily bar, and previous daily bar data for crypto symbols.
   *
   * @summary Snapshots
   * @throws FetchError<400, types.CryptoSnapshotsResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.CryptoSnapshotsResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  cryptoSnapshots(metadata: types.CryptoSnapshotsMetadataParam): Promise<FetchResponse<200, types.CryptoSnapshotsResponse200>> {
    return this.core.fetch('/v1beta3/crypto/{loc}/snapshots', 'get', metadata);
  }

  /**
   * The crypto trades API provides historical trade data for a list of crypto symbols
   * between the specified dates.
   *
   * @summary Historical trades
   * @throws FetchError<400, types.CryptoTradesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.CryptoTradesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  cryptoTrades(metadata: types.CryptoTradesMetadataParam): Promise<FetchResponse<200, types.CryptoTradesResponse200>> {
    return this.core.fetch('/v1beta3/crypto/{loc}/trades', 'get', metadata);
  }

  /**
   * The historical auctions endpoint provides auction prices for a list of stock symbols
   * between the specified dates.
   *
   * @summary Historical auctions
   * @throws FetchError<400, types.StockAuctionsResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockAuctionsResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockAuctions(metadata: types.StockAuctionsMetadataParam): Promise<FetchResponse<200, types.StockAuctionsResponse200>> {
    return this.core.fetch('/v2/stocks/auctions', 'get', metadata);
  }

  /**
   * The historical stock bars API provides aggregates for a list of stock symbols between
   * the specified dates.
   *
   * The returned results are sorted by symbol first, then by bar timestamp.
   * This means that you are likely to see only one symbol in your first response if there
   * are enough bars for that symbol to hit the limit you requested.
   *
   * In these situations, if you keep requesting again with the `next_page_token` from the
   * previous response, you will eventually reach the other symbols if any bars were found
   * for them.
   *
   * @summary Historical bars
   * @throws FetchError<400, types.StockBarsResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockBarsResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockBars(metadata: types.StockBarsMetadataParam): Promise<FetchResponse<200, types.StockBarsResponse200>> {
    return this.core.fetch('/v2/stocks/bars', 'get', metadata);
  }

  /**
   * The latest multi-bars endpoint returns the latest minute-aggregated historical bar data
   * for the ticker symbols provided.
   *
   * @summary Latest bars
   * @throws FetchError<400, types.StockLatestBarsResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockLatestBarsResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockLatestBars(metadata: types.StockLatestBarsMetadataParam): Promise<FetchResponse<200, types.StockLatestBarsResponse200>> {
    return this.core.fetch('/v2/stocks/bars/latest', 'get', metadata);
  }

  /**
   * Returns the mapping between the condition codes and names.
   *
   * @summary Condition codes
   * @throws FetchError<400, types.StockMetaConditionsResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockMetaConditionsResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockMetaConditions(metadata: types.StockMetaConditionsMetadataParam): Promise<FetchResponse<200, types.StockMetaConditionsResponse200>> {
    return this.core.fetch('/v2/stocks/meta/conditions/{ticktype}', 'get', metadata);
  }

  /**
   * Returns the mapping between the stock exchange codes and the corresponding exchanges
   * names.
   *
   * @summary Exchange codes
   * @throws FetchError<400, types.StockMetaExchangesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockMetaExchangesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockMetaExchanges(): Promise<FetchResponse<200, types.StockMetaExchangesResponse200>> {
    return this.core.fetch('/v2/stocks/meta/exchanges', 'get');
  }

  /**
   * The historical stock quotes API provides quote data for a list of stock symbols between
   * the specified dates.
   *
   * The returned results are sorted by symbol first, then by the quote timestamp.
   * This means that you are likely to see only one symbol in your first response if there
   * are enough quotes for that symbol to hit the limit you requested.
   *
   * In these situations, if you keep requesting again with the `next_page_token` from the
   * previous response, you will eventually reach the other symbols if any quotes were found
   * for them.
   *
   * @summary Historical quotes
   * @throws FetchError<400, types.StockQuotesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockQuotesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockQuotes(metadata: types.StockQuotesMetadataParam): Promise<FetchResponse<200, types.StockQuotesResponse200>> {
    return this.core.fetch('/v2/stocks/quotes', 'get', metadata);
  }

  /**
   * The latest multi-quotes endpoint provides the latest bid and ask prices for each given
   * ticker symbol.
   *
   * @summary Latest quotes
   * @throws FetchError<400, types.StockLatestQuotesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockLatestQuotesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockLatestQuotes(metadata: types.StockLatestQuotesMetadataParam): Promise<FetchResponse<200, types.StockLatestQuotesResponse200>> {
    return this.core.fetch('/v2/stocks/quotes/latest', 'get', metadata);
  }

  /**
   * The snapshot endpoint for multiple tickers provides the latest trade, latest quote,
   * minute bar, daily bar, and previous daily bar data for each given ticker symbol.
   *
   * @summary Snapshots
   * @throws FetchError<400, types.StockSnapshotsResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockSnapshotsResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockSnapshots(metadata: types.StockSnapshotsMetadataParam): Promise<FetchResponse<200, types.StockSnapshotsResponse200>> {
    return this.core.fetch('/v2/stocks/snapshots', 'get', metadata);
  }

  /**
   * The historical stock trades API provides trade data for a list of stock symbols between
   * the specified dates.
   *
   * The returned results are sorted by symbol first then by trade timestamp.
   * This means that you are likely to see only one symbol in your first response if there
   * are enough trades for that symbol to hit the limit you requested.
   *
   * In these situations, if you keep requesting again with the `next_page_token` from the
   * previous response, you will eventually reach the other symbols if any trades were found
   * for them.
   *
   * @summary Historical trades
   * @throws FetchError<400, types.StockTradesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockTradesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockTrades(metadata: types.StockTradesMetadataParam): Promise<FetchResponse<200, types.StockTradesResponse200>> {
    return this.core.fetch('/v2/stocks/trades', 'get', metadata);
  }

  /**
   * The latest multi-trades endpoint provides the latest historical trade data for the given
   * ticker symbols.
   *
   * @summary Latest trades
   * @throws FetchError<400, types.StockLatestTradesResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockLatestTradesResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockLatestTrades(metadata: types.StockLatestTradesMetadataParam): Promise<FetchResponse<200, types.StockLatestTradesResponse200>> {
    return this.core.fetch('/v2/stocks/trades/latest', 'get', metadata);
  }

  /**
   * The historical auctions endpoint provides auction prices for the given stock symbol
   * between the specified dates.
   *
   * @summary Historical auctions (single)
   * @throws FetchError<400, types.StockAuctionSingleResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockAuctionSingleResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockAuctionSingle(metadata: types.StockAuctionSingleMetadataParam): Promise<FetchResponse<200, types.StockAuctionSingleResponse200>> {
    return this.core.fetch('/v2/stocks/{symbol}/auctions', 'get', metadata);
  }

  /**
   * The historical stock bars API provides aggregates for the stock symbol between the
   * specified dates.
   *
   * @summary Historical bars (single symbol)
   * @throws FetchError<400, types.StockBarSingleResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockBarSingleResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockBarSingle(metadata: types.StockBarSingleMetadataParam): Promise<FetchResponse<200, types.StockBarSingleResponse200>> {
    return this.core.fetch('/v2/stocks/{symbol}/bars', 'get', metadata);
  }

  /**
   * The latest stock bars endpoint returns the latest minute-aggregated historical bar for
   * the requested security.
   *
   * @summary Latest bar (single symbol)
   * @throws FetchError<400, types.StockLatestBarSingleResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockLatestBarSingleResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockLatestBarSingle(metadata: types.StockLatestBarSingleMetadataParam): Promise<FetchResponse<200, types.StockLatestBarSingleResponse200>> {
    return this.core.fetch('/v2/stocks/{symbol}/bars/latest', 'get', metadata);
  }

  /**
   * The historical stock quotes API provides quote data for a stock symbol between the
   * specified dates.
   *
   * @summary Historical quotes (single symbol)
   * @throws FetchError<400, types.StockQuoteSingleResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockQuoteSingleResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockQuoteSingle(metadata: types.StockQuoteSingleMetadataParam): Promise<FetchResponse<200, types.StockQuoteSingleResponse200>> {
    return this.core.fetch('/v2/stocks/{symbol}/quotes', 'get', metadata);
  }

  /**
   * The latest quotes endpoint provides the latest bid and ask prices for a given ticker
   * symbol.
   *
   * @summary Latest quote (single symbol)
   * @throws FetchError<400, types.StockLatestQuoteSingleResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockLatestQuoteSingleResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockLatestQuoteSingle(metadata: types.StockLatestQuoteSingleMetadataParam): Promise<FetchResponse<200, types.StockLatestQuoteSingleResponse200>> {
    return this.core.fetch('/v2/stocks/{symbol}/quotes/latest', 'get', metadata);
  }

  /**
   * The snapshot endpoint provides the latest trade, latest quote, minute bar, daily bar,
   * and previous daily bar data for a given ticker symbol.
   *
   * @summary Snapshot (single symbol)
   * @throws FetchError<400, types.StockSnapshotSingleResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockSnapshotSingleResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockSnapshotSingle(metadata: types.StockSnapshotSingleMetadataParam): Promise<FetchResponse<200, types.StockSnapshotSingleResponse200>> {
    return this.core.fetch('/v2/stocks/{symbol}/snapshot', 'get', metadata);
  }

  /**
   * The historical stock trades API provides trade data for a stock symbol between the
   * specified dates.
   *
   * @summary Historical trades (single symbol)
   * @throws FetchError<400, types.StockTradeSingleResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockTradeSingleResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockTradeSingle(metadata: types.StockTradeSingleMetadataParam): Promise<FetchResponse<200, types.StockTradeSingleResponse200>> {
    return this.core.fetch('/v2/stocks/{symbol}/trades', 'get', metadata);
  }

  /**
   * The latest trades endpoint provides the latest trade data for a given ticker symbol.
   *
   * @summary Latest trade (single symbol)
   * @throws FetchError<400, types.StockLatestTradeSingleResponse400> One of the request parameters is invalid. See the returned message for details.
   *
   * @throws FetchError<429, types.StockLatestTradeSingleResponse429> Too many requests. You hit the rate limit. Use the X-RateLimit-... response headers to
   * make sure you're under the rate limit.
   *
   */
  stockLatestTradeSingle(metadata: types.StockLatestTradeSingleMetadataParam): Promise<FetchResponse<200, types.StockLatestTradeSingleResponse200>> {
    return this.core.fetch('/v2/stocks/{symbol}/trades/latest', 'get', metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { CorporateActionsMetadataParam, CorporateActionsResponse200, CorporateActionsResponse400, CorporateActionsResponse429, CryptoBarsMetadataParam, CryptoBarsResponse200, CryptoBarsResponse400, CryptoBarsResponse429, CryptoLatestBarsMetadataParam, CryptoLatestBarsResponse200, CryptoLatestBarsResponse400, CryptoLatestBarsResponse429, CryptoLatestOrderbooksMetadataParam, CryptoLatestOrderbooksResponse200, CryptoLatestOrderbooksResponse400, CryptoLatestOrderbooksResponse429, CryptoLatestQuotesMetadataParam, CryptoLatestQuotesResponse200, CryptoLatestQuotesResponse400, CryptoLatestQuotesResponse429, CryptoLatestTradesMetadataParam, CryptoLatestTradesResponse200, CryptoLatestTradesResponse400, CryptoLatestTradesResponse429, CryptoPerpLatestBarsMetadataParam, CryptoPerpLatestBarsResponse200, CryptoPerpLatestBarsResponse400, CryptoPerpLatestBarsResponse429, CryptoPerpLatestFuturesPricingMetadataParam, CryptoPerpLatestFuturesPricingResponse200, CryptoPerpLatestFuturesPricingResponse400, CryptoPerpLatestFuturesPricingResponse429, CryptoPerpLatestOrderbooksMetadataParam, CryptoPerpLatestOrderbooksResponse200, CryptoPerpLatestOrderbooksResponse400, CryptoPerpLatestOrderbooksResponse429, CryptoPerpLatestQuotesMetadataParam, CryptoPerpLatestQuotesResponse200, CryptoPerpLatestQuotesResponse400, CryptoPerpLatestQuotesResponse429, CryptoPerpLatestTradesMetadataParam, CryptoPerpLatestTradesResponse200, CryptoPerpLatestTradesResponse400, CryptoPerpLatestTradesResponse429, CryptoQuotesMetadataParam, CryptoQuotesResponse200, CryptoQuotesResponse400, CryptoQuotesResponse429, CryptoSnapshotsMetadataParam, CryptoSnapshotsResponse200, CryptoSnapshotsResponse400, CryptoSnapshotsResponse429, CryptoTradesMetadataParam, CryptoTradesResponse200, CryptoTradesResponse400, CryptoTradesResponse429, FixedIncomeLatestPricesMetadataParam, FixedIncomeLatestPricesResponse200, FixedIncomeLatestPricesResponse400, FixedIncomeLatestPricesResponse429, LatestRatesMetadataParam, LatestRatesResponse200, LatestRatesResponse400, LatestRatesResponse429, LogosMetadataParam, LogosResponse200, LogosResponse400, LogosResponse429, MostActivesMetadataParam, MostActivesResponse200, MostActivesResponse400, MostActivesResponse429, MoversMetadataParam, MoversResponse200, MoversResponse400, MoversResponse429, NewsMetadataParam, NewsResponse200, NewsResponse400, NewsResponse429, OptionBarsMetadataParam, OptionBarsResponse200, OptionBarsResponse400, OptionBarsResponse429, OptionChainMetadataParam, OptionChainResponse200, OptionChainResponse400, OptionChainResponse429, OptionLatestQuotesMetadataParam, OptionLatestQuotesResponse200, OptionLatestQuotesResponse400, OptionLatestQuotesResponse429, OptionLatestTradesMetadataParam, OptionLatestTradesResponse200, OptionLatestTradesResponse400, OptionLatestTradesResponse429, OptionMetaConditionsMetadataParam, OptionMetaConditionsResponse200, OptionMetaConditionsResponse400, OptionMetaConditionsResponse429, OptionMetaExchangesResponse200, OptionMetaExchangesResponse400, OptionMetaExchangesResponse429, OptionSnapshotsMetadataParam, OptionSnapshotsResponse200, OptionSnapshotsResponse400, OptionSnapshotsResponse429, OptionTradesMetadataParam, OptionTradesResponse200, OptionTradesResponse400, OptionTradesResponse429, RatesMetadataParam, RatesResponse200, RatesResponse400, RatesResponse429, StockAuctionSingleMetadataParam, StockAuctionSingleResponse200, StockAuctionSingleResponse400, StockAuctionSingleResponse429, StockAuctionsMetadataParam, StockAuctionsResponse200, StockAuctionsResponse400, StockAuctionsResponse429, StockBarSingleMetadataParam, StockBarSingleResponse200, StockBarSingleResponse400, StockBarSingleResponse429, StockBarsMetadataParam, StockBarsResponse200, StockBarsResponse400, StockBarsResponse429, StockLatestBarSingleMetadataParam, StockLatestBarSingleResponse200, StockLatestBarSingleResponse400, StockLatestBarSingleResponse429, StockLatestBarsMetadataParam, StockLatestBarsResponse200, StockLatestBarsResponse400, StockLatestBarsResponse429, StockLatestQuoteSingleMetadataParam, StockLatestQuoteSingleResponse200, StockLatestQuoteSingleResponse400, StockLatestQuoteSingleResponse429, StockLatestQuotesMetadataParam, StockLatestQuotesResponse200, StockLatestQuotesResponse400, StockLatestQuotesResponse429, StockLatestTradeSingleMetadataParam, StockLatestTradeSingleResponse200, StockLatestTradeSingleResponse400, StockLatestTradeSingleResponse429, StockLatestTradesMetadataParam, StockLatestTradesResponse200, StockLatestTradesResponse400, StockLatestTradesResponse429, StockMetaConditionsMetadataParam, StockMetaConditionsResponse200, StockMetaConditionsResponse400, StockMetaConditionsResponse429, StockMetaExchangesResponse200, StockMetaExchangesResponse400, StockMetaExchangesResponse429, StockQuoteSingleMetadataParam, StockQuoteSingleResponse200, StockQuoteSingleResponse400, StockQuoteSingleResponse429, StockQuotesMetadataParam, StockQuotesResponse200, StockQuotesResponse400, StockQuotesResponse429, StockSnapshotSingleMetadataParam, StockSnapshotSingleResponse200, StockSnapshotSingleResponse400, StockSnapshotSingleResponse429, StockSnapshotsMetadataParam, StockSnapshotsResponse200, StockSnapshotsResponse400, StockSnapshotsResponse429, StockTradeSingleMetadataParam, StockTradeSingleResponse200, StockTradeSingleResponse400, StockTradeSingleResponse429, StockTradesMetadataParam, StockTradesResponse200, StockTradesResponse400, StockTradesResponse429 } from './types';
