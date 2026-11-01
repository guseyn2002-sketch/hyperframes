import sys; import os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_lib"))
from lumo_audio import Audio
a = Audio(12.0, seed=6); a.bed()
a.chime(0.9, [84, 88], .08, .07)
for i, ta in enumerate([2.4, 3.9, 5.4, 6.9]):
    a.sweep(ta - .9, 300, 1300, .9, .05)                  # whoosh in
    a.marimba(ta, 60 + i * 4, .9, .12); a.noise(ta, .05, .2, .5)    # plop
a.sweep(7.8, 1500, 500, 1.2, .05); a.chime(8.5, [91, 96, 100], .08, .1)  # Wisp licks
for i, ta in enumerate([9.6, 10.0, 10.4, 10.8]): a.sweep(ta, 400, 1800, .8, .04); a.marimba(ta + .8, 84 - i * 3, .6, .06)
a.save(sys.argv[1])
