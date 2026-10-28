import json, os, urllib.request, urllib.parse

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Referer': 'https://tothemoon.fandom.com/', 'Accept': 'image/avif,image/webp,image/png,image/*,*/*;q=0.8'}
os.makedirs('ref/online', exist_ok=True)
names = json.load(open('tools/fandom_images.json', encoding='utf8'))
by = {n['name']: n for n in names}

want = [
    'Anya_by_the_Moon.jpg', 'Stargazing.jpg', 'Launching_Scene.jpeg', 'Sharing_Olives.jpg',
    'Cloud_Watching.jpg', 'Hide_&_Seek.jpg', 'Horsing_Around.jpg', 'Floating_Island.jpg',
    'Last_Request.jpg', 'No_Helmet.jpg', 'On_the_Wing.jpg', 'Past_Echoes.jpg',
    'Space_Shenanigans.jpg', 'The_Gang.jpg', 'The_Guest.jpg', 'The_Machine_(Colin).jpg',
    'The_Machine_(Sofia).jpg', 'Walking_Tree.jpg', 'Best_Rice.jpg', 'Novelty_Beachball.jpg',
    'Leg.jpg', 'Rudog.jpg', 'Ttm1.jpeg', 'Paper_Plane_(Full_Colour).jpg',
    'Paper_Plane_(Black_&_White).jpg', 'River.png', "Neil's_game_To_the_Moon.png",
    'Anya_-3.png', 'ToTheMoonCover.png', 'To_the_Moon.jpg', 'ToTheMoonMenu.png',
    'Lighthouse.png', 'Site-background-light', 'Site-background-dark', 'Wyles_Cliff_House.png',
    'Tones.png', 'AlternateUniversePlaybook.jpg',
]
ok, fail = [], []
for w in want:
    n = by.get(w)
    if not n:
        fail.append((w, 'not found')); continue
    url = n['url']
    ext = os.path.splitext(urllib.parse.urlparse(url).path.split('/')[-1])[1] or '.jpg'
    fn = os.path.join('ref/online', w.replace('/', '_').replace('&', 'and').replace('(', '_').replace(')', '') )
    if not os.path.splitext(fn)[1]:
        fn += '.jpg'
    if os.path.exists(fn) and os.path.getsize(fn) > 20000:
        ok.append((w, os.path.getsize(fn))); continue
    try:
        d = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()
        open(fn, 'wb').write(d)
        ok.append((w, len(d)))
        print(f'OK {len(d)//1024:6d}K {w}')
    except Exception as e:
        fail.append((w, str(e)[:80]))
        print('FAIL', w, e)
print('done', len(ok), 'fails', fail)
