#!/bin/bash
ffmpeg -y -c:v png -f image2pipe -r 25  -i - -c:v libx264 -pix_fmt yuv420p -movflags +faststart
