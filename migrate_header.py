path = "src/components/Header.tsx"
text = open(path, encoding="utf-8").read()
problems = []

# Migrate publicNavItems to use labelKey
old_public = """  const publicNavItems = [
    { label: 'Home', href: '/' },
    { label: 'Schools', href: '/schools' },
    { label: 'Certifications', href: '/certifications' },
    { label: 'Talent Network', href: '/talent-network' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'My Portal', href: '/portal' },
  ];"""
new_public = """  const publicNavItems = [
    { labelKey: 'nav.home', href: '/' },
    { labelKey: 'nav.schools', href: '/schools' },
    { labelKey: 'nav.certifications', href: '/certifications' },
    { labelKey: 'nav.talent_network', href: '/talent-network' },
    { labelKey: 'nav.pricing', href: '/pricing' },
    { labelKey: 'nav.portal', href: '/portal' },
  ];"""
if old_public in text:
    text = text.replace(old_public, new_public, 1)
else:
    problems.append("publicNavItems not found")

old_portal = """  const portalNavItems = [
    { label: 'My Portal', href: '/portal' },
    { label: 'Courses', href: '/portal/courses' },
    { label: 'Talent Score™', href: '/portal/talent-score' },
    { label: 'Career', href: '/portal/career' },
  ];"""
new_portal = """  const portalNavItems = [
    { labelKey: 'nav.portal', href: '/portal' },
    { labelKey: 'nav.courses', href: '/portal/courses' },
    { labelKey: 'nav.talent_score', href: '/portal/talent-score' },
    { labelKey: 'nav.career', href: '/portal/career' },
  ];"""
if old_portal in text:
    text = text.replace(old_portal, new_portal, 1)
else:
    problems.append("portalNavItems not found")

# Update the two .map renders to use t(item.labelKey) instead of item.label
# Need to see exact render — replace any {item.label} with {t(item.labelKey)}
n = text.count("{item.label}")
text = text.replace("{item.label}", "{t(item.labelKey)}")
if n == 0:
    problems.append("no {item.label} render found — check render manually")

open(path,"w",encoding="utf-8").write(text)
if problems:
    print("WARNINGS:", problems)
else:
    print("OK — Header nav migrated;", n, "label renders updated")
