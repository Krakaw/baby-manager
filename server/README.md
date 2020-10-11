# Baby Goes What Home

### Hardware build

[Pi Zero](https://www.pishop.co.za/store/raspberry-pi-zero-wireless-wh-pre-soldered-header) The core component to run the server

[Touch Phat](https://www.pishop.co.za/store/touch-phat?keyword=touch&category_id=0) Touch interface to trigger the playbooks

[USB Sound Card](https://www.pishop.co.za/store/usb-audio-inputoutput-dongle?keyword=usb%20speaker&category_id=0) If you want to use a cabled speaker

[Bluetooth Speaker](https://www.takealot.com/everlotus-bluetooth-cube-speaker-green/PLID46853253) Speaker with bluetooth and 3.5mm jack

[Power Bank](https://www.takealot.com/adata-20-000-mah-power-bank-black/PLID46639321) Make it mobile

### Installing

Touch service

```bash
# Make sure this dir is correct in the touch.service file
cat ./scripts/systemd/touch.service | sed  "s~/home/ubuntu/baby_goes_what_home/server~$PWD~" | sudo tee /etc/systemd/system/touch.service > /dev/null
sudo systemctl enable touch.service
sudo systemctl start touch.service
```

API Service

```bash
# Make sure this dir is correct in the baby-goes-what.service file
cat ./scripts/systemd/baby-goes-what.service | sed  "s~/home/ubuntu/baby_goes_what_home/server~$PWD~" | sudo tee /etc/systemd/system/baby-goes-what.service > /dev/null 
sudo systemctl enable baby-goes-what.service
sudo systemctl start baby-goes-what.service
```
