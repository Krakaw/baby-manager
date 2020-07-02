import signal
import time
import requests
import touchphat

print("""
Baby Goes What Touch Started...
Press A to start Bedtime routine
Press B to end Bedtime routine
Press Ctrl+C to exit!
""")

for pad in ['Back','A','B','C','D','Enter']:
    touchphat.set_led(pad, True)
    time.sleep(0.1)
    touchphat.set_led(pad, False)
    time.sleep(0.1)

touchphat.set_led('A', True)

@touchphat.on_touch(['A'])
def handle_start(event):
    try:
        r = requests.post('http://localhost:3000/playbooks/start', json={'name': 'Bedtime'}, timeout=2)
        print(r)
        if r.status_code == 200:
            flash(['A'])
        else:
            flash(['Back','A','B','C','D','Enter'])
    except:
        flash(['Back','A','B','C','D','Enter'])

@touchphat.on_touch(['D'])
def handle_stop(event):
    try:
        r = requests.post('http://localhost:3000/playbooks/stop', json={'name': 'Bedtime'}, timeout=2)
        if r.status_code == 200:
            flash(['D'])
            touchphat.set_led('A', True)
        else:
            flash(['Back','A','B','C','D','Enter'])
    except:
        flash(['Back','A','B','C','D','Enter'])

def flash(pads):
    for i in range(10):
        for pad in pads:
            touchphat.set_led(pad, True)
        time.sleep(0.1)
        for pad in pads:
            touchphat.set_led(pad, False)
        time.sleep(0.1)


signal.pause()
