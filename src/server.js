import Express from 'express';
import bodyParser from 'body-parser';
import request from 'request';

// Webpack Requirements
import webpack from 'webpack';
import config from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import formatResponse from './response';

// Initialize the Express App
const serverPort = 3990;
const app = new Express();

if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.get('/', (req, res) => {
  res.send(`
    <!Doctype html>
    <html>
      <head>
        <title>Test Your Messenger Bot</title>
      </head>
      <body>
        <div id="root"></div>
        <script src="bundle.js"></script>
      </body>
    </html>
    `);
});

app.get('/webhook/', (req, res) => {
  if (req.query['hub.verify_token'] === 'rob_the_r_score_god') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

function sendTextMessage(sender, text, stickerId) {
  request(formatResponse(sender, text, stickerId), (error, response) => {
    if (error) {
      console.log('Error sending message: ', error); // eslint-disable-line
    } else if (response.body.error) {
      console.log('Error: ', response.body.error); // eslint-disable-line
    }
  });
}

function sendTestRespond(sender, text, res) {
  res.json(formatResponse({ text }, sender));
}

app.post('/webhook/', (req, res) => {
  const messagingEvents = req.body.entry[0].messaging;

  for (let i = 0; i < messagingEvents.length; i++) {
    const event = req.body.entry[0].messaging[i];
    console.log(event);
    const sender = event.sender.id;
    if (event.message.attachments) {
      sendTextMessage(sender, '', event.message.sticker_id);
      res.sendStatus(200);
    }
    if (event.message && event.message.text) {
      const text = event.message.text;
      if (process.env.NODE_ENV !== 'production') {
        sendTestRespond(sender, text.substring(0, 200), res);
      } else {
        sendTextMessage(sender, text.substring(0, 200));
        res.sendStatus(200);
      }
    }
  }
});

app.listen(serverPort, (err) => {
  if (!err) {
    console.log(`Server running on port ${serverPort}`); // eslint-disable-line
  }
});
