import sys; import os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_lib"))
from lumo_audio import Audio
a = Audio(12.0, seed=3); a.bed()
a.sweep(1.0, 1800, 400, 1.2, .05)                       # piece falls from the sky
a.marimba(2.2, 67, .6, .1)                              # caught
a.sweep(3.0, 500, 1500, 1.0, .06)                       # thrown
a.noise(4.0, .08, .3, .5); a.marimba(4.0, 72, .5, .14)   # click!
a.chime(4.05, [84, 88, 91, 96], .06, .12)
a.sweep(4.1, 600, 2600, .9, .05, trem=.3)               # shine sweep
a.sweep(5.3, 300, 1400, 1.4, .06, trem=.25)             # moon rises
for i, m in enumerate([79, 84, 88, 91]): a.marimba(6.0 + i * .25, m, 1.4, .09)
a.sweep(10.2, 400, 1800, 1.3, .05)
a.save(sys.argv[1])
