import sys; import os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_lib"))
from lumo_audio import Audio
import numpy as np
a = Audio(12.0, seed=4); a.bed()
lands = [1.9, 3.0, 4.1, 6.0, 7.7, 8.6, 9.5, 10.4]
spawns = [0.9, 2.0, 3.1, 5.0, 6.9, 7.8, 8.7, 9.6]
for s, l in zip(spawns, lands):
    for i, t in enumerate(np.arange(s + .1, l, .22)): a.pluck(t, 79 + (i % 2) * 2, .08, .04)     # falling ticks
    a.noise(l, .06, .24, .5); a.marimba(l, 48, .4, .14)                                         # land
for c, nn in [(4.6, [84, 88, 91, 96]), (6.5, [84, 88, 91, 96]), (11.0, [84, 88, 91, 96, 100, 103])]:
    a.sweep(c - .1, 500, 2400, .5, .06); a.chime(c, nn, .06, .12); a.marimba(c, 60, 1.2, .1)
a.save(sys.argv[1])
