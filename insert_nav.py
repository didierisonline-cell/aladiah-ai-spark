import json
DATA = json.loads('''{"en": {"anchor": "    'nav.community': 'Community',", "vals": ["Courses", "Career", "Talent Score™", "Resources", "Schools", "Pricing", "Certifications", "Talent Network"]}, "es": {"anchor": "    'nav.community': 'Comunidad',", "vals": ["Cursos", "Carrera", "Talent Score™", "Recursos", "Escuelas", "Precios", "Certificaciones", "Red de Talento"]}, "fr": {"anchor": "    'nav.community': 'Communauté',", "vals": ["Cours", "Carrière", "Talent Score™", "Ressources", "Écoles", "Tarifs", "Certifications", "Réseau de Talents"]}, "de": {"anchor": "    'nav.community': 'Gemeinschaft',", "vals": ["Kurse", "Karriere", "Talent Score™", "Ressourcen", "Schulen", "Preise", "Zertifizierungen", "Talent-Netzwerk"]}, "pt": {"anchor": "    'nav.community': 'Comunidade',", "vals": ["Cursos", "Carreira", "Talent Score™", "Recursos", "Escolas", "Preços", "Certificações", "Rede de Talentos"]}, "it": {"anchor": "    'nav.community': 'Comunità',", "vals": ["Corsi", "Carriera", "Talent Score™", "Risorse", "Scuole", "Prezzi", "Certificazioni", "Rete di Talenti"]}, "ru": {"anchor": "    'nav.community': 'Сообщество',", "vals": ["Курсы", "Карьера", "Talent Score™", "Ресурсы", "Школы", "Цены", "Сертификаты", "Сеть Талантов"]}}''')
KEYS = ["courses", "career", "talent_score", "resources", "schools", "pricing", "certifications", "talent_network"]
path = "src/contexts/LanguageContext.tsx"
text = open(path, encoding="utf-8").read()
count = 0
for lang, d in DATA.items():
    anchor = d["anchor"]
    lines = ["    'nav.%s': '%s'," % (KEYS[i], d["vals"][i].replace("\\","\\\\").replace("'","\\'")) for i in range(len(KEYS))]
    block = "\n" + "\n".join(lines)
    if anchor in text:
        # avoid double-insert
        after = text.split(anchor,1)[1][:400]
        if "'nav.courses'" in after:
            print("already present:", lang); continue
        text = text.replace(anchor, anchor + block, 1)
        count += 1
    else:
        print("ANCHOR NOT FOUND:", lang)
open(path,"w",encoding="utf-8").write(text)
print("Inserted nav keys for", count, "languages")
