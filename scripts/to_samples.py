import os
import shutil
import sys

from helper import notes_dir, notes_full_path, sample_dir, sample_full_path, list_sample_files, get_parent_folder_notes


def to_samples(file_name="", method="move"):
    """Find and move a file that are not in list_sample_posts.txt from notes/posts/ to notes/sample_posts/
    HOW TO USE?
        python to_samples.py docker-gpu
        where "docker-gpu" comes from "https://dinhanhthi.com/docker-gpu/"
    """

    for root, _, files in os.walk(notes_full_path):
        for name in files:
            if name.find(file_name) != -1:
                file_full_path = os.path.abspath(os.path.join(root, name))
                parent = get_parent_folder_notes(file_full_path)
                try:
                    if method == "move":
                        if name[11:name.rfind(".")] not in list_sample_files:
                            rst = shutil.move(file_full_path, sample_full_path +
                                              "/" + os.path.split(file_full_path)[1])
                            if rst:
                                print(
                                    "✅  MOVED : " + notes_dir + '/' + parent + '/' +
                                    os.path.split(file_full_path)[1] + " 👉 " +
                                    sample_dir + '/')
                        else:
                            print("❌ Cannot move because " + file_name +
                                  " is in list_sample_posts.txt!!!")
                    elif method == "copy":
                        rst = shutil.copy(file_full_path, sample_full_path +
                                          "/" + os.path.split(file_full_path)[1])
                        if rst:
                            print("✅  COPIED : " + notes_dir + '/' + parent + '/' +
                                  os.path.split(file_full_path)[1] + " 👉 " +
                                  sample_dir + '/')
                except:
                    print("🙅‍♂️ " + file_name + " is NOT moved / copied !!!")


if __name__ == "__main__":
    to_samples(sys.argv[1])
