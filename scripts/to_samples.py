import os
import shutil
import sys

from helper import notes_dir, notes_full_path, sample_dir, sample_full_path, list_sample_files


def to_samples(file_name="", method="move"):
    """Find and move a file that are not in list_sample_posts.txt from notes/posts/ to sample_posts/
    HOW TO USE?
        python to_samples.py docker-gpu
        where "docker-gpu" comes from "https://dinhanhthi.com/docker-gpu/"
    """

    for root, _, files in os.walk(notes_full_path):
        for name in files:
            if name.find(file_name) != -1:
                file_full_path = os.path.abspath(os.path.join(root, name))
                try:
                    if method == "move" and name[11:name.rfind(".")] not in list_sample_files:
                        rst = shutil.move(file_full_path, sample_full_path +
                                          "/" + os.path.split(file_full_path)[1])
                        if rst:
                            print("✅  MOVED : " + notes_dir + '/' +
                                  os.path.split(file_full_path)[1] + " 👉 " + sample_dir + '/')
                    elif method == "copy":
                        rst = shutil.copy(file_full_path, sample_full_path +
                                          "/" + os.path.split(file_full_path)[1])
                        if rst:
                            print("✅  COPIED : " + notes_dir + '/' +
                                  os.path.split(file_full_path)[1] + " 👉 " + sample_dir + '/')
                except:
                    pass


if __name__ == "__main__":
    if len(sys.argv) == 1:  # method = "move"
        to_samples(sys.argv[1])
    elif len(sys.argv) == 2:  # method = "copy"
        to_samples(sys.argv[1], "copy")
