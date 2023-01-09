# Spock Adapters

Spock adapters are basically a module that transforms raw on-chain data for the protocols on-boarded on
`Spock Analytics`.

## Adapter Structure

```js
type Adapter = {
  appKey: string,
  transformers: Record<Chain, Transformer>,
};
```

- `appKey`: unique identity is given to each application created in `Spock Analytics`.
- `transformers`: are contracts with events through which Spock extracts on-chain data. So each transformer basically
  belongs to a contract.

## Transformer Structure

```js
type Transformer = {
 address?:string;
 getAddresses?:(chain:Chain) => Promise<string[]>
 contract: Interface;
 eventHandlers: Record<Signature,Handler>
 startBlock:number;
}
```

- `address`: of contract which has to sync, it's optional so in the case when no address will given, the transformer
  will sync all the possible events of the given contract interface.

- `getAddresses`: a funcion to get all addresses of contract used in transformer. It's useful when you have more than
  one contracts of same interface and you want to sync them universally.

- `interface`: obtained from contract ABI.

- `eventHandlers`: are the functions w.r.t to event signature that process event data.

- `startBlock`: from which the syncing of that contract should start.

## How to create an adapter

### Repo setup

1.  Clone the repo.
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
│   ├── index.ts
│   ├── index.test.ts
│   └── utils.ts
└── index.ts
```

### Code adapter

1. Write handlers for all the events that are responsible for the `contribution` and `extraction` of value from protocol
   inside index.ts and return that adapter.
2. Write all the helping code inside utils of your project.
3. In case need to create some helper functions that are not specific to your project and can also be used by other
   projects should be placed inside main `utils` directory.

### Test adapter

In the end, write unit testing of the adapter for all events with complete scenarios. In order to validate the
transformation logic of event handlers. And run `yarn test PROJECT_NAME` to run adapter tests.
