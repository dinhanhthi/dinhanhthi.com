import sys
import shutil
from helper import (
    get_full_name, note_mode_list, lst_files_in_samples, lst_files_note_mode,
    sample_full_path, sample_dir, note_mode_dir, lst_mdnjk_note_mode,
    note_mode_full_path, lst_mdnjk_in_samples, dat_dir)


def turn_note_mode(turn_on="off"):
    """ Copy all files from sample_posts/ to note_mode_posts/
            except the files listed in note_mode_list.txt
        We use this script to build only the files in note_mode_list.txt
            (faster building time for quickly see the result when taking notes)
        HOW TO USE?
            python note_mode.py on    # turn on
            python note_mode.py off   # turn off
    """

    if turn_on == "on":
        print("lst_mdnjk_in_samples: ", lst_mdnjk_in_samples)
        for file in lst_mdnjk_in_samples:
            file_short = file[11:file.rfind('.')]
            if (file_short not in note_mode_list):
                full_name = get_full_name(
                    file_short.strip(),
                    lst_files_in_samples)
                if full_name:
                    srcfile = sample_full_path + "/" + full_name
                    dstfile = note_mode_full_path + "/" + full_name
                    try:
                        rst = shutil.move(srcfile, dstfile)
                        if rst:
                            print("✅  " + sample_dir + "/" + full_name +
                                  " 👉 " + note_mode_dir + "/")
                    except BaseException:
                        print("🚫 Cannot move file " + file +
                              " to " + note_mode_dir + "!!!")

        # Move pages/ to note_mode_pages/
        try:
            rst = shutil.move(dat_dir + "/pages", note_mode_full_path + "/")
            if rst:
                print("✅  /pages/ 👉 " + note_mode_dir + "/")
        except BaseException:
            print("🚫 Cannot move pages/ to " + note_mode_dir + "/!!!")
    elif turn_on == "off":
        # Move note_mode_posts/pages/* to pages/
        try:
            rst = shutil.move(note_mode_full_path + "/pages", dat_dir + "/")
            if rst:
                print("✅  Get pages/ back to root!")
        except BaseException:
            print("🚫 Cannot get pages/ back to root!!!")

        for file in lst_mdnjk_note_mode:
            file_short = file[11:file.rfind('.')]
            full_name = get_full_name(file_short.strip(), lst_files_note_mode)
            if full_name:
                srcfile = note_mode_full_path + "/" + full_name
                dstfile = sample_full_path + "/" + full_name
                try:
                    rst = shutil.move(srcfile, dstfile)
                    if rst:
                        print("✅  " + note_mode_dir + "/" + full_name +
                              " 👉 " + sample_dir + "/")
                except BaseException:
                    print("🚫 Cannot move file " + file +
                          " to " + sample_dir + "!!!")


if __name__ == "__main__":
    turn_note_mode(sys.argv[1])
