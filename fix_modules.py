import os
base = os.path.expanduser('~/aladiah-ai-spark/src/components')
path = f'{base}/CoursesSection.tsx'
with open(path, 'r') as f:
    content = f.read()

start = content.find("const PROGRAMS: Program[] = [")
end = content.find("];\n\nconst SIMS") + 2
if start == -1 or end == 1:
    print("ERROR: markers not found"); exit(1)

# Count current modules
current = content[start:end].count("{title:'")
print(f"Current module entries: {current}")
if current == 280:
    print("Already updated! 280 module entries = 28 programs x 10 modules. Nothing to do.")
else:
    print(f"Needs update: found {current}, expected 280")
