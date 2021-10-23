import os
import sys
import shutil

def copy(os_name = 'mac'):
    '''Copy files from samples/ to notes/ based on the information given in a text file
    HOW TO USE?
    py copy_sample_posts.py
    '''

    if os_name == 'mac':
        dat_dir = '/Users/thi/git/dinhanhthi.com/'
    elif os_name == 'linux':
        dat_dir = '/home/thi/git/dinhanhthi.com/'
    elif os_name == 'win':
        dat_dir = '/home/thi/git/dinhanhthi.com/'
    else:
        print('OS not supported !!!')
        sys.exit(1)

    sample_dir = 'sample_posts/'
    notes_dir = 'notes/posts/'
    file_list_txt = dat_dir + 'scripts/list_sample_posts.txt'

    with open(file_list_txt) as f_input:
        for line in f_input:
            if (not line.startswith('--')):
                srcfile_path = dat_dir + sample_dir + line.split(',')[0].strip()
                dstfile_path = dat_dir + notes_dir + line.split(',')[1].strip()
                srcfile = os.path.split(srcfile_path)[1]
                dstdir = os.path.join(dstfile_path, srcfile)
                shutil.copy(srcfile_path, dstdir)
                print('✅  ' + sample_dir + line.split(',')[0].strip() + ' 👉 ' + notes_dir)

if __name__ == "__main__":
    copy(sys.argv[1])

