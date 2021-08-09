# Raspberry Pi

## Installation

Install Node:

```bash
curl -sL https://deb.nodesource.com/setup_16.6.1 | sudo -E bash -
```

The next step is to install it:

```bash
sudo apt install nodejs
```

Check Node is installed:

```bash
node -v
```

This will tell you the version of Node you are running. You have installed Node, well done, now for the Puppeteer library.

### Installing and Configuring Puppeteer

Puppeteer is a library for Node.js that allows for the control of the Chrome browser in headless mode (i.e. you don't see it happening). This allows you to open a web page, do something with it – in our case take a screenshot – and then close chrome, all via a simple script.

Installing <https://github.com/puppeteer/puppeteer|Puppeteer> is all via a single line in the terminal:

```bash
npm i puppeteer --save
```

Now you have Node.js and Puppeteer installed, all you need now is to create a script to tell Node what to do:

We like to start a new script in a new directory called ‘Scripts’ (although it can be anywhere).

So firstly create a new directory via the terminal:

```bash
mkdir Scripts
```

Now create your first empty script, we are going to call ours `webpage.js`:

```bash
sudo nano webpage.js
```

Below is the javascript to cut and paste into your new script:

```javascript
const puppeteer = require('puppeteer');

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
 
(async () => {
    let browser = await puppeteer.launch({headless: true, executablePath: '/usr/bin/chromium-browser'});
    const page = await browser.newPage();
    await page.goto('http:YourWebPageURL');

    // 5 second timeout: allows the page to fully render before taking the screenshot
    await timeout(5000);
    
    // Set your screen size
    await page.setViewport({ width: 800, height: 480}); 
    await page.screenshot({path: '/home/pi/Scripts/eink.jpg'});
    await browser.close();
})();
```

The main parts to note above are the http: where you need to add in the webpage you want to capture and the width and height of the page. This should be changed according to the resolution of your screen, the InkPlate 6 runs at 800×600 resolution.

To run the script:

```bash
node webpage.js
```

The script opens the URL, waits 5 seconds for it to fully load and then saves a screenshot as a jpg to the location of your choice.

If you are running your eInk display direct from your Pi (such as using a Waveshare screen) you can stop here and point your display to the new image. If however, you are using a screen elsewhere on your network you will need to host it, this is where Node Express comes in.

### Installing Node Express

As with Node and Puppeteer installing is via a simple one line command:

```bash
npm install express --save
```

To start the server and host the image, you need another script. So the same as before, create a script, we called ours server.js:

```bash
sudo nano server.js
```

Cut and paste the following:

```javascript
var express = require('express');
var app = express();
var path = require('path');
var public = path.join(__dirname, 'public');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(public, 'index.html'));
});
app.use('/', express.static(public));
app.listen(8080);
```

The above script runs a server at http://localhost:8080 where you can install a welcome page (index.html) if you wish but more importantly you can serve static files, in our case our screen grab eink.jpg. Note that the folder address is ‘public’ this is where you will host your files.

In our first script we now want to edit the folder where our image is saved, so we can host it as soon as it is created, so simply edit the file, (again using sudo nano webpage.js) to include the ‘public’ directory -ie /home/pi/Scripts/public/eink.jpg

If you now go to either http://localhost:8080/eink.jpg on the host machine or your http://Your IP of the PI:8080/eink.jpg you should be able to view the jpg.

All that needs to be done now is to start the server when the Pi boots and to run the webpage script every set period of time. To load different webpages simply clone the webpage.js script but with a different URL to grab and run it at a different time, as mentioned, we run 4 scripts an hour via cron jobs.

### Cron Jobs

The final part is to run the server at boot and the script every 15 minutes.

Firstly go to your root directory by typing:

```bash
cd:
```

Now we want to install a new Cron Job, or edit one we have already set up:

```bash
sudo crontab -e
```

At the end of the file that opens add the following lines:

```bash
@reboot sudo /usr/bin/node /home/pi/Scripts/server.js
15 * * * * /usr/bin/node /home/pi/Scripts/webpage.js
```

Whenever the Pi reboots it will now start the server – via your `server.js` script and every 15 minutes run your webpage.js script to take an image of a webpage, which you can subsequently point your eInk screen to load.

It may feel like a number of hoops to jump through for a simple screen-grab, but once running it opens up the wider world of Node.js and Puppeteer as well as the ability to use your eInk screen to display any webpage you want.
