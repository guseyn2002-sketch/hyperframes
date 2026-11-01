import sys; import os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_lib"))
from lumo_audio import Audio
a = Audio(12.0, seed=1); a.bed()
a.chime(1.1, [88, 91], .08, .07)                 # cursor appears
for c, m in [(2.0, 52), (2.7, 70), (3.4, 72), (4.2, 74), (5.0, 76), (5.8, 79), (7.0, 84)]:
    a.noise(c, .04, .22, .6); a.pluck(c + .01, m, .25, .1)      # clicks
a.sweep(2.05, 700, 160, .5, .1)                  # oops: wrong tile
a.sweep(2.72, 300, 900, .3, .06)                 # unclick
for i in range(10): a.pluck(7.2 + i * .1, 60 + (i % 5) * 3, .12, .05)   # loading ticks
a.chime(8.3, [84, 88, 91, 96, 100], .05, .12); a.marimba(8.3, 60, 1.4, .1)
for i, m in enumerate([72, 79, 84]): a.marimba(8.9 + i * .22, m, 1.0, .08)
a.sweep(10.3, 900, 300, 1.0, .05)
a.save(sys.argv[1])
