import sys; import os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_lib"))
from lumo_audio import Audio
a = Audio(12.0, seed=7); a.bed()
for i, t in enumerate([.9, 1.4, 1.9, 2.4, 2.9]): a.pluck(t, 60 + i * 2, .2, .06)    # counting
for i, t in enumerate([1.2, 1.55, 1.9, 2.25, 2.6]): a.sweep(t, 1500, 500, .5, .04); a.noise(t + .45, .06, .1, .4)
for i, tf in enumerate([4.2, 5.4, 6.6, 7.8]):
    a.sweep(tf - .5, 300, 700, .4, .04)
    a.chime(tf, [84 + i, 88 + i, 91 + i], .06, .1); a.sweep(tf, 500, 1800, .6, .04)
a.sweep(8.7, 400, 200, .6, .05); a.marimba(9.3, 77, .5, .08); a.marimba(9.5, 74, .8, .08)   # huh? where is it
a.chime(9.9, [91, 96, 100, 103], .06, .12); a.sweep(9.9, 500, 2000, 1.0, .05)
a.save(sys.argv[1])
