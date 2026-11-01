import sys; import os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_lib"))
from lumo_audio import Audio
import numpy as np
a = Audio(12.0, seed=12); a.bed(melody=[79, 83, 86, 91, 86, 83, 79, 76, 79, 83, 88, 83])
a.chime(0.8, [84, 88], .08, .07)
a.sweep(2.0, 200, 2200, 1.4, .08, trem=.3); a.chime(2.4, [84, 88, 91, 96, 100], .07, .12)
for i, t in enumerate(np.arange(3.4, 9.8, .5)): a.marimba(t, [84, 88, 91, 96, 91, 88][i % 6], .9, .07)     # twinkling
a.sweep(10.0, 2000, 300, 1.3, .06)
a.save(sys.argv[1])
