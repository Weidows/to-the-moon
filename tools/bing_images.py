import urllib.request, urllib.parse, re, json, os, sys, hashlib

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8'}

def search(q, count=30):
    url = 'https://www.bing.com/images/search?q=' + urllib.parse.quote(q) + '&first=1&count=35'
    req = urllib.request.Request(url, headers=UA)
    h = urllib.request.urlopen(req, timeout=30).read().decode('utf8', 'ignore')
    items = re.findall(r'class="iusc"[^>]*m="([^"]+)"', h)
    out = []
    for raw in items:
        try:
            m = json.loads(raw.replace('&quot;', '"').replace('&amp;', '&'))
            out.append({'title': m.get('t', ''), 'url': m.get('murl', ''), 'page': m.get('purl', '')})
        except Exception:
            pass
    return out[:count]

if __name__ == '__main__':
    queries = json.load(open(sys.argv[1], encoding='utf8'))
    allres = {}
    for q in queries:
        try:
            r = search(q)
        except Exception as e:
            r = []
            print('ERR', q, e)
        allres[q] = r
        print(f'{len(r):3d}  {q}')
        for i, it in enumerate(r[:8]):
            print('     ', i, it['url'][:110])
    json.dump(allres, open(sys.argv[2], 'w', encoding='utf8'), ensure_ascii=False, indent=1)
