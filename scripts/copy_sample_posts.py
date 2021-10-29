import shutil

from helper import (categories, file_list_txt, get_full_name,
                    get_parent_folder, lst_files_in_samples, notes_dir, list_sample_files,
                    notes_full_path, sample_dir, sample_full_path)


def copy():
    """Copy files listed in  from samples/ to notes/posts/
    HOW TO USE?
        python copy_sample_posts.py
    """

    for line in list_sample_files:
        if (not line.startswith("#")):
            full_name = get_full_name(line.strip(), lst_files_in_samples)
            if full_name:
                father_folder = get_parent_folder(
                    full_name, sample_full_path, categories)
                srcfile = sample_full_path + "/" + full_name
                dstfile = notes_full_path + "/" + father_folder + "/" + full_name
                try:
                    rst = shutil.copy(srcfile, dstfile)
                    if rst:
                        print("✅  " + sample_dir + "/" + full_name +
                              " 👉 " + notes_dir + "/" + father_folder + "/")
                except:
                    pass


if __name__ == "__main__":
    copy()
