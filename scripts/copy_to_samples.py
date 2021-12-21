import sys
from to_samples import to_samples


def copy_to_samples(file_name):
    """
    Copy the file to the samples directory.
    """
    to_samples(file_name, "copy")


if __name__ == "__main__":
    copy_to_samples(sys.argv[1])
