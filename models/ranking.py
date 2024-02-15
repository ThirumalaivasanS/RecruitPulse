from concurrent.futures import ThreadPoolExecutor
from sentence_transformers import SentenceTransformer, util
import requests
from bs4 import BeautifulSoup
import pandas as pd

def extract_content_postjobfree(link):
    response = requests.get(link)
    soup = BeautifulSoup(response.content, 'html.parser')
    content_tags = soup.find_all('div', class_='normalText')
    return " ".join([tag.get_text() for tag in content_tags])

def extract_content_jobspider(link):
    response = requests.get(link)
    soup = BeautifulSoup(response.content, 'html.parser')
    content_tags = soup.find_all('td', width='100%')
    return " ".join([tag.get_text() for tag in content_tags])

def extract_name(content):
    # Split the content into lines
    lines = content.split('\n')
    
    # Check if the first line contains a name
    first_line = lines[0].strip()
    if first_line:
        return first_line
    
    # If the first line doesn't contain a name, check the second line
    if len(lines) > 1:
        second_line = lines[1].strip()
        if second_line:
            return second_line
    
    # If no name is found, return None
    return None

def process_resume_link(link):
    if 'postjobfree' in link:
        content = extract_content_postjobfree(link)
    elif 'jobspider' in link:
        content = extract_content_jobspider(link)
    else:
        content = ""
    
    # Extract the name from the content
    name = extract_name(content)
    
    return name, content

def rank_resumes(query_path, resume_links_df):
    model = SentenceTransformer("paraphrase-MiniLM-L6-v2")

    with open(query_path, encoding='utf-8') as f:
        query = f.read()
        print(f"Received Text")

    query_embedding = model.encode(query, convert_to_tensor=True)

    resume_contents = []

    with ThreadPoolExecutor() as executor:
        processed_resumes = list(executor.map(lambda link: process_resume_link(link), resume_links_df['links']))

    # Extract names and contents from processed resumes
    names, contents = zip(*processed_resumes)
    resume_embeddings = model.encode(contents, convert_to_tensor=True)

    cosine_scores = util.pytorch_cos_sim(query_embedding, resume_embeddings)[0]

    # Check if lengths match
    if len(resume_links_df) == len(cosine_scores):
        result_df = pd.DataFrame({'ID': resume_links_df['ID'], 'Link': resume_links_df['links'], 'Name': names, 'Similarity': cosine_scores.tolist()})
        result_df = result_df.sort_values(by='Similarity', ascending=False).reset_index(drop=True)
    else:
        result_df = pd.DataFrame(columns=['ID', 'Link', 'Name', 'Similarity'])

    return result_df
