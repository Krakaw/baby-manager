import signal
import time
import requests
import touchphat
import datetime


@touchphat.on_touch(['A'])
def handle_start(event):
    send_request('start', 'Bedtime', 'A')


@touchphat.on_touch(['D'])
def handle_stop(event):
    send_request('stop', 'Bedtime', 'D')


def send_request(endpoint, name, pad):
    try:
        r = requests.post('http://localhost:3000/playbooks/' + endpoint, json={'name': name}, timeout=2)
        if r.status_code == 200:
            flash([pad])
            touchphat.set_led('A', True)
        else:
            flash(['Back', 'A', 'B', 'C', 'D', 'Enter'])
    except:
        flash(['Back', 'A', 'B', 'C', 'D', 'Enter'])
    night_off()


def flash(pads):
    for i in range(10):
        for pad in pads:
            touchphat.set_led(pad, True)
        time.sleep(0.1)
        for pad in pads:
            touchphat.set_led(pad, False)
        time.sleep(0.1)


def is_night():
    now = datetime.datetime.now()
    today6pm = now.replace(hour=18, minute=0, second=0, microsecond=0)
    today7am = now.replace(hour=7, minute=0, second=0, microsecond=0)
    return now > today6pm or now < today7am


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
