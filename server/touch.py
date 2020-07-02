import signal
import time
import requests
import touchphat


for pad in ['Back','A','B','C','D','Enter']:
    touchphat.set_led(pad, True)
    time.sleep(0.1)
    touchphat.set_led(pad, False)
    time.sleep(0.1)

@touchphat.on_touch(['D'])
def handle_stop(event):
    requests.post('http://localhost:3000/playbooks/stop', json={'name': 'Bedtime'})
    flash('D')


@touchphat.on_touch(['A'])
def handle_start(event):
    requests.post('http://localhost:3000/playbooks/start', json={'name': 'Bedtime'})
    flash('A')


def flash(pad):
    for i in range(10):
        touchphat.set_led(pad, True)
        time.sleep(0.1)
        touchphat.set_led(pad, False)
        time.sleep(0.1)
    touchphat.set_led(pad, False)


signal.pause()
