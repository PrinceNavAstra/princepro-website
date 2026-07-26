import os
import re

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SVG file mapping per industry page
svg_map = {
    'manufacturing.html': 'assets/manufacturing-hero.svg',
    'logistics.html': 'assets/logistics-hero.svg',
    'textile.html': 'assets/textile-hero.svg',
    'construction.html': 'assets/construction-hero.svg',
    'marketing.html': 'assets/marketing-hero.svg',
}

# The emoji 3d-card block to replace (same pattern across all pages)
# We need to replace the hero-image-wrap div content
new_hero_svg_block = '''                <div class="hero-image-wrap reveal" style="transition-delay:.2s">
                    <div class="hero-3d-card">
                        <img src="{svg_path}" alt="{alt_text}" style="width:100%;height:100%;object-fit:contain;padding:20px;" />
                    </div>'''

alt_map = {
    'manufacturing.html': 'Manufacturing digital operations diagram',
    'logistics.html': 'Logistics and distribution network diagram',
    'textile.html': 'Textile and apparel supply chain diagram',
    'construction.html': 'Construction project control diagram',
    'marketing.html': 'Marketing performance analytics diagram',
}

# Pattern to match: the entire hero-image-wrap div with its content
# We need to match from <div class="hero-image-wrap reveal" ...> to the closing </div>
hero_wrap_pattern = r'<div class="hero-image-wrap reveal"[^>]*>.*?</div>\s*</div>\s*</div>\s*</section>'

for html_file, svg_path in svg_map.items():
    filepath = os.path.join(base_dir, html_file)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the hero image wrap section
    # The pattern: <div class="hero-image-wrap ..."> ... </div>
    # followed by </div></section>
    pattern = r'(<div class="hero-image-wrap reveal"[^>]*>).*?(</div>\s*</div>\s*</div>\s*</section>)'
    
    alt_text = alt_map[html_file]
    replacement = new_hero_svg_block.format(svg_path=svg_path, alt_text=alt_text)
    # Add the closing tags back
    replacement_full = replacement + '\n            </div>\n        </div>\n    </section>'
    
    new_content = re.sub(pattern, r'\1' + '\n' + replacement.split('</div>')[0] + '</div>\n                </div>\n            </div>\n        </div>\n    </section>', content, count=1, flags=re.DOTALL)
    
    # Alternative: simpler approach - match exact old block
    old_block_pattern = r'<div class="hero-image-wrap reveal"[^>]*style="transition-delay:\.2s">\s*<div class="hero-3d-card">.*?</div>\s*</div>'
    
    new_block = f'''                <div class="hero-image-wrap reveal" style="transition-delay:.2s">
                    <div class="hero-3d-card">
                        <img src="{svg_path}" alt="{alt_text}" style="width:100%;height:100%;object-fit:contain;padding:20px;" />
                    </div>'''
    
    new_content2 = re.sub(old_block_pattern, new_block, content, count=1, flags=re.DOTALL)
    
    if new_content2 != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content2)
        print(f'Updated: {html_file}')
    else:
        print(f'No changes for: {html_file}')

print('All HTML files updated!')
