import sys; import os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_lib"))
from lumo_audio import Audio
import numpy as np
a = Audio(12.0, seed=8); a.bed()
a.sweep(0.8, 300, 200, .6, .05)                              # doors close
a.marimba(1.5, 72, .6, .09)                                  # ding
a.sweep(1.9, 90, 130, 6.0, .04, trem=.2)                     # motor hum
# lounge "elevator music": soft marimba arpeggios
for i, m in enumerate([60, 64, 67, 71, 67, 64, 60, 64, 67, 72, 67, 64, 62, 65, 69, 72, 69, 65]): a.marimba(2.0 + i * .33, m + 12, .5, .06)
def sm(u): return .5 - .5 * np.cos(np.pi * u)
for lvl in [1, 2, 3, 4, 5]:                                  # floor dings when the cabin passes
    for t in np.arange(1.9, 7.9, .005):
        if sm((t - 1.9) / 6.0) * 5.4 >= lvl - .1: a.marimba(t, 84, .5, .09); break
a.marimba(8.0, 91, .7, .1); a.marimba(8.0, 84, 1.0, .08); a.sweep(8.5, 300, 160, .6, .05)  # doors open
a.chime(8.9, [84, 88, 91], .1, .09)                          # hello moon
a.sweep(9.7, 160, 300, .6, .05); a.sweep(9.6, 130, 90, 2.0, .04, trem=.2); a.marimba(11.6, 72, .6, .08)
a.save(sys.argv[1])
