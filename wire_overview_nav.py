path = "src/pages/StudentPortal.tsx"
text = open(path, encoding="utf-8").read()
problems = []

# 1) Replace the hardcoded nav array with translated labels via T()
old_arr = "{['My Portal','Courses','Talent Score™','Career','Community','Resources'].map((item,i)=>("
new_arr = "{[T('nav_my_portal'),T('nav_courses'),T('nav_talent_score'),T('nav_career'),T('nav_community'),T('nav_resources')].map((item,i)=>("
if old_arr in text:
    text = text.replace(old_arr, new_arr, 1)
else:
    problems.append("nav array not found")

# 2) Fix "Rising" hardcoded badge
old_rising = "<span style={{fontSize:10.5,color:'#34d399',fontWeight:700}}>Rising</span>"
new_rising = "<span style={{fontSize:10.5,color:'#34d399',fontWeight:700}}>{T('rising')}</span>"
if old_rising in text:
    text = text.replace(old_rising, new_rising, 1)
else:
    problems.append("Rising badge not found")

# 3) Fix "Continue Learning" — currently {T('continue')} Learning →
old_cont = "{T('continue')} Learning →"
new_cont = "{T('continue_learning')}"
if old_cont in text:
    text = text.replace(old_cont, new_cont, 1)
else:
    problems.append("Continue Learning not found")

open(path,"w",encoding="utf-8").write(text)
if problems:
    print("WARNINGS:", problems)
else:
    print("OK — Overview nav + Rising + Continue Learning wired")
