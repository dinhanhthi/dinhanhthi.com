# pyright: reportMissingImports=false
import json
import os
import frontmatter
from pathlib import Path  # requires python >= 3.4


curdir = Path(os.path.abspath(__file__))
dat_dir = str(curdir.parent.parent.absolute())
sample_dir = '/sample_posts'
notes_dir = '/notes/posts'
sample_full_path = dat_dir + sample_dir
notes_full_path = dat_dir + notes_dir
file_list_txt = dat_dir + '/scripts/list_sample_posts.txt'
categories_file = dat_dir + '/scripts/categories.json'
with open(categories_file) as f:
    data = f.read()
categories = json.loads(data)
with open(file_list_txt) as f:
    data = f.read()
list_sample_files = data.split('\n')
lst_files_in_samples = os.listdir(sample_full_path)
lst_notes_in_samples = [file for file in lst_files_in_samples if file.endswith('.md') or file.endswith('.njk')]
lst_notes_in_samples = [file for file in lst_notes_in_samples if file[11:file.rfind('.')] not in list_sample_files]


def get_full_name(line, list_files):
    for file in list_files:
        if (line + '.md' in file) or (line + '.njk' in file):
            return file


def get_parent_folder(file_name, full_path, cats):
    post = frontmatter.load(full_path + '/' + file_name)
    return cats[post['tags'][0]]


def get_file_info_notes(file_name, notes_path_full):
    for root, _, files in os.walk(notes_path_full):
        for name in files:
            if (name.endswith(".md") or name.endswith(".njk")) and name.find(file_name) != -1:
                file_full_name = name
                file_full_dir = root
                file_full_path = os.path.abspath(os.path.join(root, name))
                return file_full_name, file_full_dir, file_full_path
