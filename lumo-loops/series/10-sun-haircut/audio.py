import sys; import os; sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_lib"))
from lumo_audio import Audio
a = Audio(12.0, seed=10)
a.bed()
a.chime(1.3, [84, 88, 91], .08, .07)                       # scissors appear
a.sweep(1.5, 400, 1400, .4, .05)
t0, dt = 2.0, .375
scale = [72, 74, 76, 79, 81, 84, 81, 79]
for n in range(16):
    tc = t0 + dt * (n + .3)
    a.noise(tc - .02, .05, .20, .55)                        # snip
    a.pluck(tc, scale[n % 8] + (12 if n >= 8 else 0), .25, .07)
    a.marimba(t0 + dt * n, 55 if n % 2 == 0 else 48, .5, .05)  # bounce thump
a.chime(8.1, [96, 100, 103], .07, .08)                      # scissors poof
a.marimba(8.5, 79, .8, .08); a.marimba(8.65, 84, 1.0, .08)  # satisfied
a.sweep(8.6, 200, 1200, 1.4, .07, trem=.3)                  # hair regrows
for i in range(8): a.pluck(8.8 + i * .22, 60 + i * 2, .3, .05)
a.marimba(10.6, 74, .9, .07); a.marimba(10.8, 67, 1.2, .07)  # shrug
a.save(sys.argv[1])
