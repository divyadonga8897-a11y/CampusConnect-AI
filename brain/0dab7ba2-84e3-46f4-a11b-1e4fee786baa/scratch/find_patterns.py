import re

filepath = r"c:\Users\Divya\OneDrive\Desktop\CompusConnect-AI\frontend\src\components\admin\AdminDashboardClient.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("File loaded successfully! Total lines:", len(lines))

patterns = [
    r'ai-whatsapp',
    r'ai-kb',
    r'knowledgeDocs',
    r'currentView',
    r'aiTab',
    r'Playground'
]

for pattern in patterns:
    matches = []
    for idx, line in enumerate(lines):
        if re.search(pattern, line, re.IGNORECASE):
            matches.append(idx + 1)
    print(f"Pattern '{pattern}': found at lines {matches[:15]}")
