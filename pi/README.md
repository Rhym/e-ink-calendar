# Raspberry Pi

## Installation

Install Chromium:

```bash
sudo apt-get install chromium-browser --yes
```

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

### Cron Jobs

The final part is to run the server at boot and the script every 15 minutes.

Firstly go to your root directory by typing:

```bash
cd /
```

Now we want to install a new Cron Job, or edit one we have already set up:

```bash
sudo crontab -e
```

At the end of the file that opens add the following lines:

```bash
15 * * * * /usr/bin/node /home/pi/Scripts/webpage.js
```

Every 15 minutes run your webpage.js script to take an image of a webpage, which you can subsequently point your eInk screen to load.
