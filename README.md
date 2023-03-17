# Spock Adapters

Spock adapters are basically a module that transforms raw on-chain data for the protocols on-boarded on
`Spock Analytics`.

You can also checkout our [detail documentation](https://spock-analytics.gitbook.io/spock-analytics-docs/adapter/adapter)



## Adapter Structure

```js
type Adapter = {
  appKey: string;
  transformers?: Record<Chain, Array<Transformer>>;
  tvlExtractors?: Record<Chain, Array<TvlExtractor>>;
};
```
| Property                | Type    | Description                                                 |
| ------------------------| --------| ------------------------------------------------------------|
|  appKey                 | required | Unique identity given to each application created on `Spock Analytics`.|
|  transformers           | required | The contracts with events through which Spock extracts on-chain data. So each transformer basically belongs to a contract.|
|  tvlExtractors          | required | Functions that extract tvl from contracts.|


## Transformer Structure

```js
type Transformer = {
 address?:string;
 getAddresses?:(chain:Chain) => Promise<Array<string>>;
 contract: Interface;
 eventHandlers: Record<Signature,EventHandler>;
 startBlock:number;
}
```

| Property                | Type    | Description                                                 |
| ------------------------| --------| ------------------------------------------------------------|
|  address                | optioal | Contract address, if undefined will sync all the events of given signatures in event handlers.|
|  getAddresses           | optioal | If you have a mapping of contract addresses and want to sync events for all those addresses you can use it.|
|  contract               | required | The interface of contract generated by typechain through contract ABI.|
|  eventHandlers          | required | It's the key value object in which the key is the signature (keccak256 hash of event topic) of the event and the value is the callback function that will be executed when the event gets fired. |
|  startBlock      | required | Block number from which the syncing of contract events will start.|


## TvlExtractor Structure

```js
type TvlExtractor = {
  category: TVL_Category;
  startBlock: number;
  extractor: (chain: Chain, block: number, timestamp: number, cache?: LogsCache) => Promise<Record<string, string>>;
};
```
| Property                | Type    | Description                                                 |
| ------------------------| --------| ------------------------------------------------------------|
|  category               | required | Category in whcih the TVL is classified.|
|  extractor              | required | A function that calculate and return balances of asset locked in a protocol.|
|  startBlock             | required | Block number from which the syncing of TVL wll start.|

## How to create an adapter

### Repo setup

1.  Fork the repo.
2.  Install dependencies by `yarn install`.
3.  Prepare adapters through `yarn prepare`.
4.  Create new branch like `PROJECT_NAME/feat or fix/message`.
5.  Push the code on that branch.
6.  Create PR for the `main` branch.

### Project directory setup

1. Create a directory with the name of your project inside the `projects` directory.
2. Add contract ABI's inside abis forlder
3. Generate types by `yarn generate PROJECT_NAME`.
4. Create other required files.

```js
projects
├── [PROJECT_NAME]
│   └── abis
│   │   ├── contract1.json
│   │   └── contract2.json
│   ├── types
│   ├── index.test.ts
│   ├── index.ts
|   ├── tvl.ts
│   └── utils.ts
└── index.ts
```

### Code adapter

1. Write handlers for all the events that are responsible for the `contribution` and `extraction` of value from protocol
   inside index.ts and return that adapter.
2. Write all the helping code inside `utils` of your project.
3. In case need to create some helper functions that are not specific to your project and can also be used by other
   projects should be placed inside main `utils` directory.
4. Write tvl computation code in `tvl.ts`.

### Test adapter

In the end, write unit testing of the adapter for all events with complete scenarios. In order to validate the
transformation logic of event handlers. And run `yarn test PROJECT_NAME` to run adapter tests.
