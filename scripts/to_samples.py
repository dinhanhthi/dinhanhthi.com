import os
import sys
import shutil

# file_name = "angular-1-basics-components-databinding-directives"
sample_dir = 'sample_posts/'
notes_dir = 'notes/posts/'

def to_samples(os_name = 'mac', file_name=''):
# def to_samples(os_name = 'mac'):
    """Find and copy a file from notes/posts/ to sample_posts/
    HOW TO USE?
    py to_samples.py mac docker-gpu
    """

    if os_name == 'mac':
        dat_dir = '/Users/thi/git/dinhanhthi.com/'
    elif os_name == 'linux':
        dat_dir = '/home/thi/git/dinhanhthi.com/'
    elif os_name == 'win':
        dat_dir = '/home/thi/git/dinhanhthi.com/'
    else:
        print('OS not supported !!!')
        sys.exit(1)

    sample_full_path = dat_dir + sample_dir
    notes_full_path = dat_dir + notes_dir

    for root, _, files in os.walk(notes_full_path):
        for name in files:
            if name.find(file_name) != -1:
                file_full_path = os.path.abspath(os.path.join(root, name))
                print (os.path.split(file_full_path)[1])
                shutil.copy(file_full_path, sample_full_path + os.path.split(file_full_path)[1])
                print('✅  ' + notes_dir + os.path.split(file_full_path)[1] + ' 👉 ' + sample_dir)


if __name__ == "__main__":
    to_samples(sys.argv[1], sys.argv[2])