SensorWatch Server & Web Monitor
================================

SensorWatch server for data collection & web monitor for data visualization.

Requirements
------------

 * MongoDB (package `mongodb`)
 * Node.js (package `nodejs`)

Installation
------------

1. Clone project: `git clone <url>`
2. Install dependencies: `npm install`

Usage
-----

Be sure to specify a custom secret token for security reasons. This should then be used by every client to post updates.

For deployment, specify this in your environment variables. For development, you can do:

`SENSORWATCH_SECRET=123456 node index.js`
