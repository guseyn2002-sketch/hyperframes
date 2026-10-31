import numpy as np, wave, sys
SR=48000; T=15.0; N=int(SR*T)
out=np.zeros(N); rng=np.random.default_rng(7)
def addw(sig,start):
    i=int(round(start*SR)); idx=(np.arange(len(sig))+i)%N; np.add.at(out,idx,sig)
mid=lambda m:440*2**((m-69)/12)
def marimba(m,dur=1.6,amp=.1):
    f=mid(m); t=np.arange(int(dur*SR))/SR
    env=np.exp(-t*3.2)*(1-np.exp(-t*600))
    return amp*env*(np.sin(2*np.pi*f*t)+.4*np.sin(2*np.pi*4*f*t)*np.exp(-t*14)+.1*np.sin(2*np.pi*9.2*f*t)*np.exp(-t*30))
def pluck(m,dur=.35,amp=.12):
    f=mid(m); t=np.arange(int(dur*SR))/SR
    env=np.exp(-t*16)*(1-np.exp(-t*900))
    s=np.sign(np.sin(2*np.pi*f*t))*.0+ (2/np.pi)*np.arcsin(np.sin(2*np.pi*f*t))
    return amp*env*(s+.3*np.sin(2*np.pi*2*f*t))
def noise_burst(dur,amp,lp=.25):
    n=rng.standard_normal(int(dur*SR)); y=np.zeros_like(n); a=0
    for i in range(len(n)): a+=lp*(n[i]-a); y[i]=a
    t=np.arange(len(n))/SR; return amp*y*np.exp(-t*(6/dur))*(1-np.exp(-t*2000))
def sweep(f0,f1,dur,amp,trem=0,expo=True):
    t=np.arange(int(dur*SR))/SR; p=t/dur
    f=f0*(f1/f0)**p if expo else f0+(f1-f0)*p
    ph=2*np.pi*np.cumsum(f)/SR
    env=np.sin(np.pi*p)**1.5
    return amp*env*np.sin(ph)*(1+trem*np.sin(2*np.pi*9*t))
def chime(t0,notes,gap=.07,amp=.09):
    for i,m in enumerate(notes): addw(marimba(m,1.8,amp),t0+i*gap)

# ---- music bed: sparse lullaby + pad (loop-safe) ----
B=.625
for b,m in [(0,76),(2,79),(4,81),(6,79),(8,76),(10,74),(12,72),(14,74),(16,76),(18,79),(20,76),(22,74)]:
    addw(marimba(m,2.2,.05),b*B)
for b,m in [(0,48),(8,45),(16,43),(20,41)]: addw(marimba(m,3.5,.06),b*B)
t=np.arange(N)/SR
for m,a in [(60,.02),(64,.014),(67,.016)]:
    f=round(mid(m)*T)/T
    out+=a*np.sin(2*np.pi*f*t)*(.8+.2*np.sin(2*np.pi*t/T*2))

# ---- story sfx ----
chime(1.35,[88,91],.1,.05)                         # shadow peeks
addw(sweep(300,1100,.7,.05,trem=.3),2.1)           # rises
addw(marimba(60,.6,.1),2.78)                       # lands
chime(2.82,[96,100],.08,.11)                       # Lumo notices: ding-ding!
for i,tt in enumerate(np.arange(3.0,4.15,.09)):    # shadow bolts: pizzicato run
    addw(pluck(60+[0,2,4,7,9,12][i%6]+ (i//6)*12,.2,.07),tt)
for tt in np.arange(3.0,4.2,1/7.2): addw(noise_burst(.05,.16,.4),tt)
for tt in np.arange(3.3,4.95,1/6.8): addw(noise_burst(.07,.22,.15),tt)   # Lumo thumps
addw(sweep(500,2200,1.7,.03,expo=True),4.5)        # Wisp whoosh
addw(noise_burst(1.6,.05,.5),4.6)
for tt in [5.9,6.1,6.3,6.52,6.78]: addw(noise_burst(.05,.16,.4),tt)      # re-entry, slowing
for i,tt in enumerate(np.arange(7.05,7.9,1/3)): addw(noise_burst(.18,.07,.08),tt)  # panting
addw(marimba(79,.9,.07),7.95); addw(marimba(74,1.2,.07),8.12)             # whew
addw(marimba(76,.5,.08),8.55); addw(marimba(79,.5,.08),8.85)              # little dance
# sneaking steps (landing times follow the animation)
def real_t(m): return 6.325+m if m<=2.675 else 9.8+(m-2.675)
for k in range(7):
    m=.5*k+.35; tt=real_t(m)
    addw(pluck(40+[0,3,5,3,7,5,8][k],.3,.16),tt)
addw(marimba(35,1.0,.07),9.0)                      # freeze: low "dun"
addw(marimba(77,.5,.08),9.15); addw(marimba(74,.8,.07),9.4)  # "hm?"
addw(sweep(180,1900,.5,.09,trem=.2),10.7)          # charge-up
addw(sweep(300,2600,.5,.04,trem=.6),10.7)
addw(noise_burst(.25,.4,.5),11.2)                  # FLASH
chime(11.2,[84,88,91,96,100],.045,.14)
addw(sweep(700,110,.22,.35),11.25)                 # pin: boop down
addw(marimba(36,.8,.12),11.45)
for i,m in enumerate([72,76,79]): addw(marimba(m,.8,.09),11.95+i*.17)     # happy steps
addw(marimba(79,.6,.09),12.6); addw(marimba(84,.8,.09),12.93)             # joy hops
for tt,m in [(13.7,84),(13.82,86),(13.94,84)]: addw(marimba(m,.5,.04),tt) # sly giggle

for dl,g in [(.19,.25),(.37,.16),(.61,.1)]: out+=g*np.roll(out,int(dl*SR))
out/=np.max(np.abs(out))/.72
st=np.stack([out,np.roll(out,int(.011*SR))],1)
with wave.open(sys.argv[1],'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype('<i2').tobytes())
