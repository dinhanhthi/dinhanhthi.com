import shutil
import sys

from helper import (categories, get_full_name,
                    get_parent_folder, notes_dir, lst_notes_in_samples, lst_files_in_samples,
                    notes_full_path, sample_dir, sample_full_path, list_sample_files)


def to_notes(file_name="all"):
    """Move/copy & replace files that are not in list_sample_posts.txt from sample_posts/ to notes/posts/
    HOW TO USE?
        - Move all files:
            python to_notes.py all
        - Move a single file:
            python to_notes.py docker-gpu
            where "docker-gpu" comes from "https://dinhanhthi.com/docker-gpu/"
    """

    if file_name == "all":
        for file in lst_notes_in_samples:
            copy_move_single(file[11:file.rfind('.')], "move")
    else:
        copy_move_single(file_name, "move")


def copy_move_single(file_name, method="move"):
    full_name = get_full_name(file_name.strip(), lst_files_in_samples)
    if full_name:
        father_folder = get_parent_folder(
            full_name, sample_full_path, categories)
        srcfile = sample_full_path + "/" + full_name
        dstfile = notes_full_path + "/" + father_folder + "/" + full_name
        try:
            if method == "move" and file_name not in list_sample_files:
                rst = shutil.move(srcfile, dstfile)
                if rst:
                    print("✅  MOVED : " + sample_dir + '/' +
                          full_name + " 👉 " + notes_dir + '/' + father_folder + '/')
            elif method == "copy":
                rst = shutil.copy(srcfile, dstfile)
                if rst:
                    print("✅  COPIED : " + sample_dir + '/' +
                          full_name + " 👉 " + notes_dir + '/' + father_folder + '/')
        except:
            pass


if __name__ == "__main__":
    to_notes(sys.argv[1])
