from bs4 import BeautifulSoup
from collections import Counter
import json

with open('20250519_data.json', 'r', encoding='utf-8') as f:
  data = json.load(f)

career_counts = Counter()

for item in data:
  interpretacion = item.get('interpretacion', '')

  soup = BeautifulSoup(interpretacion, 'html.parser')

  all_strong_tags = soup.find_all('strong', class_='vignette-t')

  career_candidates = [tag.get_text(strip=True).replace(':', '') for tag in all_strong_tags if tag.get_text(strip=True).isupper()]

  last_three = career_candidates[-3:]

  career_counts.update(last_three)

print("Conteo total de carreras recomendadas:")
for career, count in career_counts.most_common():
  print(f"{career}: {count}")