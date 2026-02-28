
filename = r"f:\cynaps-develop\\cynaps\\projects\models.py"
with open(filename, 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "def has_permission" in line:
            print(f"Found at line {i+1}: {line.strip()}")
