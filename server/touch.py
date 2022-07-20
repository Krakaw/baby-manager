import signal
import time
import requests
import touchphat
import datetime
import os



leds = ['Back', 'A', 'B', 'C', 'D', 'Enter']
shutdown = -1

@touchphat.on_touch(['Back'])
def handle_back(event):
    global shutdown
    if shutdown >= 6:
        touchphat.all_off()
        time.sleep(2)
        os.system("sudo shutdown -h now")
    else:
        shutdown = shutdown + 1
        touchphat.set_led('Back', True)
        touchphat.set_led(leds[shutdown], True)


@touchphat.on_touch(['A'])
def handle_start(event):
    playbook = "Bedtime"
    if use_night_mode():
        playbook += "Night"
    send_request('start', playbook, 'A')

@touchphat.on_touch(['B'])
def handle_start(event):
    send_request('start', 'Short', 'B')

@touchphat.on_touch(['C'])
def handle_start(event):
    send_request('start', 'WhiteNoise', 'C')


@touchphat.on_touch(['Enter'])
def handle_stop(event):
    send_request('stop', '', 'Enter')


def send_request(endpoint, name, pad):
    global shutdown
    shutdown = -1
    try:
        r = requests.post('http://localhost:3000/playbooks/' + endpoint, json={'name': name}, timeout=2)
        if r.status_code == 200:
            flash([pad])
            touchphat.set_led('A', endpoint == 'stop')
        else:
            flash(['Back', 'A', 'B', 'C', 'D', 'Enter'])
    except:
        flash(['Back', 'A', 'B', 'C', 'D', 'Enter'])
    night_off()


def flash(pads):
    if not is_night():
        for i in range(10):
            for pad in pads:
                touchphat.set_led(pad, True)
            time.sleep(0.1)
            for pad in pads:
                touchphat.set_led(pad, False)
            time.sleep(0.1)


def is_night(night=18, morning=7 ):
    now = datetime.datetime.now()
    today_night = now.replace(hour=night, minute=0, second=0, microsecond=0)
    today_morning = now.replace(hour=morning, minute=0, second=0, microsecond=0)
    return now > today_night or now < today_morning


def use_night_mode():
    return is_night(night=20, morning=7)


def night_off():
    if is_night():
        touchphat.all_off()


print("""
Baby Goes What Touch Started...
Press A to start Bedtime routine
Press D to end Bedtime routine
Press Ctrl+C to exit!
""")

if not is_night():
    flash(['Back', 'A', 'B', 'C', 'D', 'Enter'])
    touchphat.set_led('A', True)

night_off()

signal.pause()
