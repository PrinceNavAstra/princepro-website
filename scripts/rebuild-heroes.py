import os
import re

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

files_config = {
    'manufacturing.html': {
        'svg': 'assets/manufacturing-hero.svg',
        'alt': 'Manufacturing digital operations diagram',
    },
    'logistics.html': {
        'svg': 'assets/logistics-hero.svg',
        'alt': 'Logistics and distribution network diagram',
    },
    'textile.html': {
        'svg': 'assets/textile-hero.svg',
        'alt': 'Textile and apparel supply chain diagram',
    },
    'construction.html': {
        'svg': 'assets/construction-hero.svg',
        'alt': 'Construction project control diagram',
    },
    'marketing.html': {
        'svg': 'assets/marketing-hero.svg',
        'alt': 'Marketing performance analytics diagram',
    },
}

for fname, cfg in files_config.items():
    fpath = os.path.join(base_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the old hero-image-wrap section
    # Match from '<div class="hero-image-wrap' to the closing </div> of that wrap
    img_wrap_pattern = r'<div class="hero-image-wrap[^>]*>.*?</div>\s*(?:</div>\s*){0,3}\s*</section>'
    
    new_wrap = f'''                <div class="hero-image-wrap reveal" style="transition-delay:.2s">
                    <div class="hero-3d-card">
                        <img src="{cfg['svg']}" alt="{cfg['alt']}" style="width:100%;height:100%;object-fit:contain;padding:20px;" />
                    </div>
            </div>
    </section>'''
    
    # Try to find the exact match
    match = re.search(r'<div class="hero-image-wrap reveal"[^>]*style="transition-delay:\.2s">.*?</div>\s*</div>\s*</div>\s*</section>', content, re.DOTALL)
    
    if match:
        new_content = content.replace(match.group(0), new_wrap)
        print(f'{fname}: Replaced hero image wrap block')
    else:
        # Try another pattern - maybe the structure is different
        # Find any section that ends with </section> and contains hero-image-wrap
        match2 = re.search(r'<div class="hero-image-wrap[^>]*>.*?</div>\s*</section>', content, re.DOTALL)
        if match2:
            new_content = content.replace(match2.group(0), new_wrap)
            print(f'{fname}: Replaced (alternate pattern)')
        else:
            print(f'{fname}: Could NOT find pattern - checking raw...')
            # Show what the section looks like
            hero_section = re.search(r'<section class="ind-hero">.*?</section>', content, re.DOTALL)
            if hero_section:
                section = hero_section.group(0)
                # Check if hero-3d-block still exists
                if 'hero-3d-block' in section:
                    print(f'  -> Still has old emoji blocks, rebuilding section')
                    # Extract the header part (before hero-image-wrap)
                    header_end = section.find('</div>')
                    # Find the right </div> closing hero-content
                    parts = section.split('</div>')
                    # Rebuild: take everything up to the emoji blocks
                    hero_content_end = section.index('</div>', section.index('hero-content')) + 6
                    before = section[:hero_content_end]
                    after = section[section.rfind('</section>'):]
                    new_section = before + '\n' + new_wrap
                    new_content = content.replace(section, new_section)
                    print(f'  -> Rebuilt section')
                else:
                    # Maybe it already has the SVG but bad nesting
                    bad_pattern = r'<div class="hero-image-wrap[^>]*>.*?</div>\s*</div>\s*</section>'
                    match3 = re.search(bad_pattern, content, re.DOTALL)
                    if match3:
                        new_content = content.replace(match3.group(0), new_wrap)
                        print(f'  -> Replaced (short pattern)')
                    else:
                        print(f'  -> No match, skipping')
                        continue
            else:
                print(f'{fname}: No ind-hero section found!')
                continue

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f'{fname}: Written successfully')

print('\nAll files processed!')
