import sys
from to_notes import copy_move_single


def copy_to_notes(file_name):
    """
    Copy a file to the notes directory.
    """
    copy_move_single(file_name, "copy")


if __name__ == "__main__":
    copy_to_notes(sys.argv[1])
