import re

filepath = r"c:\Users\Divya\OneDrive\Desktop\CompusConnect-AI\frontend\src\components\admin\AdminDashboardClient.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("File loaded successfully! Total lines:", len(lines))

target_tabs = ["ai-monitors", "ai-whatsapp", "ai-conversations", "ai-visualizer"]

for tab in target_tabs:
    found = []
    for idx, line in enumerate(lines):
        if tab in line:
            found.append(idx + 1)
    print(f"Tab '{tab}': lines {found}")
