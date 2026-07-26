#!/usr/bin/env python3
"""
Fix SVG files for proper rendering in both dark & light themes.

Problem: 
- SVGs loaded as <img> tags don't support var() in presentation attributes
- SVG internal <style> blocks override parent CSS variables for inline SVGs

Fix:
- Hero SVGs (loaded as <img>): Remove <style> block, hardcode all var() values
- erp-diagram.svg (loaded inline): Remove <style> block, keep var() with fallbacks
  (parent CSS provides theme-aware variables)
"""

import os
import re

SVG_FILES = {
    # Hero SVGs - loaded as <img>, hardcode all values
    'assets/construction-hero.svg': 'hardcode',
    'assets/logistics-hero.svg': 'hardcode',
    'assets/manufacturing-hero.svg': 'hardcode',
    'assets/marketing-hero.svg': 'hardcode',
    'assets/textile-hero.svg': 'hardcode',
    # ERP diagram - loaded inline, keep var() for theme support
    'assets/erp-diagram.svg': 'keep-var',
}

def remove_style_block(content):
    """Remove the <style>...</style> block from SVG content."""
    # Remove <style> block (with its contents)
    content = re.sub(r'\s*<style>[^<]*</style>\s*', '\n', content)
    return content

def hardcode_vars(content):
    """Replace all var(--name, fallback) with just the fallback value."""
    # Pattern: var(--name, fallback_value)
    def replace_var(match):
        return match.group(1)  # Return just the fallback value
    
    content = re.sub(r'var\(--[\w-]+,\s*([^)]+)\)', replace_var, content)
    return content

def fix_svg(filepath, mode):
    """Fix a single SVG file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Remove <style> block
    content = remove_style_block(content)
    
    if mode == 'hardcode':
        # Replace var() with fallback values
        content = hardcode_vars(content)
    
    if content == original:
        print(f"  NO CHANGE: {filepath}")
        return False
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  FIXED ({mode}): {filepath}")
    return True

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(base_dir)
    print(f"Working directory: {os.getcwd()}")
    
    fixed = 0
    errors = 0
    
    for svg_file, mode in SVG_FILES.items():
        full_path = os.path.join(base_dir, svg_file)
        if not os.path.exists(full_path):
            print(f"  ERROR: File not found: {full_path}")
            errors += 1
            continue
        
        if fix_svg(full_path, mode):
            fixed += 1
    
    print(f"\nSummary: {fixed} fixed, {errors} errors")

if __name__ == '__main__':
    main()
