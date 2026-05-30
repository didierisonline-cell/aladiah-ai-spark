import json
DATA = json.loads('''{"en": {"anchor": "    top_learners: 'of Learners',", "vals": ["My Portal", "Courses", "Talent Score™", "Career", "Community", "Resources", "Rising", "Continue Learning →"]}, "es": {"anchor": "    top_learners: 'de los Estudiantes',", "vals": ["Mi Portal", "Cursos", "Talent Score™", "Carrera", "Comunidad", "Recursos", "En Ascenso", "Continuar Aprendiendo →"]}, "fr": {"anchor": "    top_learners: 'des Apprenants',", "vals": ["Mon Portail", "Cours", "Talent Score™", "Carrière", "Communauté", "Ressources", "En Hausse", "Continuer l’Apprentissage →"]}, "de": {"anchor": "    top_learners: 'der Lernenden',", "vals": ["Mein Portal", "Kurse", "Talent Score™", "Karriere", "Gemeinschaft", "Ressourcen", "Steigend", "Weiter Lernen →"]}, "pt": {"anchor": "    top_learners: 'dos Alunos',", "vals": ["Meu Portal", "Cursos", "Talent Score™", "Carreira", "Comunidade", "Recursos", "Em Ascensão", "Continuar Aprendendo →"]}, "it": {"anchor": "    top_learners: 'degli Studenti',", "vals": ["Il Mio Portale", "Corsi", "Talent Score™", "Carriera", "Comunità", "Risorse", "In Crescita", "Continua ad Imparare →"]}, "ru": {"anchor": "    top_learners: 'Учащихся',", "vals": ["Мой портал", "Курсы", "Talent Score™", "Карьера", "Сообщество", "Ресурсы", "Растёт", "Продолжить обучение →"]}}''')
KEYS = ["nav_my_portal", "nav_courses", "nav_talent_score", "nav_career", "nav_community", "nav_resources", "rising", "continue_learning"]
path = "src/contexts/overviewStrings.ts"
text = open(path, encoding="utf-8").read()
count = 0
for lang, d in DATA.items():
    anchor = d["anchor"]
    lines = ["    %s: '%s'," % (KEYS[i], d["vals"][i].replace("\\","\\\\").replace("'","\\'")) for i in range(len(KEYS))]
    block = "\n" + "\n".join(lines)
    if anchor in text:
        after = text.split(anchor,1)[1][:200]
        if "nav_my_portal" in after:
            print("already present:", lang); continue
        text = text.replace(anchor, anchor + block, 1); count += 1
    else:
        print("ANCHOR NOT FOUND:", lang)
open(path,"w",encoding="utf-8").write(text)
print("Added overview nav keys for", count, "languages")
