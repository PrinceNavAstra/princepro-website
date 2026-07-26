#!/usr/bin/env python3
"""Validate SVG files for proper rendering."""

import os
import re

SVG_FILES = [
    'assets/construction-hero.svg',
    'assets/logistics-hero.svg',
    'assets/manufacturing-hero.svg',
    'assets/marketing-hero.svg',
    'assets/textile-hero.svg',
    'assets/erp-diagram.svg',
]

def validate_svg(filepath):
    """Check an SVG file for common issues."""
    issues = []
    
    with open(filepath, 'rb') as f:
        raw = f.read()
    
    # Check for BOM
    if raw[:3] == b'\xef\xbb\xbf':
        issues.append('Has BOM (Byte Order Mark)')
    
    # Decode
    try:
        content = raw.decode('utf-8')
    except:
        issues.append('Cannot decode as UTF-8')
        return issues
    
    # Check for XML declaration
    if not content.startswith('<?xml') and not content.startswith('<svg'):
        issues.append('Does not start with <?xml or <svg')
    
    # Check for xmlns
    if 'xmlns="http://www.w3.org/2000/svg"' not in content:
        issues.append('Missing xmlns attribute')
    
    # Check for viewBox
    if 'viewBox' not in content:
        issues.append('Missing viewBox attribute')
    
    # Check for remaining var() calls
    vars_found = re.findall(r'var\([^)]+\)', content)
    if vars_found:
        issues.append(f'Has {len(vars_found)} remaining var() calls: {vars_found[:3]}')
    
    # Check for style block
    if '<style>' in content:
        issues.append('Has <style> block (may override parent CSS)')
    
    # Check for closing svg tag
    if '</svg>' not in content:
        issues.append('Missing closing </svg> tag')
    
    return issues

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(base_dir)
    
    all_clean = True
    for svg_file in SVG_FILES:
        full_path = os.path.join(base_dir, svg_file)
        if not os.path.exists(full_path):
            print(f"  ERROR: File not found: {full_path}")
            all_clean = False
            continue
        
        issues = validate_svg(full_path)
        if issues:
            all_clean = False
            print(f"  ISSUES: {svg_file}")
            for issue in issues:
                print(f"    - {issue}")
        else:
            print(f"  OK: {svg_file}")
    
    if all_clean:
        print("\nAll SVGs are valid!")
    else:
        print("\nSome SVGs have issues that need fixing.")

if __name__ == '__main__':
    main()
