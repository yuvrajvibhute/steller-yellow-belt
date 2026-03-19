import sys
import os

template_path = r"C:\Users\yuvra\Downloads\live-poll\live-poll\contracts\hello-world\live-poll-ui\public\template.html"
new_ui_path = r"C:\Users\yuvra\Downloads\live-poll\live-poll\contracts\hello-world\live-poll-ui\public\tmp_new_ui.html"

# Read old content and extract JS
with open(template_path, 'r', encoding='utf-8') as f:
    old_content = f.read()

script_start = old_content.find('<script>')
if script_start == -1:
    print("Error: Could not find <script> in original template.html")
    sys.exit(1)

# Extract everything from '<script>' onwards and remove the old closing body/html
js_content = old_content[script_start+8:old_content.rfind('</script>')]

# Read new UI content
with open(new_ui_path, 'r', encoding='utf-8') as f:
    new_html = f.read()

# Combine new HTML, the old JS, and the final closing tags
combined = new_html + js_content + "\n</script>\n</body>\n</html>\n"

# Rewrite the template.html
with open(template_path, 'w', encoding='utf-8') as f:
    f.write(combined)

print("Successfully merged and updated template.html")
os.remove(new_ui_path)
