import sys; import os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_lib"))
from lumo_audio import Audio
import numpy as np
a = Audio(12.0, seed=5); a.bed()
a.chime(1.0, [79, 84], .08, .08)
a.sweep(2.0, 200, 1800, 4.0, .06, trem=.3)                    # stars pulled in
for i, t in enumerate(np.arange(2.2, 5.4, .13)): a.pluck(t, 72 + (i * 3) % 13, .1, .04)
a.sweep(4.6, 90, 70, 1.8, .05, trem=.8)                       # strain wobble
a.noise(6.45, .5, .4, .4); a.sweep(6.4, 3000, 120, .5, .12)    # pop!
a.chime(6.5, [96, 91, 88, 84, 79, 76], .06, .1)
for i, m in enumerate([72, 76, 79, 84]): a.marimba(8.0 + i * .22, m, 1.2, .08)
a.save(sys.argv[1])
