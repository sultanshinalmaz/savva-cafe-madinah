"""Проверка в движке Safari (WebKit): кадры заставки и первого экрана как на iPhone.
   python tools/webkit.py [url] [outDir]
   Нужен: pip install playwright && python -m playwright install webkit"""
import sys, os, time
from playwright.sync_api import sync_playwright

url = sys.argv[1] if len(sys.argv) > 1 else 'https://savva-cafe-two.vercel.app/'
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(__file__), 'out-webkit')
os.makedirs(out, exist_ok=True)
with sync_playwright() as p:
    br = p.webkit.launch()
    ctx = br.new_context(**p.devices['iPhone 13'])
    pg = ctx.new_page()
    errs = []
    pg.on('pageerror', lambda e: errs.append('EXC ' + str(e)))
    pg.on('console', lambda m: m.type in ('error', 'warning') and errs.append(m.type + ' ' + m.text))
    t0 = time.time()
    pg.goto(url, wait_until='commit')
    for t in (0.6, 1.2, 1.8, 2.4, 3.0, 3.6, 4.2, 5.0, 6.0):
        time.sleep(max(0, t - (time.time() - t0)))
        pg.screenshot(path=os.path.join(out, 'intro-%04d.png' % int(t * 1000)))
    time.sleep(1.5)
    info = pg.evaluate("""() => ({ intro: !!document.getElementById('intro'), classes: document.documentElement.className,
      vis: document.visibilityState, reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      video: (v => ({ src: v.currentSrc, paused: v.paused, on: v.classList.contains('is-on') }))(document.getElementById('heroVideo')) })""")
    h = pg.evaluate("document.querySelector('.hero').offsetHeight - innerHeight")
    for k in (0, .3, .6, 1):
        pg.evaluate('y => scrollTo(0, y)', int(h * k)); time.sleep(.6)
        pg.screenshot(path=os.path.join(out, 'hero-%03d.png' % int(k * 100)))
    print(info); print('\n'.join(errs) or 'no errors')
    br.close()
