# pyright: reportMissingImports=false
import json
import os
import frontmatter
from pathlib import Path  # requires python >= 3.4


curdir = Path(os.path.abspath(__file__))
dat_dir = str(curdir.parent.parent.absolute())
sample_dir = '/notes/sample_posts'
sample_full_path = dat_dir + sample_dir

notes_dir = '/notes/posts'
notes_full_path = dat_dir + notes_dir

# note_mode_dir = '/note_mode_posts'
# note_mode_full_path = dat_dir + note_mode_dir

categories_file = dat_dir + '/scripts/categories.json'
with open(categories_file) as f:
    data = f.read()
categories = json.loads(data)

# ALl files in sample_notes/ (all things)
lst_files_in_samples = os.listdir(sample_full_path)

file_list_txt = dat_dir + '/scripts/list_sample_posts.txt'
with open(file_list_txt) as f:
    data = f.read()
list_sample_files = data.split('\n')
list_sample_files_real = [
    file for file in list_sample_files if not file.startswith('#')]

note_mode_file = dat_dir + '/scripts/note_mode_list.txt'
with open(note_mode_file) as f:
    data = f.read()
note_mode_list = data.split('\n')

# # ALl .md/.njk files in note_mode_posts/
# lst_files_note_mode = os.listdir(note_mode_full_path)
# lst_mdnjk_note_mode = [file for file in lst_files_note_mode if file.endswith(
#     '.md') or file.endswith('.njk')]

# ALl .md/.njk files in samples
lst_mdnjk_in_samples = [file for file in lst_files_in_samples if file.endswith(
    '.md') or file.endswith('.njk')]

# All .md/.njk files in sample_notes/ (not in list_sample_posts.txt)
lst_notes_in_samples = [file for file in lst_files_in_samples if file.endswith(
    '.md') or file.endswith('.njk')]
lst_notes_in_samples = [
    file for file in lst_notes_in_samples
    if file[11: file.rfind('.')] not in list_sample_files]

# Same as lst_notes_in_samples but only the name
lst_notes_in_samples_in_short = [
    file[11:file.rfind(".")] for file in lst_notes_in_samples]
lst_notes_in_samples_in_short

# All files/notes in notes/
lst_of_files_in_notes = []
for root, _, files in os.walk(notes_full_path):
    lst_of_files_in_notes += files

lst_of_notes_in_notes = [
    file for file in lst_of_files_in_notes
    if file.endswith(".md") or file.endswith(".njk")]
lst_of_notes_in_notes_in_short = [
    file[11:file.rfind(".")] for file in lst_of_notes_in_notes]


def get_full_name(line, list_files):
    for file in list_files:
        if (line + '.md' in file) or (line + '.njk' in file):
            return file


def get_parent_folder(file_name, full_path):
    return get_parent_folder_notes(full_path + '/' + file_name)


def get_parent_folder_notes(file_full_path):
    post = frontmatter.load(file_full_path)
    return categories[post['tags'][0]]


def get_file_info_notes(file_name, notes_path_full):
    for root, _, files in os.walk(notes_path_full):
        for name in files:
            if (name.endswith(".md") or name.endswith(".njk")) and name.find(file_name) != -1:
                file_full_name = name
                file_full_dir = root
                file_full_path = os.path.abspath(os.path.join(root, name))
                return file_full_name, file_full_dir, file_full_path
