import sys; import os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_lib"))
from lumo_audio import Audio
import numpy as np
a = Audio(12.0, seed=2); a.bed()
a.chime(1.6, [84, 88], .08, .07)
# zip up (3.0-6.4): rapid ratchet ticks rising in pitch
for i, t in enumerate(np.arange(3.0, 6.4, .045)): a.noise(t, .02, .1, .6)
a.sweep(3.0, 500, 2400, 3.4, .04, trem=.4)
a.chime(6.4, [84, 88, 91, 96], .06, .11)            # closed: star-night sealed -> wait, sky opened by zip-down
# zip down (9.0-11.2)
for i, t in enumerate(np.arange(9.0, 11.2, .05)): a.noise(t, .02, .1, .6)
a.sweep(9.0, 2400, 500, 2.2, .04, trem=.4)
a.marimba(11.3, 67, 1.0, .08)
a.save(sys.argv[1])
