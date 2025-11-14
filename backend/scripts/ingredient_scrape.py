import requests
from bs4 import BeautifulSoup
import json
import time
import random

BASE_URL = "https://incidecoder.com/ingredients/"

INGREDIENTS = [
    {"slug": "glycerin", "category": ["Hydrators & Humectants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "hyaluronic-acid", "category": ["Hydrators & Humectants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "sodium-hyaluronate-crosspolymer", "category": ["Hydrators & Humectants", "Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "sodium-acetylated-hyaluronate", "category": ["Hydrators & Humectants", "Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "sodium-pca", "category": ["Hydrators & Humectants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "ceramide-np", "category": ["Hydrators & Humectants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "ceramide-ap", "category": ["Hydrators & Humectants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "xylitylglucoside", "category": ["Hydrators & Humectants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "sodium-lactate", "category": ["Hydrators & Humectants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "betaine", "category": ["Hydrators & Humectants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "pca", "category": ["Hydrators & Humectants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    
    {"slug": "beta-glucan", "category": ["Hydrators & Humectants", "Soothers & Calmatives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "panthenol", "category": ["Hydrators & Humectants", "Soothers & Calmatives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "aloe-barbadensis-leaf-juice", "category": ["Hydrators & Humectants", "Soothers & Calmatives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    
    {"slug": "zinc-pca", "category": ["Hydrators & Humectants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},


    {"slug": "niacinamide", "category": ["Antioxidants & Brighteners", "Hydrators & Humectants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "ascorbic-acid", "category": ["Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "ethyl-ascorbic-acid", "category": ["Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "ascorbyl-glucoside", "category": ["Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "ascorbyl-palmitate", "category": ["Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "alpha-arbutin", "category": ["Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "arbutin", "category": ["Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "tranexamic-acid", "category": ["Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "tocopherol", "category": ["Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "acetyl-glucosamine", "category": ["Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    
    {"slug": "sodium-ascorbyl-phosphate", "category": ["Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "ferulic-acid", "category": ["Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "bakuchiol", "category": ["Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},

    
    {"slug": "melaleuca-alternifolia-leaf-oil", "category": ["Soothers & Calmatives", "Antioxidants & Brighteners", "Fragrance & Essential Oils"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "calendula-officinalis-flower-extract", "category": ["Soothers & Calmatives", "Antioxidants & Brighteners", "Fragrance & Essential Oils"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},


    {"slug": "lactic-acid", "category": ["Active Exfoliants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "glycolic-acid", "category": ["Active Exfoliants"], "recommended_for": ["oily", "normal"], "avoided_for": ["dry"]},
    {"slug": "salicylic-acid", "category": ["Active Exfoliants"], "recommended_for": ["oily", "normal"], "avoided_for": ["dry"]},
    {"slug": "mandelic-acid", "category": ["Active Exfoliants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "gluconolactone", "category": ["Active Exfoliants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "lactobionic-acid", "category": ["Active Exfoliants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "malic-acid", "category": ["Active Exfoliants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "citric-acid", "category": ["Active Exfoliants"], "recommended_for": ["oily", "normal"], "avoided_for": ["dry"]},


    {"slug": "berberis-vulgaris-root-extract", "category": ["Soothers & Calmatives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "retinol", "category": ["Anti-aging"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "hydroxypinacolone-retinoate", "category": ["Anti-aging"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "retinyl-palmitate", "category": ["Anti-aging"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "phytosphingosine", "category": ["Acne-fighting"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},


    {"slug": "centella-asiatica-extract", "category": ["Soothers & Calmatives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "allantoin", "category": ["Soothers & Calmatives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "bisabolol", "category": ["Soothers & Calmatives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "zinc-gluconate", "category": ["Soothers & Calmatives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "azelaic-acid", "category": ["Acne-fighting", "Soothers & Calmatives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "camellia-sinensis-leaf-extract", "category": ["Soothers & Calmatives", "Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "glycyrrhiza-glabra-root-extract", "category": ["Soothers & Calmatives", "Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "madecassoside", "category": ["Soothers & Calmatives", "Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "chamomilla-recutita-flower-extract", "category": ["Soothers & Calmatives", "Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
      
  
    {"slug": "avena-sativa-kernel-extract", "category": ["Antioxidants & Brighteners", "Soothers & Calmatives", "Emollients & Occlusives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},


    {"slug": "butyrospermum-parkii-butter", "category": ["Emollients & Occlusives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "mangifera-indica-seed-oil", "category": ["Emollients & Occlusives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "cocos-nucifera-oil", "category": ["High Comedogenics", "Emollients & Occlusives"], "recommended_for": ["dry"], "avoided_for": ["oily", "normal"]},
    {"slug": "theobroma-cacao-seed-butter", "category": ["High Comedogenics", "Emollients & Occlusives"], "recommended_for": ["dry"], "avoided_for": ["oily", "normal"]},
    {"slug": "glycine-soja-oil", "category": ["High Comedogenics", "Emollients & Occlusives"], "recommended_for": ["dry"], "avoided_for": ["oily", "normal"]},
    {"slug": "triticum-vulgare-germ-oil", "category": ["High Comedogenics", "Emollients & Occlusives", "Hydrators & Humectants"], "recommended_for": ["dry"], "avoided_for": ["oily", "normal"]},
    {"slug": "elaeis-guineensis-kernel-oil", "category": ["High Comedogenics", "Emollients & Occlusives"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "isopropyl-palmitate", "category": ["High Comedogenics", "Emollients & Occlusives"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "lanolin", "category": ["High Comedogenics", "Emollients & Occlusives"], "recommended_for": ["dry"], "avoided_for": ["oily", "normal"]},
    {"slug": "isopropyl-myristate", "category": ["High Comedogenics"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "lauric-acid", "category": ["Acne-fighting", "High Comedogenics"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "olea-europaea-fruit-oil", "category": ["Emollients & Occlusives", "High Comedogenics"], "recommended_for": ["dry"], "avoided_for": ["oily", "normal"]},
    {"slug": "macadamia-integrifolia-seed-oil", "category": ["Emollients & Occlusives"], "recommended_for": ["dry"], "avoided_for": ["oily"]},
    {"slug": "rosa-canina-seed-oil", "category": ["Soothers & Calmatives", "Antioxidants & Brighteners"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    
    
    {"slug": "alcohol-denat", "category": ["Drying Alcohols"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "alcohol", "category": ["Drying Alcohols"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},


    {"slug": "parfum", "category": ["Fragrance & Essential Oils"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "linalool", "category": ["Fragrance & Essential Oils"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "limonene", "category": ["Fragrance & Essential Oils"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "eugenol", "category": ["Fragrance & Essential Oils"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "geraniol", "category": ["Fragrance & Essential Oils"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "coumarin", "category": ["Fragrance & Essential Oils"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "hexyl-cinnamal", "category": ["Fragrance & Essential Oils"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "farnesol", "category": ["Fragrance & Essential Oils"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "lavandula-angustifolia-oil", "category": ["Fragrance & Essential Oils"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "eucalyptus-globulus-leaf-oil", "category": ["Fragrance & Essential Oils"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "menthol", "category": ["Fragrance & Essential Oils"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "mentha-piperita-oil", "category": ["Fragrance & Essential Oils"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "rosa-damascena-flower-oil", "category": ["Fragrance & Essential Oils"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    
    
    {"slug": "algae-extract", "category": ["Emollients & Occlusives", "Hydrators & Humectants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "paraffinum-liquidum", "category": ["Emollients & Occlusives"], "recommended_for": ["dry"], "avoided_for": ["oily", "normal"]},
    {"slug": "squalane", "category": ["Emollients & Occlusives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "caprylic-capric-triglyceride", "category": ["Emollients & Occlusives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "isostearyl-isostearate", "category": ["Emollients & Occlusives", "High Comedogenics"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "caprylic-capric-triglyceride", "category": ["Emollients & Occlusives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "dimethicone", "category": ["Emollients & Occlusives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "cyclopentasiloxane", "category": ["Emollients & Occlusives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "simmondsia-chinensis-seed-oil", "category": ["Emollients & Occlusives"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    
    
    {"slug": "sodium-lauryl-sulfate", "category": ["Harsh Surfactants"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "sodium-c14-16-olefin-sulfonate", "category": ["Harsh Surfactants"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "ammonium-lauryl-sulfate", "category": ["Harsh Surfactants"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "cocamide-dea", "category": ["Harsh Surfactants"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "cocamide-mea", "category": ["Harsh Surfactants"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    
    
    {"slug": "coco-glucoside", "category": ["Gentle Surfactants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "cocamidopropyl-betaine", "category": ["Gentle Surfactants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "sodium-cocoyl-glutamate", "category": ["Gentle Surfactants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "sodium-cocoyl-isethionate", "category": ["Gentle Surfactants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "decyl-glucoside", "category": ["Gentle Surfactants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "lauryl-glucoside", "category": ["Gentle Surfactants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "sodium-lauroamphoacetate", "category": ["Gentle Surfactants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "disodium-laureth-sulfosuccinate", "category": ["Gentle Surfactants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "sodium-lauroyl-sarcosinate", "category": ["Gentle Surfactants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "potassium-cocoyl-glycinate", "category": ["Gentle Surfactants"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    
    
    {"slug": "4-methylbenzylidene-camphor", "category": ["UV Filters"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "benzophenone-3", "category": ["UV Filters"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "benzophenone-4", "category": ["UV Filters"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "benzophenone-5", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "bis-ethylhexyloxyphenol-methoxyphenyl-triazine", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "butyl-methoxydibenzoylmethane", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "diethylamino-hydroxybenzoyl-hexyl-benzoate", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "diethylhexyl-butamido-triazone", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "disodium-phenyl-dibenzimidazole-tetrasulfonate", "category": ["UV Filters"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "drometrizole-trisiloxane", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "ethylhexyl-dimethyl-paba", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "ethylhexyl-methoxycinnamate", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "ethylhexyl-salicylate", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "ethylhexyl-triazone", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "homosalate", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "isoamyl-p-methoxycinnamate", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "methylene-bis-benzotriazolyl-tetramethylbutylphenol", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "octocrylene", "category": ["UV Filters"], "recommended_for": [], "avoided_for": ["dry", "oily", "normal"]},
    {"slug": "phenylbenzimidazole-sulfonic-acid", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "polysilicone-15", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "methylene-bis-benzotriazolyl-tetramethylbutylphenol", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "terephthalylidene-dicamphor-sulfonic-acid", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "titanium-dioxide", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "tris-biphenyl-triazine", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []},
    {"slug": "zinc-oxide", "category": ["UV Filters"], "recommended_for": ["dry", "oily", "normal"], "avoided_for": []}
]


def scrape_ingredient(slug):
    url = BASE_URL + slug
    try:
        res = requests.get(url, timeout=90)
        res.raise_for_status()
    except Exception as e:
        print(f"❌ Error fetching {slug}: {e}")
        return None
    
    soup = BeautifulSoup(res.text, "html.parser")

    # Name
    name = soup.find("h1").get_text(strip=True)

    # also called
    also_called = None
    itemprops = soup.find_all("div", class_="itemprop")
    for item in itemprops:
        label = item.find("span", class_="label")
        if label and "Also-called-like-this" in label.get_text(strip=True):
            value = item.find("span", class_="value")
            also_called = value.get_text(strip=True) if value else None
            break

    # Quick facts
    quickfacts = []
    facts_section = soup.find("div", id="showmore-section-quickfacts")
    if facts_section:
        lis = facts_section.find_all("li")
        quickfacts = [li.get_text(strip=True) for li in lis] if lis else None
    
    # Details    
    details = None
    content_div = soup.find("div", class_="content")
    if content_div:
        elements = content_div.find_all(['p', 'ul'])  # grab paragraphs and lists
        text_parts = []

        for el in elements:
            if el.name == 'p':
                text_parts.append(el.get_text(strip=True))
            elif el.name == 'ul':
                # add each li as a bullet point
                bullets = [f"• {li.get_text(strip=True)}" for li in el.find_all('li')]
                text_parts.append("\n".join(bullets))

        # join everything as one string with paragraph breaks
        details = "\n\n".join(text_parts)
            
    # Proof / references
    proof = []
    proof_section = soup.find("div", id="showmore-section-proof")
    if proof_section:
        lis = proof_section.find_all("li")
        proof = [li.get_text(strip=True) for li in lis] if lis else None


    return {
        "name": name,
        "also_called": also_called,
        "quickfacts": quickfacts,
        "details": details,
        "proof": proof
    }

# Build nested JSON
data = []
seen = set()

for idx, ing in enumerate(INGREDIENTS, start=1):
    if ing["slug"] in seen:
        continue
    seen.add(ing["slug"])
    
    print(f"🔎 Scraping {idx}/{len(INGREDIENTS)}: {ing['slug']}...")
    
    scraped = scrape_ingredient(ing["slug"])
    if not scraped:
        continue

    ingredient = {
        "slug": ing["slug"],
        "name": scraped["name"],
        "category": ing["category"], 
        "recommended_for": ing["recommended_for"], 
        "avoided_for": ing["avoided_for"],         
        "also_called": scraped.get("also_called"),
        "quickfacts": scraped.get("quickfacts"),
        "details": scraped.get("details"),
        "proof": scraped.get("proof"),
    }
    data.append(ingredient)
    
    time.sleep(random.uniform(5, 10))
    

with open("ingredients.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    
print("✅ Done! Saved to ingredients.json")