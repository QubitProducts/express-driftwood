# express-driftwood

A tiny piece of express middleware for logging requests using [QubitProducts/driftwood](driftwood).


### Installation

```
npm i driftwood express-driftwood
```


### Usage

Just call `express-driftwood` with an instance of driftwood and mount it in your express app before everything else:

```js
const createLogger = require('driftwood')
const expressLogger = require('./index')
const express = require('express')

createLogger.enable({ '*': 'trace' })

const log = createLogger('my-app')
const app = express()

app.use(expressLogger(log))
app.get('/', (req, res) => res.send('Wooo!'))
app.get('/400', (req, res) => res.status(400).send('You dun goofed'))
app.get('/500', (req, res) => res.status(500).send('We dun goofed'))

app.listen(1119, () => {
  log.info('my-app started!')
})
```
