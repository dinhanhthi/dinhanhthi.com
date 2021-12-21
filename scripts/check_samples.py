# pyright: reportMissingModuleSource=false
from helper import (
    lst_notes_in_samples_in_short, lst_of_notes_in_notes_in_short,
    list_sample_files_real)
from colorama import Fore, init

init()  # use Colorama to make Termcolor work on Windows too


def check_samples():
    """Check notes in notes/sample_posts/ but not in list_sample_posts.txt
      HOW TO USE:
        python scripts/check_samples.py
        (on mac - for me only) check_samples
    """
    print(Fore.BLUE + "🍉 list_sample_posts.txt:" + Fore.RESET)
    print(list_sample_files_real)
    print("")

    print(Fore.GREEN + "🍏 Guests (not in list_sample_posts.txt) in samples:" + Fore.RESET)
    print(lst_notes_in_samples_in_short)

    notes_moved_to_samples = [
        file for file in lst_notes_in_samples_in_short
        if file not in lst_of_notes_in_notes_in_short]
    print("")
    print(Fore.YELLOW + "🍋 Notes MOVED to notes/sample_posts/ (NOT IN notes/)" + Fore.RESET)
    print(notes_moved_to_samples)
    print("")


if __name__ == "__main__":
    check_samples()
