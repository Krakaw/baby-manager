import signal
import time
import requests
import touchphat

print("""
Touch pHAT: Buttons Demo
Lights up each LED in turn, then detects your button presses.
Press a button to see the corresponding LED light up, and the name printed.
Press Ctrl+C to exit!
""")

for pad in ['Back','A','B','C','D','Enter']:
    touchphat.set_led(pad, True)
    time.sleep(0.1)
    touchphat.set_led(pad, False)
    time.sleep(0.1)

@touchphat.on_touch(['Back','A', 'B','C','D','Enter'])
def handle_touch(event):
    if (event.name == 'A'):
        requests.post('http://localhost:3000/playbooks/start', json={'name': 'Bedtime'})
    if (event.name == 'B'):
        requests.post('http://localhost:3000/playbooks/stop', json={'name': 'Bedtime'})
    print(event.name)

signal.pause()
