import sys; import os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_lib"))
from lumo_audio import Audio
a = Audio(12.0, seed=9); a.bed()
a.chime(0.8, [84, 88], .08, .07)
for k, tf in enumerate([3.2, 6.2, 9.2]):
    for i in range(3): a.pluck(tf - 1.2 + i * .35, 84, .12, .08)         # 3-2-1 beeps
    a.noise(tf, .12, .35, .5); a.marimba(tf, 96, .6, .12)                # shutter + flash
    a.sweep(tf + .2, 600, 1800, .5, .04); a.marimba(tf + .6, 72 + k * 2, .8, .07)  # photo pops out
a.sweep(3.7, 2400, 300, 1.4, .06)                                         # comet too late
a.sweep(5.5, 300, 2400, 1.4, .08); a.marimba(6.4, 55, .8, .1)             # comet bombs
a.marimba(9.0, 91, .4, .1); a.marimba(9.15, 96, .5, .1); a.chime(9.8, [84, 88, 91], .08, .08)
a.sweep(11.0, 1400, 400, .7, .04)
a.save(sys.argv[1])
