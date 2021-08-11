#!/usr/bin/python
# -*- coding:utf-8 -*-
import sys
import os
picdir = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'pic')
libdir = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'lib')
if os.path.exists(libdir):
    sys.path.append(libdir)

import logging
from waveshare_epd import epd7in5b_V2
import time
from PIL import Image,ImageDraw,ImageFont
import traceback

logging.basicConfig(level=logging.DEBUG)

try:
    epd = epd7in5b_V2.EPD()

    logging.info("init and clear screen")
    epd.init()
    epd.Clear()

    logging.info("render image")
    BlackImage = Image.open(os.path.join(picdir, 'eink.jpg'))
    RedImage = Image.new('1', (0, 0), 255)
    epd.display(epd.getbuffer(BlackImage),epd.getbuffer(RedImage))
    time.sleep(2)

    logging.info("sleep")
    epd.sleep()

except IOError as e:
    logging.info(e)

except KeyboardInterrupt:
    logging.info("ctrl + c:")
    epd7in5b_V2.epdconfig.module_exit()
    exit()
