import requests
import json
import os

def fetch_commons_images(query, count=8):
    url = "https://en.wikipedia.org/w/api.php"
    params = {
        "action": "query",
        "format": "json",
        "prop": "pageimages",
        "generator": "search",
        "gsrsearch": query,
        "gsrlimit": count * 5,
        "pithumbsize": 800
    }
    headers = {
        "User-Agent": "AntigravityBot/1.0 (test@example.com)"
    }
    
    response = requests.get(url, params=params, headers=headers)
    try:
        data = response.json()
    except Exception as e:
        print("Response text:", response.text[:200])
        raise e
    
    urls = []
    if 'query' in data and 'pages' in data['query']:
        for page_id, page_info in data['query']['pages'].items():
            if 'thumbnail' in page_info:
                img_url = page_info['thumbnail']['source']
                if img_url.endswith('.jpg') or img_url.endswith('.jpeg') or img_url.endswith('.png'):
                    urls.append(img_url)
    return urls[:count]

categories = {
    'saree': 'sari',
    'lehenga': 'lehenga',
    'kurta': 'kurta clothing',
    'anarkali': 'anarkali suit',
    'palazzo': 'palazzo pants',
    'sharara': 'sharara suit',
    'gown': 'evening gown',
    'fusion': 'indo western dress'
}

out_dir = os.path.join(os.getcwd(), 'public', 'images')
os.makedirs(out_dir, exist_ok=True)

for key, query in categories.items():
    urls = fetch_commons_images(query, 8)
    print(f"Found {len(urls)} for {key}")
    for i, url in enumerate(urls):
        try:
            img_data = requests.get(url, headers={"User-Agent": "AntigravityBot/1.0 (test@example.com)"}).content
            file_path = os.path.join(out_dir, f"generated_{key}_{i+1}.jpg")
            with open(file_path, 'wb') as f:
                f.write(img_data)
        except Exception as e:
            print(f"Error downloading {url}: {e}")

