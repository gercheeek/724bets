from duckduckgo_search import DDGS
import json

with DDGS() as ddgs:
    results = [r for r in ddgs.images("haluk levent gitar siyah deri ceket", max_results=10)]
    for r in results:
        print(r['image'])
