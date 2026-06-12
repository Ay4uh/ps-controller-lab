import os
import re
import json

# Paths
SHARED_DIR = 'shared'
TOOLS_DIR = 'tools'
SHELL_PATH = os.path.join(SHARED_DIR, 'layout-shell.html')
DB_PATH = os.path.join(SHARED_DIR, 'repair-db.json')

def build_tools():
    if not os.path.exists(SHELL_PATH):
        print(f"Error: Shell not found at {SHELL_PATH}")
        return

    with open(SHELL_PATH, 'r', encoding='utf-8') as f:
        shell_html = f.read()

    # Load Repair Database
    repair_db = "{}"
    if os.path.exists(DB_PATH):
        with open(DB_PATH, 'r', encoding='utf-8') as f:
            repair_db = f.read()
    
    db_script = f'\n  <!-- Global Repair Costs Data -->\n  <script id="repairCosts" type="application/json">\n{repair_db}\n  </script>\n'
    
    # Inject DB into head
    shell_html = shell_html.replace('</head>', db_script + '</head>')

    # Find where main content goes
    main_marker = '<main class="main-content">'
    if main_marker not in shell_html:
        print("Error: <main class=\"main-content\"> marker not found in shell.")
        return

    shell_parts = shell_html.split(main_marker)
    prefix = shell_parts[0] + main_marker + '\n'
    suffix = shell_parts[1]

    # Iterate through all tools
    for root, dirs, files in os.walk(TOOLS_DIR):
        if 'app.html' in files:
            app_path = os.path.join(root, 'app.html')
            out_path = os.path.join(root, 'index.html')
            
            with open(app_path, 'r', encoding='utf-8') as f:
                app_html = f.read()
            
            # Determine active navigation link based on folder name
            tool_name = os.path.basename(root)
            tool_prefix = prefix
            
            # Deactivate all active links in the sidebar
            tool_prefix = re.sub(
                r'class="tab-btn active"',
                r'class="tab-btn"',
                tool_prefix
            )
            # Make the current tool link active
            tool_prefix = re.sub(
                f'href="/tools/{tool_name}/" class="tab-btn text-decoration-none"',
                f'href="/tools/{tool_name}/" class="tab-btn text-decoration-none active"',
                tool_prefix
            )

            # Combine
            final_html = tool_prefix + app_html + suffix
            
            with open(out_path, 'w', encoding='utf-8') as f:
                f.write(final_html)
            
            print(f"Built {out_path} successfully.")

    # Process Root Hub Homepage
    if os.path.exists('app.html'):
        with open('app.html', 'r', encoding='utf-8') as f:
            app_html = f.read()
        final_html = prefix + app_html + suffix
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(final_html)
        print("Built root index.html successfully.")

if __name__ == '__main__':
    build_tools()
