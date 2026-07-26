import os
import re

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

configs = {
    'manufacturing.html': {
        'svg': 'assets/manufacturing-hero.svg',
        'alt': 'Manufacturing digital operations diagram',
        'emoji_block': '''<div class="hero-3d-block">
                            <div class="hero-3d-icon">⚙️</div>
                        <div class="hero-3d-block">
                            <div class="hero-3d-icon">🏭</div>
                        <div class="hero-3d-block">
                            <div class="hero-3d-icon">📈</div>
                        <div class="hero-3d-label">Digital manufacturing controls for better throughput and quality.
                        </div>'''
    },
    'logistics.html': {
        'svg': 'assets/logistics-hero.svg',
        'alt': 'Logistics and distribution network diagram',
        'emoji_block': '''<div class="hero-3d-block">
                            <div class="hero-3d-icon">🚚</div>
                        <div class="hero-3d-block">
                            <div class="hero-3d-icon">📦</div>
                        <div class="hero-3d-block">
                            <div class="hero-3d-icon">📍</div>
                        <div class="hero-3d-label">Real-time logistics planning, tracking, and delivery coordination.
                        </div>'''
    },
    'textile.html': {
        'svg': 'assets/textile-hero.svg',
        'alt': 'Textile and apparel supply chain diagram',
        'emoji_block': '''<div class="hero-3d-block">
                            <div class="hero-3d-icon">🧵</div>
                        <div class="hero-3d-block">
                            <div class="hero-3d-icon">🏭</div>
                        <div class="hero-3d-block">
                            <div class="hero-3d-icon">📦</div>
                        <div class="hero-3d-label">Batch control, material flow, and faster delivery for apparel
                            operations.</div>'''
    },
    'construction.html': {
        'svg': 'assets/construction-hero.svg',
        'alt': 'Construction project control diagram',
        'emoji_block': '''<div class="hero-3d-block">
                            <div class="hero-3d-icon">🧱</div>
                        <div class="hero-3d-block">
                            <div class="hero-3d-icon">📊</div>
                        <div class="hero-3d-block">
                            <div class="hero-3d-icon">🏗️</div>
                        <div class="hero-3d-label">Project controls for safer, faster, and more predictable builds.
                        </div>'''
    },
    'marketing.html': {
        'svg': 'assets/marketing-hero.svg',
        'alt': 'Marketing performance analytics diagram',
        'emoji_block': '''<div class="hero-3d-block">
                            <div class="hero-3d-icon">🎯</div>
                        <div class="hero-3d-block">
                            <div class="hero-3d-icon">📈</div>
                        <div class="hero-3d-block">
                            <div class="hero-3d-icon">💬</div>
                        <div class="hero-3d-label">Campaign analytics, lead flow, and marketing execution in one view.
                        </div>'''
    },
}

for fname, cfg in configs.items():
    fpath = os.path.join(base_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    old = cfg['emoji_block']
    new = f'''<img src="{cfg['svg']}" alt="{cfg['alt']}" style="width:100%;height:100%;object-fit:contain;padding:20px;" />'''
    
    if old in content:
        content = content.replace(old, new)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'{fname}: Replaced emoji blocks with SVG img')
    else:
        print(f'{fname}: Could not find emoji block - checking content...')
        # Show a snippet of the hero section
        idx = content.find('hero-3d-card')
        if idx > -1:
            print(f'  Found hero-3d-card at position {idx}')
            print(f'  Content around it: ...{content[idx:idx+300]}...')
        else:
            print('  No hero-3d-card found!')

print('\nDone!')
