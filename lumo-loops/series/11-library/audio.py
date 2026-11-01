import sys; import os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_lib"))
from lumo_audio import Audio
import numpy as np
a = Audio(12.0, seed=11); a.bed()
for i, t in enumerate(np.arange(1.0, 2.0, .25)): a.pluck(t, 48 + (i % 2) * 7, .15, .08)     # steps
a.sweep(2.4, 700, 300, .7, .05); a.marimba(3.05, 36, .8, .16); a.noise(3.05, .2, .3, .3)        # thud + dust
a.marimba(3.1, 77, .5, .1); a.marimba(3.25, 83, .8, .1)                                        # owl wakes
for i, t in enumerate(np.arange(3.4, 6.6, .12)): a.noise(t, .03, .12, .7)                      # pages flutter
a.sweep(3.4, 400, 1800, 3.2, .04, trem=.5)
for i, t in enumerate(np.arange(5.3, 7.4, .06)): a.pluck(t, 52 + (i % 4), .05, .05)           # receipt printer
a.marimba(6.5, 79, .5, .08); a.marimba(6.65, 70, .9, .1)                                       # oh no
a.noise(8.25, .08, .4, .4); a.marimba(8.25, 43, .6, .16)                                       # stamp
a.chime(8.5, [84, 88, 91, 96], .06, .11)                                                       # approved
a.sweep(9.2, 500, 900, 1.0, .04); a.marimba(10.3, 72, .7, .08)
a.sweep(10.9, 1500, 500, .8, .04)
a.save(sys.argv[1])
