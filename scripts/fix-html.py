import os
import re

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SVG file mapping per industry page
svg_map = {
    'manufacturing.html': ('assets/manufacturing-hero.svg', 'Manufacturing digital operations diagram'),
    'logistics.html': ('assets/logistics-hero.svg', 'Logistics and distribution network diagram'),
    'textile.html': ('assets/textile-hero.svg', 'Textile and apparel supply chain diagram'),
    'construction.html': ('assets/construction-hero.svg', 'Construction project control diagram'),
    'marketing.html': ('assets/marketing-hero.svg', 'Marketing performance analytics diagram'),
}

for html_file, (svg_path, alt_text) in svg_map.items():
    filepath = os.path.join(base_dir, html_file)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the old hero-image-wrap section from opening div to the </div> that closes it
    # Pattern: everything from <div class="hero-image-wrap ..."> to </div> just before </div></section>
    old_pattern = r'<div class="hero-image-wrap reveal"[^>]*>.*?</div>\s*</div>\s*</div>\s*</section>'
    
    new_block = f'''                <div class="hero-image-wrap reveal" style="transition-delay:.2s">
                    <div class="hero-3d-card">
                        <img src="{svg_path}" alt="{alt_text}" style="width:100%;height:100%;object-fit:contain;padding:20px;" />
                    </div>
            </div>
    </section>'''
    
    new_content = re.sub(old_pattern, new_block, content, count=1, flags=re.DOTALL)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Cleaned: {html_file}')
    else:
        print(f'Could not match pattern for: {html_file} - manual check needed')

print('Done!')
